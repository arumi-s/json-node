import { ElementNode } from '../types';

export function children(node: ElementNode) {
	return [...node.children];
}
