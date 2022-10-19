import { AnyNode, ElementNode } from '../types';
import { createAttrsMap } from '../constructors/createAttrsMap';
import { createComment } from '../constructors/createComment';
import { createElement } from '../constructors/createElement';
import { createText } from '../constructors/createText';
import { appendChild } from './appendChild';
import { _isComment } from './_isComment';
import { _isText } from './_isText';
import { _isElement } from './_isElement';

export function cloneNode<N extends AnyNode>(node: N, deep: boolean = false): N {
	const clone = _isText(node)
		? createText(node.text)
		: _isComment(node)
		? createComment(node.text)
		: createElement(node.tagName, createAttrsMap(node.attributes));

	if (deep && _isElement(node)) {
		node.children.forEach((child) => {
			appendChild(clone as ElementNode, cloneNode(child, true));
		});
	}

	return clone as N;
}
