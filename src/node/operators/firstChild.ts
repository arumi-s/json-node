import { Node } from '../../interfaces/node.interface';
import { isSelectableNode } from './isSelectableNode';

export function firstChild(node: Node) {
	return node.children.find(isSelectableNode);
}
