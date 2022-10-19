import { AnyNode } from '../types';

export function isAny(value: unknown): value is AnyNode {
	return value != null && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, 'tagName');
}
