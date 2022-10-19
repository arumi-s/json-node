import { Checker, ElementNode } from '../types';
import { childNodes } from '../operators/childNodes';
import { getAttribute } from '../operators/getAttribute';
import { hasAttribute } from '../operators/hasAttribute';
import { indexOf } from '../operators/indexOf';
import { indexOfType } from '../operators/indexOfType';
import { lastIndexOf } from '../operators/lastIndexOf';
import { lastIndexOfType } from '../operators/lastIndexOfType';
import { parents } from '../operators/parents';
import { previousSibling } from '../operators/previousSibling';
import { textContent } from '../operators/textContent';
import { createSyntaxError } from './error';
import { unescape } from './unescape';
import {
	Token,
	TOKEN_SPACE,
	TOKEN_GT,
	TOKEN_PLUS,
	TOKEN_TILDE,
	TOKEN_IDENT,
	TOKEN_MINUS,
	TOKEN_COMMA,
	TOKEN_COLON,
	TOKEN_ROUND_OPEN,
	TOKEN_ROUND_CLOSE,
	TOKEN_SQUARE_OPEN,
	TOKEN_SQUARE_CLOSE,
	TOKEN_QUOTE,
	TOKEN_STRING,
	TOKEN_EQUAL,
	TOKEN_CARET_EQUAL,
	TOKEN_DOLLAR_EQUAL,
	TOKEN_ASTERISK_EQUAL,
	TOKEN_TILDE_EQUAL,
	TOKEN_PIPE_EQUAL,
	TOKEN_HASH,
	TOKEN_NUMBER,
	TOKEN_DOT,
	TOKEN_ASTERISK,
} from './tokens';

