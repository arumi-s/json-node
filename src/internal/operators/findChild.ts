import { ElementNode } from '../types';
import { Selector } from '../Selector';
import { childNodes } from './childNodes';

export function findChild(node: ElementNode, selector: string) {
	return childNodes(node).find((node2) => Selector.parse(selector)(node2, node));
}
