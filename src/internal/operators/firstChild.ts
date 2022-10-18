import { Node } from '../types';
import { isSelectableNode } from './isSelectableNode';

export function firstChild(node: Node) {
	return node.children.find(isSelectableNode);
}
