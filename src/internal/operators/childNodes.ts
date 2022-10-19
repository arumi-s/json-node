import { ParentNode } from '../types';
import { isSelectable } from './isSelectable';

export function childNodes(node: ParentNode) {
	return node.children.filter(isSelectable);
}
