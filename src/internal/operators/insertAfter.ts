import { ElementNode } from '../types';
import { removeChild } from './removeChild';

export function insertAfter(node: ElementNode, child: ElementNode, ref: ElementNode) {
	if (node !== child && child !== ref && ref.parent === node) {
		if (child.parent) removeChild(child.parent, child);
		child.parent = node;
		node.children.splice(node.children.indexOf(ref) + 1, 0, child);
	}
}
