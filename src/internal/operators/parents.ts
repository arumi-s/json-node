import { ElementNode, ParentNode } from '../types';

export function parents(node: ElementNode, excludeSelf = false) {
	const list: ParentNode[] = [];
	let current: ParentNode | null = node;
	if (excludeSelf) current = current.parent;
	while (current) {
		list.push(current);
		current = current.parent;
	}
	return list;
}
