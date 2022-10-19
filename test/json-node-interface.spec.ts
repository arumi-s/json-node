import { getTestDoc } from './doc';
import { find, findChild, findChildren, findFirst, fromJson, isElement, textContent, toJson } from '../src';

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
			expect(isElement(childNode)).toBeTruthy();
		}
	});

	it('findChildren returns an array of child nodes', () => {
		const nodes = findChildren(root, 'div');
		expect(Array.isArray(nodes)).toBeTruthy();
		for (const childNode of nodes) {
			expect(isElement(childNode)).toBeTruthy();
			expect(childNode.parent).toStrictEqual(root);
		}
	});

	it('textContent returns concatenated contents of decedent text nodes', () => {
		const node = findFirst(root, '#universal-p1')!;
		expect(textContent(node)).toStrictEqual('Universal selector tests inside element with id="universal".');
	});

	it('textContent returns concatenated contents of decedent text nodes (ignore comments)', () => {
		const node = findFirst(root, '#pseudo-nth-p1')!;
		expect(textContent(node)).toStrictEqual('span1em1em2span2strong1em3span3span4strong2em4');
	});

	it('converts to json', () => {
		const json = toJson(root);
		expect(json).toBeDefined();

		const back = fromJson(json);
		expect(json).toBeDefined();
		expect(toJson(back)).toStrictEqual(json);
	});
});
