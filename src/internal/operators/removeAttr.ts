import { ElementNode } from '../types';
import { removeAttribute } from './removeAttribute';

export function removeAttr(node: ElementNode, except?: string[]) {
	node.attributes
		.map((n) => n.name)
		.filter((a) => except == null || !except.includes(a))
		.forEach((a) => removeAttribute(node, a));
}