export function parseTokens(tokens: Token[]): Checker {
	const groupedCheckers: Checker[] = [];
	let chainedCheckers: [number, Checker][] = [];
	let checkers: Checker[] = [];
	const length = tokens.length + 1;
	let cursor = 0;

	const skip = (...types: number[]): boolean => {
		if (types.includes(tokens[cursor]?.type)) {
			++cursor;
			return true;
		}
		return false;
	};
	const is = (...types: number[]): Token | null => {
		const next = tokens[cursor];
		return next && types.includes(next.type) ? next : null;
	};
	const not = (...types: number[]): Token | null => {
		const next = tokens[cursor];
		return next && !types.includes(next.type) ? next : null;
	};
	const nextName = (...extraTokens: number[]): Token | null => {
		let start: number | null = null;
		let end: number | null = null;
		let text = '';
		let next = is(TOKEN_IDENT, TOKEN_MINUS, ...extraTokens);
		while (next) {
			if (start == null) start = next.start;
			end = next.end;
			text += next.text;
			++cursor;
			next = is(TOKEN_IDENT, TOKEN_MINUS, ...extraTokens);
		}
		return text.length === 0 || start == null || end == null
			? null
			: {
					type: TOKEN_IDENT,
					text,
					start,
					end,
			  };
	};

	while (cursor < length) {
		const token = tokens[cursor++];

		if (token == null || token.type === TOKEN_COMMA) {
			if (checkers.length > 0) {
				const grouped = groupCheckers(checkers);
				if (grouped) {
					chainedCheckers.unshift([TOKEN_SPACE, grouped]);
					checkers = [];
				}
			}
			const chained = chainCheckers(chainedCheckers);
			if (chained) {
				groupedCheckers.push(chained);
				chainedCheckers = [];
				continue;
			}
		} else if (token.type === TOKEN_SPACE || token.type === TOKEN_GT || token.type === TOKEN_PLUS || token.type === TOKEN_TILDE) {
			const grouped = groupCheckers(checkers);
			if (grouped) {
				chainedCheckers.unshift([token.type, grouped]);
				checkers = [];
				continue;
			}
			if (token.type === TOKEN_SPACE) {
				continue;
			}
		} else if (token.type === TOKEN_COLON) {
			const extraColon = is(TOKEN_COLON) ? token : null;
			if (extraColon) cursor++;
			const nameToken = nextName();
			if (nameToken) {
				const pseudoName = nameToken.text;
				if (pseudoName === 'root') {
					checkers.push((node) => node.parent == null || node.parent.tagName === '');
					continue;
				} else if (pseudoName === 'scope') {
					checkers.push((node, scope) => node === scope);
					continue;
				} else if (pseudoName === 'empty') {
					checkers.push((node) => childNodes(node).length === 0 && textContent(node).length === 0);
					continue;
				} else if (pseudoName === 'disabled') {
					checkers.push((node) => ['disabled', 'true'].includes(getAttribute(node, 'disabled') ?? ''));
					continue;
				} else if (pseudoName === 'enabled') {
					checkers.push((node) => !['disabled', 'true'].includes(getAttribute(node, 'disabled') ?? ''));
					continue;
				} else if (pseudoName === 'first-child') {
					checkers.push((node) => indexOf(node) === 0);
					continue;
				} else if (pseudoName === 'last-child') {
					checkers.push((node) => lastIndexOf(node) === 0);
					continue;
				} else if (pseudoName === 'only-child') {
					checkers.push((node) => node.parent == null || childNodes(node.parent).length === 1);
					continue;
				} else if (pseudoName === 'first-of-type') {
					checkers.push((node) => indexOfType(node) === 0);
					continue;
				} else if (pseudoName === 'last-of-type') {
					checkers.push((node) => lastIndexOfType(node) === 0);
					continue;
				} else if (pseudoName === 'only-of-type') {
					checkers.push((node) => indexOfType(node) === 0 && lastIndexOfType(node) === 0);
					continue;
				} else if (['first-letter', 'first-line', 'before', 'after'].includes(pseudoName)) {
					checkers.push(() => false);
					continue;
				}
				const pseudoParam: Token[] = [];

				skip(TOKEN_ROUND_OPEN);
				let paramToken: Token | null;
				while ((paramToken = not(TOKEN_ROUND_CLOSE))) {
					++cursor;
					pseudoParam.push(paramToken);
				}
				skip(TOKEN_ROUND_CLOSE);

				if (pseudoName === 'nth-child') {
					const expr = parseExpression(pseudoParam);
					if (expr) {
						checkers.push((node) => expr(indexOf(node) + 1));
						continue;
					}
				} else if (pseudoName === 'nth-last-child') {
					const expr = parseExpression(pseudoParam);
					if (expr) {
						checkers.push((node) => expr(lastIndexOf(node) + 1));
						continue;
					}
				} else if (pseudoName === 'nth-of-type') {
					const expr = parseExpression(pseudoParam);
					if (expr) {
						checkers.push((node) => expr(indexOfType(node) + 1));
						continue;
					}
				} else if (pseudoName === 'nth-last-of-type') {
					const expr = parseExpression(pseudoParam);
					if (expr) {
						checkers.push((node) => expr(lastIndexOfType(node) + 1));
						continue;
					}
				} else if (pseudoName === 'not') {
					const notChecker = parseTokens(pseudoParam);
					if (notChecker) {
						checkers.push((node, scope) => !notChecker(node, scope));
						continue;
					}
				} else if (['slotted'].includes(pseudoName)) {
					checkers.push(() => false);
					continue;
				} else {
					throw createSyntaxError(extraColon ?? nameToken);
				}
			}
		} else if (token.type === TOKEN_SQUARE_OPEN) {
			const nameToken = nextName(TOKEN_COLON);
			if (nameToken) {
				const attrName = nameToken.text;
				let attrValue: string | null = null;
				const cmpToken = not(TOKEN_SQUARE_CLOSE);
				if (cmpToken) {
					++cursor;
					skip(TOKEN_QUOTE);
					const valueToken = is(TOKEN_STRING, TOKEN_IDENT);
					if (valueToken) {
						++cursor;
						attrValue = valueToken.text;
					} else attrValue = '';
					skip(TOKEN_QUOTE);
				}

				if (attrValue == null) {
					checkers.push((node) => hasAttribute(node, attrName));
				} else {
					let attrValueUnescape = unescape(attrValue);
					if (cmpToken != null) {
						if (cmpToken.type === TOKEN_EQUAL) {
							checkers.push((node) => getAttribute(node, attrName) === attrValueUnescape);
						} else if (cmpToken.type === TOKEN_CARET_EQUAL) {
							checkers.push((node) => attrValueUnescape !== '' && !!getAttribute(node, attrName)?.startsWith(attrValueUnescape));
						} else if (cmpToken.type === TOKEN_DOLLAR_EQUAL) {
							checkers.push((node) => attrValueUnescape !== '' && !!getAttribute(node, attrName)?.endsWith(attrValueUnescape));
						} else if (cmpToken.type === TOKEN_ASTERISK_EQUAL) {
							attrValueUnescape = attrValueUnescape.trim();
							checkers.push((node) => attrValueUnescape !== '' && !!getAttribute(node, attrName)?.includes(attrValueUnescape));
						} else if (cmpToken.type === TOKEN_TILDE_EQUAL) {
							checkers.push((node) => {
								if (attrValueUnescape === '') return false;
								const list = getAttribute(node, attrName, '').split(' ');
								return list.length > 0 && list.includes(attrValueUnescape);
							});
						} else if (cmpToken.type === TOKEN_PIPE_EQUAL) {
							checkers.push((node) => {
								if (attrValueUnescape === '') return false;
								const list = getAttribute(node, attrName, '').split('-');
								return list.length > 0 && list.includes(attrValueUnescape);
							});
						} else throw createSyntaxError(cmpToken);
					}
				}
				if (skip(TOKEN_SQUARE_CLOSE)) {
					continue;
				}
				if (tokens[cursor + 1] == null) continue;
			}
		} else if (token.type === TOKEN_IDENT) {
			--cursor;
			const nameToken = nextName();
			if (nameToken) {
				const nodeName = unescape(nameToken.text);
				checkers.push((node) => node.tagName === nodeName);
				continue;
			}
		} else if (token.type === TOKEN_HASH) {
			const nameToken = nextName(TOKEN_NUMBER);
			if (nameToken) {
				const nodeName = unescape(nameToken.text);
				checkers.push((node) => getAttribute(node, 'id') === nodeName);
				continue;
			}
		} else if (token.type === TOKEN_DOT) {
			const nameToken = nextName();
			if (nameToken) {
				const nodeName = unescape(nameToken.text);
				checkers.push((node) => getAttribute(node, 'class', '').split(' ').includes(nodeName));
				continue;
			}
		} else if (token.type === TOKEN_ASTERISK) {
			if (checkers.length === 0) {
				checkers.unshift((node) => node.tagName !== '');
			}
			continue;
		}
		throw createSyntaxError(token);
	}

	if (groupedCheckers.length === 0) {
		throw new SyntaxError(`The provided selector is empty.`);
	}

	return (node, scope) => groupedCheckers.some((check) => check(node, scope));
}

