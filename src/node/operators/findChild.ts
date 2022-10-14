import { Node } from '../../interfaces/node.interface';
import { parseSelector } from '../../Selector';
import { childNodes } from './childNodes';

export function findChild(node: Node, selector: string) {
	return childNodes(node).find((node2) => parseSelector(selector)(node2, node));
}
