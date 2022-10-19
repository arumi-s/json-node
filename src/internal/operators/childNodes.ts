import { ElementNode } from '../types';
import { isSelectable } from './isSelectable';

export function childNodes(node: ElementNode) {
	return node.children.filter(isSelectable);
}
