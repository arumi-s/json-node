import { getTestDoc } from './doc';
import {
	isDocument,
	find,
	findChildren,
	findFirst,
	fromJson,
	isElement,
	textContent,
	toJson,
	findRoot,
	getAttribute,
	children,
	descendants,
	descendantsIt,
	findParent,
	findParents,
	parents,
	findChild,
} from '../src/operators';
import { ChildNode } from '../src/internal/types';

function matchNode(node: ChildNode, expects: string) {
	expect(node).not.toBeUndefined();

	if (isElement(node)) {
		expect(getAttribute(node, 'id')).toStrictEqual(expects);
	} else {
		expect(node.tagName).toStrictEqual(expects);
	}
}

function matchNodes(nodes: ChildNode[], expects: string[]) {
	expect(nodes).not.toBeUndefined();
	expect(Array.isArray(nodes)).toStrictEqual(true);
	expect(nodes).toHaveLength(expects.length);
	for (let k = 0; k < expects.length; k++) {
		matchNode(nodes[k], expects[k]);
	}
}

describe('JsonNode can interface', () => {
	const doc = getTestDoc();

	it('parse xml to DocumentNode', () => {
		expect(isDocument(doc)).toStrictEqual(true);
	});

	it('findRoot returns document root element from DocumentNode', () => {
		expect(doc).toBeDefined();
		matchNode(findRoot(doc), 'html');
	});

	it('findRoot returns document root element from ChildNode', () => {
		const node = findFirst(doc, '#id')!;
		expect(doc).toBeDefined();
		matchNode(node, 'id');
		matchNode(findRoot(node), 'html');
	});

	const root = findRoot(doc);

	it('has property tagName', () => {
		expect(root).toHaveProperty('tagName');
		expect(root.tagName).toStrictEqual('html');
	});

	it('has property attributes', () => {
		expect(root).toHaveProperty('attributes');
		expect(root.attributes).toHaveLength(2);
	});

	it('has property children', () => {
		const node = findFirst(doc, '#pseudo-first-child')!;

		expect(node).toBeDefined();
		expect(node).toHaveProperty('children');
		matchNodes(node.children, [
			'pseudo-first-child-div1',
			'pseudo-first-child-div2',
			'pseudo-first-child-div3',
			'pseudo-first-child-p1',
			'pseudo-first-child-p2',
			'pseudo-first-child-p3',
		]);
	});

	it('children returns an array of children', () => {
		const node = findFirst(doc, '#pseudo-first-child')!;

		expect(node).toBeDefined();
		matchNodes(children(node), [
			'pseudo-first-child-div1',
			'pseudo-first-child-div2',
			'pseudo-first-child-div3',
			'pseudo-first-child-p1',
			'pseudo-first-child-p2',
			'pseudo-first-child-p3',
		]);
	});

	it('descendants returns an array of descendants', () => {
		const node = findFirst(doc, '#pseudo-first-child')!;

		expect(node).toBeDefined();
		matchNodes(descendants(node), [
			'pseudo-first-child-div1',
			'pseudo-first-child-div2',
			'pseudo-first-child-div3',
			'pseudo-first-child-p1',
			'pseudo-first-child-span1',
			'pseudo-first-child-span2',
			'pseudo-first-child-p2',
			'pseudo-first-child-span3',
			'pseudo-first-child-span4',
			'pseudo-first-child-p3',
			'pseudo-first-child-span5',
			'pseudo-first-child-span6',
		]);
	});

	it('descendantsIt returns an array of descendants', () => {
		const node = findFirst(doc, '#pseudo-first-child')!;

		expect(node).toBeDefined();

		const iterator = descendantsIt(node);
		expect(iterator).toHaveProperty('next');
		matchNodes(
			[...iterator],
			[
				'pseudo-first-child-div1',
				'pseudo-first-child-div2',
				'pseudo-first-child-div3',
				'pseudo-first-child-p1',
				'pseudo-first-child-span1',
				'pseudo-first-child-span2',
				'pseudo-first-child-p2',
				'pseudo-first-child-span3',
				'pseudo-first-child-span4',
				'pseudo-first-child-p3',
				'pseudo-first-child-span5',
				'pseudo-first-child-span6',
			],
		);
	});

	it('parents returns itself an array of parent nodes', () => {
		const node = findFirst(doc, '#universal-a2')!;

		expect(node).toBeDefined();
		matchNodes(parents(node), ['universal-a2', 'universal-code2', 'universal-address1', 'universal', 'root', 'body', 'html', '#document']);
	});

	it('parents (excludeSelf) returns an array of parent nodes', () => {
		const node = findFirst(doc, '#universal-a2')!;

		expect(node).toBeDefined();
		matchNodes(parents(node, true), ['universal-code2', 'universal-address1', 'universal', 'root', 'body', 'html', '#document']);
	});

	it('findFirst returns the first matching node', () => {
		const node = findFirst(doc, '#universal')!;

		expect(node).toBeDefined();
		matchNode(findFirst(node, 'a')!, 'universal-a1');
	});

	it('find returns an array of matching nodes', () => {
		const node = findFirst(doc, '#universal')!;

		expect(node).toBeDefined();
		matchNodes(find(node, 'a'), ['universal-a1', 'universal-a2']);
	});

	it('findChild returns the first matching child node', () => {
		const node = findFirst(doc, '#pseudo-first-child')!;

		expect(node).toBeDefined();
		matchNode(findChild(node, 'div')!, 'pseudo-first-child-div1');
	});

	it('findChildren returns an array of matching child nodes', () => {
		const node = findFirst(doc, '#pseudo-first-child')!;

		expect(node).toBeDefined();
		matchNodes(findChildren(node, 'div'), ['pseudo-first-child-div1', 'pseudo-first-child-div2', 'pseudo-first-child-div3']);
	});

	it('findParent returns the first matching parent node', () => {
		const node = findFirst(doc, '#universal-a2')!;

		const parent = findParent(node, 'address')!;
		expect(parent).toBeDefined();
		expect(getAttribute(parent, 'id')).toStrictEqual('universal-address1');

		const noParent = findParent(node, 'ul')!;
		expect(noParent).toBeUndefined();
	});

	it('findParents returns an array of matching parent nodes', () => {
		const node = findFirst(doc, '#adjacent-p1')!;

		expect(node).toBeDefined();
		matchNodes(findParents(node, 'div'), ['adjacent-div4', 'adjacent', 'root']);
	});

	it('textContent returns concatenated contents of decedent text nodes', () => {
		const node = findFirst(doc, '#universal-p1')!;

		expect(node).toBeDefined();
		expect(textContent(node)).toStrictEqual('Universal selector tests inside element with id="universal".');
	});

	it('textContent returns concatenated contents of decedent text nodes (ignore comments)', () => {
		const node = findFirst(doc, '#pseudo-nth-p1')!;

		expect(node).toBeDefined();
		expect(textContent(node)).toStrictEqual('span1em1em2span2strong1em3span3span4strong2em4');
	});

	it('toJson converts DocumentNode to json', () => {
		const json = toJson(doc);
		expect(json).toBeDefined();

		const back = fromJson(json);
		expect(json).toBeDefined();
		expect(toJson(back)).toStrictEqual(json);
	});

	it('toJson converts ElementNode to json', () => {
		const json = toJson(root);
		expect(json).toBeDefined();

		const back = fromJson(json);
		expect(json).toBeDefined();
		expect(toJson(back)).toStrictEqual(json);
	});
});
