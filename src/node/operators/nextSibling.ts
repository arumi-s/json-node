import { Node } from '../../interfaces/node.interface';
import { childNodes } from './childNodes';

export function nextSibling(node: Node) {
	if (node.parent == null) return null;
	const siblingNodes = childNodes(node.parent);
	const nodeIndex = siblingNodes.indexOf(node);
	return nodeIndex === siblingNodes.length - 1 ? null : siblingNodes[nodeIndex + 1];
}
