import { Node } from '../types';
import { isSelectableNode } from './isSelectableNode';

export function childNodes(node: Node) {
	return node.children.filter(isSelectableNode);
}
