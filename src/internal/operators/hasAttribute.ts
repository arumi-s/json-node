import { Node } from '../types';

export function hasAttribute(node: Node, name: string) {
	return node.attributes.some((attr) => attr.name === name);
}
