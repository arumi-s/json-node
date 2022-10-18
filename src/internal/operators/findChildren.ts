import { Node } from '../types';
import { Selector } from '../Selector';
import { childNodes } from './childNodes';

export function findChildren(node: Node, selector: string) {
	return childNodes(node).filter((node2) => Selector.parse(selector)(node2, node));
}
