import { Node } from '../../interfaces/node.interface';

export function children(node: Node) {
	return [...node.children];
}
