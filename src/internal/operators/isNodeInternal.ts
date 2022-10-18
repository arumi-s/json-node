import { Node } from '../types';

export function _isNodeInternal(value: unknown): value is Node {
	return typeof value !== 'string';
}
