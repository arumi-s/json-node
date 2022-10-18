import { Node } from '../types';
import { _isNodeInternal } from './isNodeInternal';
import { removeChild } from './removeChild';

export function appendChild(node: Node, child: Node | string) {
	if (_isNodeInternal(child)) {
		if (node !== child) {
			if (child.parent) removeChild(child.parent, child);
			child.parent = node;
			node.children.push(child);
		}
	} else {
		node.children.push(child);
	}
}
