import { ElementNode } from '../types';
import { isElement } from './isElement';

export function isSelectable(value: unknown): value is ElementNode {
	return isElement(value) && value.tagName !== '' && !value.tagName.startsWith('?') && !value.tagName.startsWith('!');
}
