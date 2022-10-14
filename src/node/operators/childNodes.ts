import { Node } from '../../interfaces/node.interface';
import { isSelectableNode } from './isSelectableNode';

export function childNodes(node: Node) {
	return node.children.filter(isSelectableNode);
}
