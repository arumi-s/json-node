import { parse } from './doc';
import {
	childNodes,
	createElement,
	findFirst,
	getAttribute,
	insertAfter,
	insertBefore,
	nextSibling,
	previousSibling,
	removeAttr,
	removeAttribute,
	setAttribute,
} from '../src';

describe('JsonNode check manipulation', () => {
	it('setAttribute', () => {
		const doc = parse(`<div id="attr-div1" class="attr-div" align="center" TiTle="Title Text"></div>`);
		const node = findFirst(doc, '#attr-div1')!;

		expect(getAttribute(node, 'align')).toStrictEqual('center');
		expect(getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(getAttribute(node, 'title')).toBeUndefined();
		expect(getAttribute(node, 'valign')).toBeUndefined();

		setAttribute(node, 'align', 'left');
		setAttribute(node, 'valign', 'middle');
		setAttribute(node, 'title', 'Other Title Text');

		expect(getAttribute(node, 'align')).toStrictEqual('left');
		expect(getAttribute(node, 'valign')).toStrictEqual('middle');
		expect(getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(getAttribute(node, 'title')).toStrictEqual('Other Title Text');
	});

	it('removeAttribute', () => {
		const doc = parse(`<div id="attr-div1" class="attr-div" align="center" TiTle="Title Text"></div>`);
		const node = findFirst(doc, '#attr-div1')!;

		expect(getAttribute(node, 'align')).toStrictEqual('center');
		expect(getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(getAttribute(node, 'title')).toBeUndefined();

		removeAttribute(node, 'align');
		removeAttribute(node, 'title');

		expect(getAttribute(node, 'align')).toBeUndefined();
		expect(getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(getAttribute(node, 'title')).toBeUndefined();
	});

	it('removeAttr', () => {
		const doc = parse(`<div id="attr-div1" class="attr-div" align="center" AlIgn="left" TiTle="Title Text"></div>`);
		const node = findFirst(doc, '#attr-div1')!;

		expect(getAttribute(node, 'class')).toStrictEqual('attr-div');
		expect(getAttribute(node, 'align')).toStrictEqual('center');
		expect(getAttribute(node, 'AlIgn')).toStrictEqual('left');
		expect(getAttribute(node, 'TiTle')).toStrictEqual('Title Text');
		expect(getAttribute(node, 'title')).toBeUndefined();

		removeAttr(node, ['align']);

		expect(getAttribute(node, 'class')).toBeUndefined();
		expect(getAttribute(node, 'align')).toStrictEqual('center');
		expect(getAttribute(node, 'AlIgn')).toBeUndefined();
		expect(getAttribute(node, 'TiTle')).toBeUndefined();
		expect(getAttribute(node, 'title')).toBeUndefined();
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
		const parentNode = findFirst(doc, '#universal')!;
		const refNode = findFirst(doc, '#universal-p2')!;
		const newNode = createElement('div', { id: newId });

		expect(childNodes(parentNode)).toHaveLength(5);
		expect(findFirst(doc, `#${newId}`)).toBeUndefined();

		insertAfter(parentNode, newNode, refNode);

		expect(childNodes(parentNode)).toHaveLength(6);

		const foundNode = findFirst(doc, `#${newId}`)!;
		expect(foundNode).toBeDefined();
		expect(foundNode).toStrictEqual(newNode);
		expect(parentNode.children).toContain(newNode);
		expect(newNode.parent).toStrictEqual(parentNode);
		expect(previousSibling(foundNode)).toStrictEqual(refNode);
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

		const parentNode = findFirst(doc, '#universal')!;
		const refNode = findFirst(doc, '#universal-p2')!;

		expect(childNodes(parentNode)).toHaveLength(5);

		const extParentNode = findFirst(doc, '#external')!;
		const extNode = findFirst(doc, '#external-p1')!;
		expect(extNode.parent).toStrictEqual(extParentNode);

		insertAfter(parentNode, extNode, refNode);

		expect(childNodes(parentNode)).toHaveLength(6);

		const foundNode2 = findFirst(doc, `#external-p1`)!;
		expect(foundNode2).toBeDefined();
		expect(foundNode2).toStrictEqual(extNode);
		expect(extParentNode.children).not.toContain(extNode);
		expect(parentNode.children).toContain(extNode);
		expect(extNode.parent).toStrictEqual(parentNode);
		expect(previousSibling(foundNode2)).toStrictEqual(refNode);
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
		const parentNode = findFirst(doc, '#universal')!;
		const refNode = findFirst(doc, '#universal-p2')!;
		const newNode = createElement('div', { id: newId });

		expect(childNodes(parentNode)).toHaveLength(5);
		expect(findFirst(doc, `#${newId}`)).toBeUndefined();

		insertBefore(parentNode, newNode, refNode);

		expect(childNodes(parentNode)).toHaveLength(6);

		const foundNode = findFirst(doc, `#${newId}`)!;
		expect(foundNode).toBeDefined();
		expect(foundNode).toStrictEqual(newNode);
		expect(parentNode.children).toContain(newNode);
		expect(newNode.parent).toStrictEqual(parentNode);
		expect(nextSibling(foundNode)).toStrictEqual(refNode);
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

		const parentNode = findFirst(doc, '#universal')!;
		const refNode = findFirst(doc, '#universal-p2')!;

		expect(childNodes(parentNode)).toHaveLength(5);

		const extParentNode = findFirst(doc, '#external')!;
		const extNode = findFirst(doc, '#external-p1')!;
		expect(extNode.parent).toStrictEqual(extParentNode);

		insertBefore(parentNode, extNode, refNode);

		expect(childNodes(parentNode)).toHaveLength(6);

		const foundNode2 = findFirst(doc, `#external-p1`)!;
		expect(foundNode2).toBeDefined();
		expect(foundNode2).toStrictEqual(extNode);
		expect(extParentNode.children).not.toContain(extNode);
		expect(parentNode.children).toContain(extNode);
		expect(extNode.parent).toStrictEqual(parentNode);
		expect(nextSibling(foundNode2)).toStrictEqual(refNode);
	});
});
