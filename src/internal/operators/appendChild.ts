import { AnyNode, ElementNode } from '../types';
import { removeChild } from './removeChild';

export function appendChild(node: ElementNode, child: AnyNode) {
	if (node !== child) {
		if (child.parent) removeChild(child.parent, child);
		child.parent = node;
		node.children.push(child);
	}
}
