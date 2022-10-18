import { getTestDoc } from './doc';
import { find, findChild, findChildren, fromJson, isNode, toJson } from '../src';

describe('JsonNode check interface', () => {
	const root = findChild(getTestDoc(), ':root')!;

	it('has property tagName', () => {
		expect(root).toHaveProperty('tagName');
		expect(root.tagName).toStrictEqual('html');
	});

	it('has property attributes', () => {
		expect(root).toHaveProperty('attributes');
		expect(root.attributes).toHaveLength(2);
	});

	it('has property children', () => {
		expect(root).toHaveProperty('children');
		expect(root.children).toHaveLength(2);
	});

	it('find returns an array of nodes', () => {
		const nodes = find(root, 'div');
		expect(Array.isArray(nodes)).toBeTruthy();
		for (const childNode of nodes) {
			expect(isNode(childNode)).toBeTruthy();
		}
	});

	it('findChildren returns an array of child nodes', () => {
		const nodes = findChildren(root, 'div');
		expect(Array.isArray(nodes)).toBeTruthy();
		for (const childNode of nodes) {
			expect(isNode(childNode)).toBeTruthy();
			expect(childNode.parent).toStrictEqual(root);
		}
	});

	it('converts to json', () => {
		const json = toJson(root);
		expect(json).toBeDefined();

		const back = fromJson(json);
		expect(json).toBeDefined();
		expect(toJson(back)).toStrictEqual(json);
	});
});
