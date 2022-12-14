import { ElementNode } from '../types';
import { Selector } from '../Selector';
import { descendants } from './descendants';

export function find(node: ElementNode, selector: string) {
	return descendants(node).filter((node2) => Selector.parse(selector)(node2, node));
}
