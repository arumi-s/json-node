import { ElementNode } from '../types';

export function hasAttribute(node: ElementNode, name: string) {
	return node.attributes.some((attr) => attr.name === name);
}
