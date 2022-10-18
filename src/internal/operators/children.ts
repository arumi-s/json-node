import { Node } from '../types';

export function children(node: Node) {
	return [...node.children];
}
