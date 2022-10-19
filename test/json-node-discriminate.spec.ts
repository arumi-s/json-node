import { isComment, isDocument, isElement, isSelectable, isText } from '../src/operators';
import { CommentNode, DocumentNode, ElementNode, TextNode } from '../src/internal/types';
import { _isComment } from '../src/internal/operators/_isComment';
import { _isDocument } from '../src/internal/operators/_isDocument';
import { _isElement } from '../src/internal/operators/_isElement';
import { _isText } from '../src/internal/operators/_isText';

describe('JsonNode can discriminate', () => {
	const commentNode: CommentNode = { tagName: '#comment', parent: null, text: '<!-- content >' };
	const documentNode: DocumentNode = { tagName: '#document', attributes: [], parent: null, children: [] };
	const elementNode: ElementNode = { tagName: 'div', attributes: [{ name: 'id', value: 'div-01' }], parent: null, children: [] };
	const textNode: TextNode = { tagName: '#text', parent: null, text: 'content' };

	const doctypeNode: ElementNode = {
		tagName: '?xml',
		attributes: [
			{ name: 'version', value: '1.0' },
			{ name: 'encoding', value: 'UTF-8' },
		],
		parent: null,
		children: [],
	};
	const cdataNode: ElementNode = { tagName: '![CDATA[]]>', attributes: [], parent: null, children: [] };

	const nullNode = null;
	const unknownNode = { tagName: '' };
	const emptyNode = {};
	const invalidNode = 'node';

	it('isComment checks CommentNode', () => {
		expect(isComment(commentNode)).toStrictEqual(true);
		expect(isComment(documentNode)).toStrictEqual(false);
		expect(isComment(elementNode)).toStrictEqual(false);
		expect(isComment(textNode)).toStrictEqual(false);
		expect(isComment(doctypeNode)).toStrictEqual(false);
		expect(isComment(cdataNode)).toStrictEqual(false);
		expect(isComment(nullNode)).toStrictEqual(false);
		expect(isComment(unknownNode)).toStrictEqual(false);
		expect(isComment(emptyNode)).toStrictEqual(false);
		expect(isComment(invalidNode)).toStrictEqual(false);

		expect(_isComment(commentNode)).toStrictEqual(true);
		expect(_isComment(documentNode)).toStrictEqual(false);
		expect(_isComment(elementNode)).toStrictEqual(false);
		expect(_isComment(textNode)).toStrictEqual(false);
		expect(_isComment(doctypeNode)).toStrictEqual(false);
		expect(_isComment(cdataNode)).toStrictEqual(false);
	});

	it('isDocument checks DocumentNode', () => {
		expect(isDocument(commentNode)).toStrictEqual(false);
		expect(isDocument(documentNode)).toStrictEqual(true);
		expect(isDocument(elementNode)).toStrictEqual(false);
		expect(isDocument(textNode)).toStrictEqual(false);
		expect(isDocument(doctypeNode)).toStrictEqual(false);
		expect(isDocument(cdataNode)).toStrictEqual(false);
		expect(isDocument(nullNode)).toStrictEqual(false);
		expect(isDocument(unknownNode)).toStrictEqual(false);
		expect(isDocument(emptyNode)).toStrictEqual(false);
		expect(isDocument(invalidNode)).toStrictEqual(false);

		expect(_isDocument(commentNode)).toStrictEqual(false);
		expect(_isDocument(documentNode)).toStrictEqual(true);
		expect(_isDocument(elementNode)).toStrictEqual(false);
		expect(_isDocument(textNode)).toStrictEqual(false);
		expect(_isDocument(doctypeNode)).toStrictEqual(false);
		expect(_isDocument(cdataNode)).toStrictEqual(false);
	});

	it('isElement checks ElementNode', () => {
		expect(isElement(commentNode)).toStrictEqual(false);
		expect(isElement(documentNode)).toStrictEqual(false);
		expect(isElement(elementNode)).toStrictEqual(true);
		expect(isElement(textNode)).toStrictEqual(false);
		expect(isElement(doctypeNode)).toStrictEqual(true);
		expect(isElement(cdataNode)).toStrictEqual(true);
		expect(isElement(nullNode)).toStrictEqual(false);
		expect(isElement(unknownNode)).toStrictEqual(false);
		expect(isElement(emptyNode)).toStrictEqual(false);
		expect(isElement(invalidNode)).toStrictEqual(false);

		expect(_isElement(commentNode)).toStrictEqual(false);
		expect(_isElement(documentNode)).toStrictEqual(false);
		expect(_isElement(elementNode)).toStrictEqual(true);
		expect(_isElement(textNode)).toStrictEqual(false);
		expect(_isElement(doctypeNode)).toStrictEqual(true);
		expect(_isElement(cdataNode)).toStrictEqual(true);
	});

	it('isText checks TextNode', () => {
		expect(isText(commentNode)).toStrictEqual(false);
		expect(isText(documentNode)).toStrictEqual(false);
		expect(isText(elementNode)).toStrictEqual(false);
		expect(isText(textNode)).toStrictEqual(true);
		expect(isText(doctypeNode)).toStrictEqual(false);
		expect(isText(cdataNode)).toStrictEqual(false);
		expect(isText(nullNode)).toStrictEqual(false);
		expect(isText(unknownNode)).toStrictEqual(false);
		expect(isText(emptyNode)).toStrictEqual(false);
		expect(isText(invalidNode)).toStrictEqual(false);

		expect(_isText(commentNode)).toStrictEqual(false);
		expect(_isText(documentNode)).toStrictEqual(false);
		expect(_isText(elementNode)).toStrictEqual(false);
		expect(_isText(textNode)).toStrictEqual(true);
		expect(_isText(doctypeNode)).toStrictEqual(false);
		expect(_isText(cdataNode)).toStrictEqual(false);
	});

	it('isSelectable checks selectable nodes', () => {
		expect(isSelectable(commentNode)).toStrictEqual(false);
		expect(isSelectable(documentNode)).toStrictEqual(false);
		expect(isSelectable(elementNode)).toStrictEqual(true);
		expect(isSelectable(textNode)).toStrictEqual(false);
		expect(isSelectable(doctypeNode)).toStrictEqual(false);
		expect(isSelectable(cdataNode)).toStrictEqual(false);
		expect(isSelectable(nullNode)).toStrictEqual(false);
		expect(isSelectable(unknownNode)).toStrictEqual(false);
		expect(isSelectable(emptyNode)).toStrictEqual(false);
		expect(isSelectable(invalidNode)).toStrictEqual(false);
	});
});
