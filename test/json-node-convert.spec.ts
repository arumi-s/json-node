import { fromJson, NodeExport } from '../src';

describe('JsonNode can convert', () => {
	it('fromJson', () => {
		const obj: Partial<NodeExport> = {
			name: 'html',
			attr: {
				id: 'root',
				lang: 'en',
			},
			child: ['text'],
		};
		const node = fromJson(JSON.parse(JSON.stringify(obj)) as NodeExport)!;

		expect(node).toBeDefined();
		expect(node.tagName).toStrictEqual('html');
		expect(node.attributes).toHaveLength(2);
		expect(node.children).toHaveLength(1);
	});

	it('fromJson without tagName', () => {
		const obj: Partial<NodeExport> = { attr: {}, child: ['text'] };
		const node = fromJson(JSON.parse(JSON.stringify(obj)) as NodeExport)!;

		expect(node).toBeDefined();
		expect(node.tagName).toStrictEqual('');
		expect(node.attributes).toHaveLength(0);
		expect(node.children).toHaveLength(1);
	});

	it('fromJson without attributes', () => {
		const obj: Partial<NodeExport> = { name: 'html', child: ['text'] };
		const node = fromJson(JSON.parse(JSON.stringify(obj)) as NodeExport)!;

		expect(node).toBeDefined();
		expect(node.tagName).toStrictEqual('html');
		expect(node.attributes).toHaveLength(0);
		expect(node.children).toHaveLength(1);
	});

	it('fromJson without children', () => {
		const obj: Partial<NodeExport> = { name: 'html', attr: {} };
		const node = fromJson(JSON.parse(JSON.stringify(obj)) as NodeExport)!;

		expect(node).toBeDefined();
		expect(node.tagName).toStrictEqual('html');
		expect(node.attributes).toHaveLength(0);
		expect(node.children).toHaveLength(0);
	});
});
