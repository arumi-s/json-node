import { Node } from '../../interfaces/node.interface';
import { parseSelector } from '../../Selector';
import { childNodes } from './childNodes';

export function findChildren(node: Node, selector: string) {
	return childNodes(node).filter((node2) => parseSelector(selector)(node2, node));
}
