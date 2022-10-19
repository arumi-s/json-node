import { TextNode } from '../types';
import { isAny } from './isAny';

export function isText(value: unknown): value is TextNode {
	return isAny(value) && value.tagName === '#text';
}
