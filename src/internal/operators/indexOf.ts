import { ElementNode } from '../types';
import { childNodes } from './childNodes';

export function indexOf(node: ElementNode): number {
	return node.parent == null ? 0 : childNodes(node.parent).indexOf(node);
}
