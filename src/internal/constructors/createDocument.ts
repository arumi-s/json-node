import { DocumentNode } from '../types';

export function createDocument(): DocumentNode {
	return {
		tagName: '#document',
		attributes: [],
		parent: null,
		children: [],
	};
}
