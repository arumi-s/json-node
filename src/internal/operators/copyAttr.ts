import { ElementNode } from '../types';
import { setAttribute } from './setAttribute';

export function copyAttr(from: ElementNode, to: ElementNode) {
	from.attributes.forEach((a) => setAttribute(to, a.name, a.value));
	return to;
}
