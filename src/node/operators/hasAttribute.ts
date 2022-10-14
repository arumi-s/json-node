import { Node } from '../../interfaces/node.interface';

export function hasAttribute(node: Node, name: string) {
	return node.attributes.some((attr) => attr.name === name);
}
