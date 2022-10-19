import { DocumentNode } from '../types';
import { isAny } from './isAny';

export function isDocument(value: unknown): value is DocumentNode {
	return isAny(value) && value.tagName === '#document';
}
