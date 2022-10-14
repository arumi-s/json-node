import { Node } from '../../interfaces/node.interface';
import { parseSelector } from '../../Selector';
import { descendants } from './descendants';

export function findFirst(node: Node, selector: string) {
	return descendants(node).find((node2) => parseSelector(selector)(node2, node));
}
