import { NodeExport, ElementNode } from '../types';
import { createElement } from '../constructors/createElement';
import { appendChild } from '../operators/appendChild';
import { createComment } from '../constructors/createComment';
import { createText } from '../constructors/createText';

export function fromJson(json: NodeExport): ElementNode {
	const node = createElement(json.name ?? '', json.attr);
	if (json.child) {
		json.child.forEach((child) => {
			appendChild(
				node,
				typeof child === 'string'
					? child.startsWith('<!--') && child.endsWith('>')
						? createComment(child)
						: createText(child)
					: fromJson(child),
			);
		});
	}
	return node;
}
