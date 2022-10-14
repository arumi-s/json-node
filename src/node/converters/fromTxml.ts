import { Node } from '../../interfaces/node.interface';
import { XmlNode } from '../../interfaces/xml.interface';
import { appendChild } from '../operators/appendChild';
import { isNode } from '../operators/isNode';

export function fromTxml(json: XmlNode | null): Node | null {
	if (json == null) return null;
	const node: Node = {
		tagName: json.tagName ?? '',
		attributes: json.attributes ?? [],
		parent: null,
		children: [],
	};
	if (json.children) {
		json.children.forEach((child: any) => {
			if (isNode(child)) {
				const childNode = fromTxml(child);
				if (childNode) appendChild(node, childNode);
			} else {
				appendChild(node, child as string);
			}
		});
	}
	return node;
}
