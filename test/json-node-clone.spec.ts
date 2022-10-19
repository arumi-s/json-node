import { cloneAttr, cloneNode, copyAttr, copyChild, createAttrsMap, findFirst, findRoot, toJson } from '../src/operators';
import { getTestDoc, parse } from './doc';

describe('JsonNode can clone', () => {
	it('cloneNode shallow', () => {
		const doc = getTestDoc();
		const root = findRoot(doc);
		const clone = cloneNode(root);
		expect(toJson(clone)).toStrictEqual(toJson({ ...root, children: [] }));
		expect(clone).not.toBe(root);
	});

	it('cloneNode deep', () => {
		const doc = getTestDoc();
		const root = findRoot(doc);
		const clone = cloneNode(root, true);
		expect(toJson(clone)).toStrictEqual(toJson(root));
		expect(clone).not.toBe(root);
	});

	it('cloneAttr', () => {
		const attr = { name: 'id', value: 'text' };
		const clone = cloneAttr(attr);
		expect(clone).toStrictEqual(attr);
		expect(clone).not.toBe(attr);
	});

	it('copyAttr', () => {
		const doc = parse(`<html id="root">
		<div id="div-from" class="class-a class-b" name="target-name" align="left">
		</div>
		<div id="div-to" class="class-c" align="right">
		</div>
	</html>`);
		const from = findFirst(doc, '#div-from')!;
		const to = findFirst(doc, '#div-to')!;

		expect(createAttrsMap(from.attributes)).not.toStrictEqual(createAttrsMap(to.attributes));

		copyAttr(from, to);

		expect(createAttrsMap(from.attributes)).toStrictEqual(createAttrsMap(to.attributes));
		expect(from.attributes).not.toBe(to.attributes);
	});

	it('copyChild', () => {
		const doc = parse(`<html id="root">
		<div id="div-from">
			<p id="child-p1"></p>
			text 1
			<p id="child-p2"></p>
			text 2
			<p id="child-p3"></p>
		</div>
		<div id="div-to">
			<p id="child-p4"></p>
		</div>
	</html>`);
		const from = findFirst(doc, '#div-from')!;
		const to = findFirst(doc, '#div-to')!;

		copyChild(from, to);

		expect(toJson(from).child).toStrictEqual(toJson(to).child?.slice(1));
		expect(from.children).not.toBe(to.children);
	});
});
