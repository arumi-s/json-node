import { ElementNode } from '../types';

export function parents(node: ElementNode, excludeSelf = false) {
	const list: ElementNode[] = [];
	let current: ElementNode | null = node;
	if (excludeSelf) current = current.parent;
	while (current) {
		list.push(current);
		current = current.parent;
	}
	return list;
}
