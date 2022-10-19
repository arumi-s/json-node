import { ElementNode } from '../types';
import { Selector } from '../Selector';
import { parents } from './parents';

export function findParents(node: ElementNode, selector: string) {
	return parents(node).filter((node2) => Selector.parse(selector)(node2, node));
}
