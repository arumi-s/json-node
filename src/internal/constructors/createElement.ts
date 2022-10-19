import { AttrsMap, ElementNode } from '../types';
import { createAttrs } from './createAttrs';

export function createElement(tagName: string = '', attrsMap?: AttrsMap): ElementNode {
	return {
		tagName,
		attributes: createAttrs(attrsMap),
		parent: null,
		children: [],
	};
}
