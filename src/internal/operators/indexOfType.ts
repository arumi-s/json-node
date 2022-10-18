import { Node } from '../types';
import { siblings } from './siblings';

export function indexOfType(node: Node): number {
	return node.parent == null
		? 0
		: siblings(node)
				.filter((sibling) => sibling.tagName === node.tagName)
				.indexOf(node);
}
