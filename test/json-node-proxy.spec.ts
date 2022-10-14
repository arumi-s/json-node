import { parse } from './doc';
import { InternalSymbol, proxify } from '../src/JsonNodeProxy';
import { findFirst, fromJson, isNode } from '../src/JsonNode';
import { isProxy } from 'util/types';

describe('JsonNodeProxy check interface', () => {
	const doc = parse(`<html id="root">
	<div id="target" class="class-a class-b" name="target-name" align="left">
		<p id="child-p1"></p>
		text 1
		<p id="child-p2"></p>
		text 2
		<p id="child-p3"></p>
	</div>
</html>`);
	const target = proxify(findFirst(doc, '#target')!);

	it('ownKeys', () => {
		const iterrables = ['tagName', 'attributes', 'parent', 'children', 'id', 'classList', 'name'];

		expect(Reflect.ownKeys(target)).toStrictEqual(iterrables);
		expect(Reflect.has(target, InternalSymbol)).toStrictEqual(true);
	});

	it('has property tagName', () => {
		expect(target).toHaveProperty('tagName');
		expect(target.tagName).toStrictEqual('div');
	});

	it('has property id', () => {
		expect(target).toHaveProperty('id');
		expect(target.id).toStrictEqual('target');
	});

	it('has property name', () => {
		expect(target).toHaveProperty('name');
		expect(target.name).toStrictEqual('target-name');
	});

	it('has property classList', () => {
		expect(target).toHaveProperty('classList');
		expect(target.classList).toStrictEqual(['class-a', 'class-b']);
	});

	it('has property attributes', () => {
		expect(target).toHaveProperty('attributes');
		expect(target.attributes).toHaveLength(4);
	});

	it('has property parent', () => {
		const child = proxify(findFirst(doc, '#child-p1')!);

		expect(child).toHaveProperty('parent');
		expect(child.parent).toBeDefined();
		expect(isProxy(child.parent)).toBeTruthy();
		expect(child.parent?.getAttribute('id', '')).toStrictEqual('target');

		const parent = child.parent;
		if (parent) {
			expect(parent).toHaveProperty('parent');
			expect(parent.parent).toBeDefined();
			expect(isProxy(parent.parent)).toBeTruthy();
			expect(parent.parent?.getAttribute('id', '')).toStrictEqual('root');
		}
	});

	it('has property children', () => {
		expect(target).toHaveProperty('children');
		expect(target.children).toHaveLength(5);
		for (const child of target.children) {
			expect(typeof child === 'string' || isProxy(child)).toBeTruthy();
		}
	});

	it('has property childNodes', () => {
		expect(target).toHaveProperty('childNodes');
		expect(target.childNodes).toHaveLength(3);
		for (const child of target.childNodes) {
			expect(isProxy(child)).toBeTruthy();
		}
	});

	it('find returns an array of nodes', () => {
		const nodes = target.find('p');
		expect(Array.isArray(nodes)).toBeTruthy();
		expect(nodes).toHaveLength(3);
		for (const childNode of nodes) {
			expect(isProxy(childNode)).toBeTruthy();
			expect(isNode(childNode)).toBeTruthy();
		}
	});

	it('findChildren returns an array of child nodes', () => {
		const nodes = target.findChildren('p');
		expect(Array.isArray(nodes)).toBeTruthy();
		expect(nodes).toHaveLength(3);
		for (const childNode of nodes) {
			expect(isProxy(childNode)).toBeTruthy();
			expect(isNode(childNode)).toBeTruthy();
			expect(childNode.parent?.getAttribute('id', '')).toStrictEqual('target');
		}
	});

	it('converts to json', () => {
		const json = target.toJson();
		expect(json).toBeDefined();

		const back = proxify(fromJson(json))!;
		expect(json).toBeDefined();
		expect(back.toJson()).toStrictEqual(json);
	});
});
