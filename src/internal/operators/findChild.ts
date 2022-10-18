import { Node } from '../types';
import { Selector } from '../Selector';
import { childNodes } from './childNodes';

export function findChild(node: Node, selector: string) {
	return childNodes(node).find((node2) => Selector.parse(selector)(node2, node));
}
