import { AnyNode } from '../types';

export function isAny(value: unknown): value is AnyNode {
	return typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'tagName');
}
