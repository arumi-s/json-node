import { Node } from '../types';

export function getAttribute(node: Node, name: string): string | undefined;
export function getAttribute(node: Node, name: string, defaults: string): string;
export function getAttribute(node: Node, name: string, defaults?: string) {
	return node.attributes.find((attr) => attr.name === name)?.value ?? defaults;
}
