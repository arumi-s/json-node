import { Node } from '../types';
import { setAttribute } from './setAttribute';

export function copyAttr(from: Node, to: Node) {
	from.attributes.forEach((a) => setAttribute(to, a.name, a.value));
	return to;
}