function groupCheckers(checkers: Checker[]): Checker | null {
	if (checkers.length) {
		return (node, scope) => checkers.every((check) => check(node, scope));
	}
	return null;
}

function chainCheckers(checkers: [number, Checker][]): Checker | null {
	if (checkers.length === 0) return null;
	if (checkers.length === 1) return checkers[0][1];
	return (node, scope) => {
		if (!checkers[0][1](node, scope)) return false;
		for (let index = 1, parent: ElementNode | undefined = node; parent != null; index++) {
			const [type, check] = checkers[index];
			if (parent.parent) {
				if (type === TOKEN_SPACE) {
					parent = parents(parent, true).find((node2) => check(node2, scope));
				} else if (type === TOKEN_GT) {
					parent = check(parent.parent, scope) ? parent.parent : undefined;
				} else if (type === TOKEN_PLUS) {
					const prev = previousSibling(parent);
					parent = prev && check(prev, scope) ? prev : undefined;
				} else if (type === TOKEN_TILDE) {
					const nodeIndex = indexOf(parent);
					if (nodeIndex === 0) parent = undefined;
					else {
						const precursors = childNodes(parent.parent).slice(0, nodeIndex);
						parent = precursors.find((node2) => check(node2, scope));
					}
				}
			} else parent = undefined;
			if (parent != null && index === checkers.length - 1) return true;
		}
		return false;
	};
}

function parseExpression(expr: Token[]): ((index: number) => boolean) | null {
	if (expr.length === 0) return null;
	if (expr.length <= 5) {
		let pos = 0;
		let multiplier = 1;
		let offset = 0;

		const firstSign = expr[pos] && (expr[pos].type === TOKEN_PLUS || expr[pos].type === TOKEN_MINUS) ? expr[pos].type : null;
		if (firstSign) pos++;

		let firstNumber: number | undefined = undefined;
		if (expr[pos] && expr[pos].type === TOKEN_NUMBER) {
			firstNumber = parseInt(expr[pos].text, 10);
			pos++;
		}

		const hasVariable = expr[pos] && expr[pos].type === TOKEN_IDENT;
		if (hasVariable) {
			if (expr[pos].text !== 'n') throw createSyntaxError(expr[pos]);
			pos++;
		}

		const secondSign = expr[pos] && (expr[pos].type === TOKEN_PLUS || expr[pos].type === TOKEN_MINUS) ? expr[pos].type : null;
		if (secondSign) pos++;

		let secondNumber: number | undefined = undefined;
		if (secondSign != null) {
			if (expr[pos] && expr[pos].type === TOKEN_NUMBER) {
				secondNumber = parseInt(expr[pos].text, 10);
				pos++;
			} else {
				throw createSyntaxError(expr[pos]);
			}
		}

		if (pos !== expr.length) throw createSyntaxError(expr[pos]);

		if (hasVariable) {
			multiplier = firstNumber ?? 1;
		}
		if (secondSign != null) {
			if (secondSign === TOKEN_PLUS) {
				offset = secondNumber ?? 0;
			} else if (secondSign === TOKEN_MINUS) {
				offset = -(secondNumber ?? 0);
			}
		}

		if (hasVariable) {
			if (firstSign === TOKEN_MINUS) {
				return (index) => {
					index -= offset;
					return index <= 0 && index % multiplier === 0;
				};
			} else {
				return (index) => {
					index -= offset;
					return index >= 0 && index % multiplier === 0;
				};
			}
		} else {
			return (index) => index === firstNumber;
		}
	}
	throw createSyntaxError(expr[5]);
}
