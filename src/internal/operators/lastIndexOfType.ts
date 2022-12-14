import { ElementNode } from '../types';
import { siblings } from './siblings';

export function lastIndexOfType(node: ElementNode) {
	if (node.parent == null) return 0;
	const nodes = siblings(node).filter((sibling) => sibling.tagName === node.tagName);
	return nodes.length - nodes.indexOf(node) - 1;
}
