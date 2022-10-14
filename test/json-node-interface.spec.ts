import { getTestDoc } from './doc';
import { JsonNode } from '../src';

describe('JsonNode check interface', () => {
	const root = JsonNode.findChild(getTestDoc(), ':root')!;

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
		const nodes = JsonNode.find(root, 'div');
		expect(Array.isArray(nodes)).toBeTruthy();
		for (const childNode of nodes) {
			expect(JsonNode.isNode(childNode)).toBeTruthy();
		}
	});

	it('findChildren returns an array of child nodes', () => {
		const nodes = JsonNode.findChildren(root, 'div');
		expect(Array.isArray(nodes)).toBeTruthy();
		for (const childNode of nodes) {
			expect(JsonNode.isNode(childNode)).toBeTruthy();
			expect(childNode.parent).toStrictEqual(root);
		}
	});

	it('converts to json', () => {
		const json = JsonNode.toJson(root);
		expect(json).toBeDefined();

		const back = JsonNode.fromJson(json);
		expect(json).toBeDefined();
		expect(JsonNode.toJson(back)).toStrictEqual(json);
	});
});
