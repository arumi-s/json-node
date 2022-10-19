import { ElementNode } from '../types';
import { isAny } from './isAny';

export function isElement(value: unknown): value is ElementNode {
	return isAny(value) && !value.tagName.startsWith('#');
}
