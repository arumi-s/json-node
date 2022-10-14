import { Node } from '../../interfaces/node.interface';
import { parseSelector } from '../../Selector';
import { descendants } from './descendants';

export function find(node: Node, selector: string) {
	return descendants(node).filter((node2) => parseSelector(selector)(node2, node));
}
