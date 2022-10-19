import { ElementNode } from '../types';
import { childNodes } from './childNodes';

export function siblings(node: ElementNode) {
	if (node.parent == null) return [node];
	return childNodes(node.parent);
}
