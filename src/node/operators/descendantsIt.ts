import { Node } from '../../interfaces/node.interface';
import { descendants } from './descendants';
import { isSelectableNode } from './isSelectableNode';

export function* descendantsIt(node: Node) {
	for (const child of node.children) {
		if (isSelectableNode(child)) {
			yield child;
			yield* descendants(child);
		}
	}
}
