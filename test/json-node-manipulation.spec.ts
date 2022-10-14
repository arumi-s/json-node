import { parse } from './doc';
import { JsonNode } from '../src';

describe('JsonNode check manipulation', () => {
	it('setAttribute', () => {
		const doc = parse(`<div id="attr-div1" class="attr-div" align="center" TiTle="Title Text"></div>`);
		const node = JsonNode.findFirst(doc, '#attr-div1')!;

		expect(JsonNode.getAttribute(node, 'align')).toStrictEqual('center');
		expect(JsonNode.getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(JsonNode.getAttribute(node, 'title')).toBeUndefined();
		expect(JsonNode.getAttribute(node, 'valign')).toBeUndefined();

		JsonNode.setAttribute(node, 'align', 'left');
		JsonNode.setAttribute(node, 'valign', 'middle');
		JsonNode.setAttribute(node, 'title', 'Other Title Text');

		expect(JsonNode.getAttribute(node, 'align')).toStrictEqual('left');
		expect(JsonNode.getAttribute(node, 'valign')).toStrictEqual('middle');
		expect(JsonNode.getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(JsonNode.getAttribute(node, 'title')).toStrictEqual('Other Title Text');
	});

	it('removeAttribute', () => {
		const doc = parse(`<div id="attr-div1" class="attr-div" align="center" TiTle="Title Text"></div>`);
		const node = JsonNode.findFirst(doc, '#attr-div1')!;

		expect(JsonNode.getAttribute(node, 'align')).toStrictEqual('center');
		expect(JsonNode.getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(JsonNode.getAttribute(node, 'title')).toBeUndefined();

		JsonNode.removeAttribute(node, 'align');
		JsonNode.removeAttribute(node, 'title');

		expect(JsonNode.getAttribute(node, 'align')).toBeUndefined();
		expect(JsonNode.getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(JsonNode.getAttribute(node, 'title')).toBeUndefined();
	});

	it('removeAttr', () => {
		const doc = parse(`<div id="attr-div1" class="attr-div" align="center" AlIgn="left" TiTle="Title Text"></div>`);
		const node = JsonNode.findFirst(doc, '#attr-div1')!;

		expect(JsonNode.getAttribute(node, 'class')).toStrictEqual('attr-div');
		expect(JsonNode.getAttribute(node, 'align')).toStrictEqual('center');
		expect(JsonNode.getAttribute(node, 'AlIgn')).toStrictEqual('left');
		expect(JsonNode.getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(JsonNode.getAttribute(node, 'title')).toBeUndefined();

		JsonNode.removeAttr(node, ['align']);

		expect(JsonNode.getAttribute(node, 'class')).toBeUndefined();
		expect(JsonNode.getAttribute(node, 'align')).toStrictEqual('center');
		expect(JsonNode.getAttribute(node, 'AlIgn')).toBeUndefined();
		expect(JsonNode.getAttribute(node, 'TiTle')).toBeUndefined();
		expect(JsonNode.getAttribute(node, 'title')).toBeUndefined();
	});

	it('insertAfter with new node', () => {
		const doc = parse(`<html>
	<div id="universal">
		<p id="universal-p1"></p>
		<p id="universal-p2"></p>
		<p id="universal-p3"></p>
		<p id="universal-p4"></p>
		<p id="universal-p5"></p>
	</div>
</html>
`);

		const newId = 'universal-insert1';
		const parentNode = JsonNode.findFirst(doc, '#universal')!;
		const refNode = JsonNode.findFirst(doc, '#universal-p2')!;
		const newNode = JsonNode.createNode('div', { id: newId });

		expect(JsonNode.childNodes(parentNode)).toHaveLength(5);
		expect(JsonNode.findFirst(doc, `#${newId}`)).toBeUndefined();

		JsonNode.insertAfter(parentNode, newNode, refNode);

		expect(JsonNode.childNodes(parentNode)).toHaveLength(6);

		const foundNode = JsonNode.findFirst(doc, `#${newId}`)!;
		expect(foundNode).toBeDefined();
		expect(foundNode).toStrictEqual(newNode);
		expect(parentNode.children).toContain(newNode);
		expect(newNode.parent).toStrictEqual(parentNode);
		expect(JsonNode.previousSibling(foundNode)).toStrictEqual(refNode);
	});

	it('insertAfter with existing node', () => {
		const doc = parse(`<html>
	<div id="universal">
		<p id="universal-p1"></p>
		<p id="universal-p2"></p>
		<p id="universal-p3"></p>
		<p id="universal-p4"></p>
		<p id="universal-p5"></p>
	</div>
	<div id="external">
		<p id="external-p1"></p>
	</div>
</html>
`);

		const parentNode = JsonNode.findFirst(doc, '#universal')!;
		const refNode = JsonNode.findFirst(doc, '#universal-p2')!;

		expect(JsonNode.childNodes(parentNode)).toHaveLength(5);

		const extParentNode = JsonNode.findFirst(doc, '#external')!;
		const extNode = JsonNode.findFirst(doc, '#external-p1')!;
		expect(extNode.parent).toStrictEqual(extParentNode);

		JsonNode.insertAfter(parentNode, extNode, refNode);

		expect(JsonNode.childNodes(parentNode)).toHaveLength(6);

		const foundNode2 = JsonNode.findFirst(doc, `#external-p1`)!;
		expect(foundNode2).toBeDefined();
		expect(foundNode2).toStrictEqual(extNode);
		expect(extParentNode.children).not.toContain(extNode);
		expect(parentNode.children).toContain(extNode);
		expect(extNode.parent).toStrictEqual(parentNode);
		expect(JsonNode.previousSibling(foundNode2)).toStrictEqual(refNode);
	});

	it('insertBefore with new node', () => {
		const doc = parse(`<html>
	<div id="universal">
		<p id="universal-p1"></p>
		<p id="universal-p2"></p>
		<p id="universal-p3"></p>
		<p id="universal-p4"></p>
		<p id="universal-p5"></p>
	</div>
</html>
`);

		const newId = 'universal-insert1';
		const parentNode = JsonNode.findFirst(doc, '#universal')!;
		const refNode = JsonNode.findFirst(doc, '#universal-p2')!;
		const newNode = JsonNode.createNode('div', { id: newId });

		expect(JsonNode.childNodes(parentNode)).toHaveLength(5);
		expect(JsonNode.findFirst(doc, `#${newId}`)).toBeUndefined();

		JsonNode.insertBefore(parentNode, newNode, refNode);

		expect(JsonNode.childNodes(parentNode)).toHaveLength(6);

		const foundNode = JsonNode.findFirst(doc, `#${newId}`)!;
		expect(foundNode).toBeDefined();
		expect(foundNode).toStrictEqual(newNode);
		expect(parentNode.children).toContain(newNode);
		expect(newNode.parent).toStrictEqual(parentNode);
		expect(JsonNode.nextSibling(foundNode)).toStrictEqual(refNode);
	});

	it('insertBefore with existing node', () => {
		const doc = parse(`<html>
	<div id="universal">
		<p id="universal-p1"></p>
		<p id="universal-p2"></p>
		<p id="universal-p3"></p>
		<p id="universal-p4"></p>
		<p id="universal-p5"></p>
	</div>
	<div id="external">
		<p id="external-p1"></p>
	</div>
</html>
`);

		const parentNode = JsonNode.findFirst(doc, '#universal')!;
		const refNode = JsonNode.findFirst(doc, '#universal-p2')!;

		expect(JsonNode.childNodes(parentNode)).toHaveLength(5);

		const extParentNode = JsonNode.findFirst(doc, '#external')!;
		const extNode = JsonNode.findFirst(doc, '#external-p1')!;
		expect(extNode.parent).toStrictEqual(extParentNode);

		JsonNode.insertBefore(parentNode, extNode, refNode);

		expect(JsonNode.childNodes(parentNode)).toHaveLength(6);

		const foundNode2 = JsonNode.findFirst(doc, `#external-p1`)!;
		expect(foundNode2).toBeDefined();
		expect(foundNode2).toStrictEqual(extNode);
		expect(extParentNode.children).not.toContain(extNode);
		expect(parentNode.children).toContain(extNode);
		expect(extNode.parent).toStrictEqual(parentNode);
		expect(JsonNode.nextSibling(foundNode2)).toStrictEqual(refNode);
	});
});
