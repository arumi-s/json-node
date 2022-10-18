import { Node } from '../types';
import { Selector } from '../Selector';
import { parents } from './parents';

export function findParent(node: Node, selector: string) {
	return parents(node).find((node2) => Selector.parse(selector)(node2, node));
}
