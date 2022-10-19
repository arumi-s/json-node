import { ElementNode } from '../types';
import { isSelectable } from './isSelectable';

export function firstChild(node: ElementNode) {
	return node.children.find(isSelectable);
}
