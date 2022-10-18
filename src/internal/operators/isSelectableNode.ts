import { Node } from '../types';
import { _isNodeInternal } from './isNodeInternal';

export function isSelectableNode(value: unknown): value is Node {
	return _isNodeInternal(value) ? value.tagName !== '' && !value.tagName.startsWith('?') && !value.tagName.startsWith('!') : false;
}
