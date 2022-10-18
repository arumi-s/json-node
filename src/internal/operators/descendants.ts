import { Node } from '../types';
import { isSelectableNode } from './isSelectableNode';

export function descendants(node: Node) {
	const list: Node[] = [];
	for (const child of node.children) if (isSelectableNode(child)) list.push(child, ...descendants(child));
	return list;
}
