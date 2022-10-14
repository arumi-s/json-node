import { JsonNode, XmlNode } from '../src';

describe('JsonNode check convertion', () => {
	it('fromTxml', () => {
		const obj: Partial<XmlNode> = {
			tagName: 'html',
			attributes: [
				{ name: 'id', value: 'root' },
				{ name: 'lang', value: 'en' },
			],
			children: ['text'],
		};
		const node = JsonNode.fromTxml(JSON.parse(JSON.stringify(obj)) as XmlNode)!;

		expect(node).toBeDefined();
		expect(node.tagName).toStrictEqual('html');
		expect(node.attributes).toHaveLength(2);
		expect(node.children).toHaveLength(1);
	});

	it('fromTxml without tagName', () => {
		const obj: Partial<XmlNode> = { attributes: [], children: ['text'] };
		const node = JsonNode.fromTxml(JSON.parse(JSON.stringify(obj)) as XmlNode)!;

		expect(node).toBeDefined();
		expect(node.tagName).toStrictEqual('');
		expect(node.attributes).toHaveLength(0);
		expect(node.children).toHaveLength(1);
	});

	it('fromTxml without attributes', () => {
		const obj: Partial<XmlNode> = { tagName: 'html', children: ['text'] };
		const node = JsonNode.fromTxml(JSON.parse(JSON.stringify(obj)) as XmlNode)!;

		expect(node).toBeDefined();
		expect(node.tagName).toStrictEqual('html');
		expect(node.attributes).toHaveLength(0);
		expect(node.children).toHaveLength(1);
	});

	it('fromTxml without children', () => {
		const obj: Partial<XmlNode> = { tagName: 'html', attributes: [] };
		const node = JsonNode.fromTxml(JSON.parse(JSON.stringify(obj)) as XmlNode)!;

		expect(node).toBeDefined();
		expect(node.tagName).toStrictEqual('html');
		expect(node.attributes).toHaveLength(0);
		expect(node.children).toHaveLength(0);
	});
});
