import { ElementNode } from '../types';
import { descendants } from './descendants';
import { isSelectable } from './isSelectable';

export function* descendantsIt(node: ElementNode) {
	for (const child of node.children) {
		if (isSelectable(child)) {
			yield child;
			yield* descendants(child);
		}
	}
}
