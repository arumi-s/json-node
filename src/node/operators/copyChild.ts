import { Node } from '../../interfaces/node.interface';
import { appendChild } from './appendChild';
import { cloneNode } from './cloneNode';
import { _isNodeInternal } from './isNodeInternal';

export function copyChild(from: Node, to: Node) {
	from.children.forEach((n) => appendChild(to, _isNodeInternal(n) ? cloneNode(n, true) : n));
	return to;
}
