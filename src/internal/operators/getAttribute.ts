import { ElementNode } from '../types';

export function getAttribute(node: ElementNode, name: string): string | undefined;
export function getAttribute(node: ElementNode, name: string, defaults: string): string;
export function getAttribute(node: ElementNode, name: string, defaults?: string) {
	return node.attributes.find((attr) => attr.name === name)?.value ?? defaults;
}
