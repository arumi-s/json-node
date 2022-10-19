import { decode, DecodingMode, EntityLevel } from 'entities';
import { ParseXmlOptions, ElementNode, Attr, AnyNode } from '../internal/types';
import { _isElement } from '../internal/operators/_isElement';
import { _isText } from '../internal/operators/_isText';
import { createComment } from '../internal/constructors/createComment';
import { createElement } from '../internal/constructors/createElement';
import { createText } from '../internal/constructors/createText';

const decodeXML = (str: string): string => decode(str, { level: EntityLevel.HTML, mode: DecodingMode.Strict });

function toJsonNode(node: ElementNode): ElementNode {
	if (node.children) {
		node.children.forEach((child) => {
			if (_isElement(child)) child = toJsonNode(child);
			child.parent = node;
		});
	}
	return node;
}

const wrapXML = (tagName: string, children: AnyNode[]): ElementNode => ({
	tagName,
	attributes: [],
	parent: null,
	children,
});

export const parseXML = (S: string, options?: ParseXmlOptions): ElementNode => {
	options = options || {};

	let position = options.position || 0;

	const openBracket = '<';
	const openBracketCC = '<'.charCodeAt(0);
	const closeBracket = '>';
	const closeBracketCC = '>'.charCodeAt(0);
	const minusCC = '-'.charCodeAt(0);
	const slashCC = '/'.charCodeAt(0);
	const exclamationCC = '!'.charCodeAt(0);
	const singleQuoteCC = "'".charCodeAt(0);
	const doubleQuoteCC = '"'.charCodeAt(0);
	const openCornerBracketCC = '['.charCodeAt(0);
	const closeCornerBracketCC = ']'.charCodeAt(0);

	/**
	 * parsing a list of entries
	 */
	const parseChildren = (tagName: string): AnyNode[] => {
		const children: AnyNode[] = [];
		while (S[position]) {
			if (S.charCodeAt(position) === openBracketCC) {
				if (S.charCodeAt(position + 1) === slashCC) {
					const closeStart = position + 2;
					position = S.indexOf(closeBracket, position);

					const closeTag = S.substring(closeStart, position);
					if (!closeTag.includes(tagName)) {
						const parsedText = S.substring(0, position).split('\n');
						throw new Error(
							`Unexpected close tag\nLine: ${parsedText.length - 1}\nColumn: ${parsedText[parsedText.length - 1].length + 1}\nChar: ${
								S[position]
							}`,
						);
					}

					if (position + 1) position += 1;

					return children;
				} else if (S.charCodeAt(position + 1) === exclamationCC) {
					if (S.charCodeAt(position + 2) === minusCC) {
						// support comments
						const startCommentPos = position;
						while (
							position !== -1 &&
							!(
								S.charCodeAt(position) === closeBracketCC &&
								S.charCodeAt(position - 1) === minusCC &&
								S.charCodeAt(position - 2) === minusCC &&
								position !== -1
							)
						) {
							position = S.indexOf(closeBracket, position + 1);
						}
						if (position === -1) {
							position = S.length;
						}
						if (options?.keepComments === true) {
							children.push(createComment(S.substring(startCommentPos, position + 1)));
						}
					} else if (
						S.charCodeAt(position + 2) === openCornerBracketCC &&
						S.charCodeAt(position + 8) === openCornerBracketCC &&
						S.substring(position + 3, position + 8).toLowerCase() === 'cdata'
					) {
						// support cdata
						const cdataEndIndex = S.indexOf(']]>', position);
						if (cdataEndIndex === -1) {
							children.push(createText(S.substring(position + 9)));
							position = S.length;
						} else {
							children.push(createText(S.substring(position + 9, cdataEndIndex)));
							position = cdataEndIndex + 3;
						}
						continue;
					} else {
						// support doc type
						const startDoctype = position + 1;
						position += 2;
						let encapsuled = false;
						while ((S.charCodeAt(position) !== closeBracketCC || encapsuled === true) && S[position]) {
							if (S.charCodeAt(position) === openCornerBracketCC) {
								encapsuled = true;
							} else if (encapsuled === true && S.charCodeAt(position) === closeCornerBracketCC) {
								encapsuled = false;
							}
							position++;
						}
						children.push(createElement(S.substring(startDoctype, position)));
					}
					position++;
					continue;
				}
				const node = parseNode();
				if (node.tagName[0] === '?' || node.tagName[0] === '!') {
					if (options?.keepDeclarations === true) {
						children.push(node);
					}
					children.push(...node.children);
					node.children = [];
				} else {
					children.push(node);
				}
			} else {
				const text = parseText();
				if (text.trim().length > 0) children.push(createText(text));
				position++;
			}
		}
		return children;
	};

	/**
	 *    returns the text outside of texts until the first '<'
	 */
	const parseText = () => {
		const start = position;
		position = S.indexOf(openBracket, position) - 1;
		if (position === -2) position = S.length;
		return S.slice(start, position + 1);
	};
	/**
	 *    returns text until the first nonAlphabetic letter
	 */
	const nameSpacer = '\r\n\t>/= ';

	const parseName = () => {
		const start = position;
		while (!nameSpacer.includes(S[position]) && S[position]) {
			position++;
		}
		return S.slice(start, position);
	};
	/**
	 *    is parsing a node, including tagName, Attributes and its children,
	 * to parse children it uses the parseChildren again, that makes the parsing recursive
	 */
	const NoChildNodes = options.noChildNodes || [];

	const parseNode = (): ElementNode => {
		position++;
		const tagName = parseName();
		const attributes: Attr[] = [];
		let children: AnyNode[] = [];

		// parsing attributes
		while (S.charCodeAt(position) !== closeBracketCC && S[position]) {
			const c = S.charCodeAt(position);
			// check is abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ
			if ((c > 64 && c < 91) || (c > 96 && c < 123)) {
				const name = parseName();
				// search beginning of the string
				let code = S.charCodeAt(position);
				while (
					code &&
					code !== singleQuoteCC &&
					code !== doubleQuoteCC &&
					!((code > 64 && code < 91) || (code > 96 && code < 123)) &&
					code !== closeBracketCC
				) {
					position++;
					code = S.charCodeAt(position);
				}
				let value: string | null = null;
				if (code === singleQuoteCC || code === doubleQuoteCC) {
					value = decodeXML(parseString());
					if (position === -1) {
						return {
							tagName,
							attributes,
							parent: null,
							children,
						};
					}
				} else {
					value = null;
					position--;
				}
				if (value != null) {
					const oldAttribute = attributes.find((attr) => attr.name === name);
					if (oldAttribute) oldAttribute.value = value;
					else attributes.push({ name, value });
				}
			}
			position++;
		}
		// optional parsing of children
		if (S.charCodeAt(position - 1) !== slashCC) {
			if (tagName === 'script') {
				const start = position + 1;
				position = S.indexOf('</script>', position);
				children = [createText(S.slice(start, position))];
				position += 9;
			} else if (tagName === 'style') {
				const start = position + 1;
				position = S.indexOf('</style>', position);
				children = [createText(S.slice(start, position))];
				position += 8;
			} else if (!NoChildNodes.includes(tagName)) {
				position++;
				children = parseChildren(tagName);
			} else {
				position++;
			}
		} else {
			position++;
		}
		for (const child of children) {
			if (_isText(child)) {
				child.text = decodeXML(child.text);
			}
		}
		return {
			tagName,
			attributes,
			parent: null,
			children,
		};
	};

	/**
	 *    is parsing a string, that starts with a char and with the same usually  ' or "
	 */

	const parseString = () => {
		const startChar = S[position];
		const startPosition = position + 1;
		position = S.indexOf(startChar, startPosition);
		return S.slice(startPosition, position);
	};

	const out = parseChildren('');

	return toJsonNode(wrapXML('', out));
};
