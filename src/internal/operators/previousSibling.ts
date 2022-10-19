import { ElementNode } from '../types';
import { childNodes } from './childNodes';

export function previousSibling(node: ElementNode) {
	if (node.parent == null) return null;
	const siblingNodes = childNodes(node.parent);
	const nodeIndex = siblingNodes.indexOf(node);
	return nodeIndex === 0 ? null : siblingNodes[nodeIndex - 1];
}
