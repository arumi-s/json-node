import { Node } from '../types';
import { isComment } from './isComment';
import { isNode } from './isNode';

export function textContent(node: Node): string {
	return node.children.map((n) => (isNode(n) ? textContent(n) : isComment(n) ? '' : n)).join('');
}
