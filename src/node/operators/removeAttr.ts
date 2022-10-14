import { Node } from '../../interfaces/node.interface';
import { removeAttribute } from './removeAttribute';

export function removeAttr(node: Node, except?: string[]) {
	node.attributes
		.map((n) => n.name)
		.filter((a) => except == null || !except.includes(a))
		.forEach((a) => removeAttribute(node, a));
}
