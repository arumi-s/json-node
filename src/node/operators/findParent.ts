import { Node } from '../../interfaces/node.interface';
import { parseSelector } from '../../Selector';
import { parents } from './parents';

export function findParent(node: Node, selector: string) {
	return parents(node).find((node2) => parseSelector(selector)(node2, node));
}
