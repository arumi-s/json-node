import { Node } from '../types';

export function removeChild(node: Node, child: Node) {
	if (node !== child) {
		const index = node.children.indexOf(child);
		if (index >= 0) node.children.splice(index, 1);
		child.parent = null;
	}
	return node;
}
