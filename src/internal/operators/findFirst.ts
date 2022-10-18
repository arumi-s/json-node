import { Node } from '../types';
import { Selector } from '../Selector';
import { descendants } from './descendants';

export function findFirst(node: Node, selector: string) {
	return descendants(node).find((node2) => Selector.parse(selector)(node2, node));
}
