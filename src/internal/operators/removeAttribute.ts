import { Node } from '../types';

export function removeAttribute(node: Node, name: string) {
	const index = node.attributes.findIndex((attr) => attr.name === name);
	if (index >= 0) node.attributes.splice(index, 1);
}