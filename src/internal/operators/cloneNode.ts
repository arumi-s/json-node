import { Node } from '../types';
import { createAttrsMap } from '../constructors/createAttrsMap';
import { createNode } from '../constructors/createNode';
import { appendChild } from './appendChild';
import { _isNodeInternal } from './isNodeInternal';

export function cloneNode(node: Node, deep: boolean = false): Node {
	const clone = createNode(node.tagName, createAttrsMap(node.attributes));
	if (deep) {
		node.children.forEach((child) => {
			appendChild(clone, _isNodeInternal(child) ? cloneNode(child, true) : child);
		});
	}
	return clone;
}
