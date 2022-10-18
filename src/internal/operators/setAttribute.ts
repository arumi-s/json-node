import { Node } from '../types';

export function setAttribute(node: Node, name: string, value: string) {
	const old = node.attributes.find((attr) => attr.name === name);
	if (old) old.value = value;
	else node.attributes.push({ name, value });
}
