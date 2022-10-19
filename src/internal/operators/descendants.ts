import { ElementNode } from '../types';
import { isSelectable } from './isSelectable';

export function descendants(node: ElementNode) {
	const list: ElementNode[] = [];
	for (const child of node.children) if (isSelectable(child)) list.push(child, ...descendants(child));
	return list;
}
