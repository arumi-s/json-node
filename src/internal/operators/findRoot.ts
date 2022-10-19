import { DocumentNode, ElementNode, ParentNode } from '../types';
import { childNodes } from './childNodes';
import { isDocument } from './isDocument';

export function findRoot(node: ElementNode | DocumentNode): ElementNode {
	if (isDocument(node)) {
		return childNodes(node)[0];
	}
	let current: ParentNode = node;
	while (!isDocument(current.parent)) {
		if (current.parent == null) break;
		current = current.parent;
	}
	return current;
}
