import { ElementNode } from '../types';

export function setAttribute(node: ElementNode, name: string, value: string) {
	const old = node.attributes.find((attr) => attr.name === name);
	if (old) old.value = value;
	else node.attributes.push({ name, value });
}
