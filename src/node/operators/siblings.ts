import { Node } from '../../interfaces/node.interface';
import { childNodes } from './childNodes';

export function siblings(node: Node) {
	if (node.parent == null) return [node];
	return childNodes(node.parent);
}
