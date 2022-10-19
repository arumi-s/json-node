import { ElementNode } from '../types';
import { appendChild } from './appendChild';
import { cloneNode } from './cloneNode';

export function copyChild(from: ElementNode, to: ElementNode) {
	from.children.forEach((n) => appendChild(to, cloneNode(n, true)));
	return to;
}
