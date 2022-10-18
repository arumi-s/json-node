import { Node } from '../types';

export function parents(node: Node, excludeSelf = false) {
	const list: Node[] = [];
	let current: Node | null = node;
	if (excludeSelf) current = current.parent;
	while (current) {
		list.push(current);
		current = current.parent;
	}
	return list;
}
