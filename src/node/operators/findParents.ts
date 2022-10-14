import { Node } from '../../interfaces/node.interface';
import { parseSelector } from '../../Selector';
import { parents } from './parents';

export function findParents(node: Node, selector: string) {
	return parents(node).filter((node2) => parseSelector(selector)(node2, node));
}
