import { ChildNode, ParentNode } from '../types';
import { removeChild } from './removeChild';

export function appendChild(node: ParentNode, child: ChildNode) {
	if (node !== child) {
		if (child.parent) removeChild(child.parent, child);
		child.parent = node;
		node.children.push(child);
	}
}
