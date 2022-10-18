import { Node } from '../types';
import { childNodes } from './childNodes';

export function lastIndexOf(node: Node): number {
	if (node.parent == null) return 0;
	const nodes = childNodes(node.parent);
	return nodes.length - nodes.indexOf(node) - 1;
}
