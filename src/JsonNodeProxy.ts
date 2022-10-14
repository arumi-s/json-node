import { Attr, Node } from './interfaces/node.interface';
import { appendChild } from './node/operators/appendChild';
import { cloneNode } from './node/operators/cloneNode';
import { copyAttr } from './node/operators/copyAttr';
import { copyChild } from './node/operators/copyChild';
import { copyNode } from './node/operators/copyNode';
import { coverAttr } from './node/operators/coverAttr';
import { descendants } from './node/operators/descendants';
import { find } from './node/operators/find';
import { findChild } from './node/operators/findChild';
import { findChildren } from './node/operators/findChildren';
import { findFirst } from './node/operators/findFirst';
import { findParent } from './node/operators/findParent';
import { findParents } from './node/operators/findParents';
import { getAttribute } from './node/operators/getAttribute';
import { hasAttribute } from './node/operators/hasAttribute';
import { indexOf } from './node/operators/indexOf';
import { insertAfter } from './node/operators/insertAfter';
import { insertBefore } from './node/operators/insertBefore';
import { isNode } from './node/operators/isNode';
import { lastIndexOf } from './node/operators/lastIndexOf';
import { parents } from './node/operators/parents';
import { removeAttr } from './node/operators/removeAttr';
import { removeAttribute } from './node/operators/removeAttribute';
import { removeChild } from './node/operators/removeChild';
import { setAttribute } from './node/operators/setAttribute';
import { textContent } from './node/operators/textContent';
import { descendantsIt } from './node/operators/descendantsIt';
import { firstChild } from './node/operators/firstChild';
import { indexOfType } from './node/operators/indexOfType';
import { lastIndexOfType } from './node/operators/lastIndexOfType';
import { nextSibling } from './node/operators/nextSibling';
import { previousSibling } from './node/operators/previousSibling';
import { siblings } from './node/operators/siblings';
import { childNodes } from './node/operators/childNodes';
import { children } from './node/operators/children';
import { toJson } from './node/converters/toJson';
import { fromTxml } from './node/converters/fromTxml';

type SkipArg<F extends (node: Node, ...args: any[]) => ReturnType<F>> = F extends (node: Node, ...args: infer A) => any ? A : Parameters<F>;

const proxifyOperator = <F extends (node: Node, ...args: any[]) => ReturnType<F>>(fn: F) =>
	function (this: NodeProxy, ...args: SkipArg<F>) {
		return fn(this, ...args) as ReturnType<F> extends Node ? NodeProxy : ReturnType<F> extends Node[] ? NodeProxy[] : ReturnType<F>;
	};

const NodeProxyProto = {
	descendants: proxifyOperator(descendants),
	parents: proxifyOperator(parents),
	find: proxifyOperator(find),
	findFirst: proxifyOperator(findFirst),
	findChild: proxifyOperator(findChild),
	findChildren: proxifyOperator(findChildren),
	findParent: proxifyOperator(findParent),
	findParents: proxifyOperator(findParents),
	indexOf: proxifyOperator(indexOf),
	lastIndexOf: proxifyOperator(lastIndexOf),
	hasAttribute: proxifyOperator(hasAttribute),
	getAttribute: proxifyOperator(getAttribute),
	setAttribute: proxifyOperator(setAttribute),
	removeAttribute: proxifyOperator(removeAttribute),
	cloneNode(this: NodeProxy, ...args: SkipArg<typeof cloneNode>) {
		return proxify(cloneNode(this, ...args));
	},
	removeChild: proxifyOperator(removeChild),
	appendChild: proxifyOperator(appendChild),
	insertAfter: proxifyOperator(insertAfter),
	insertBefore: proxifyOperator(insertBefore),
	copyNode: proxifyOperator(copyNode),
	copyAttr: proxifyOperator(copyAttr),
	copyChild: proxifyOperator(copyChild),
	removeAttr: proxifyOperator(removeAttr),
	coverAttr: proxifyOperator(coverAttr),
	textContent: proxifyOperator(textContent),
	descendantsIt: proxifyOperator(descendantsIt),
	firstChild: proxifyOperator(firstChild),
	indexOfType: proxifyOperator(indexOfType),
	lastIndexOfType: proxifyOperator(lastIndexOfType),
	nextSibling: proxifyOperator(nextSibling),
	previousSibling: proxifyOperator(previousSibling),
	siblings: proxifyOperator(siblings),
	toJson: proxifyOperator(toJson),
	fromTxml: proxifyOperator(fromTxml),
};
type NodeProxyProto = typeof NodeProxyProto;

export const InternalSymbol = Symbol('internal');

export interface NodeProxy extends NodeProxyProto {
	tagName: string;
	attributes: Attr[];
	parent: NodeProxy | null;
	children: (NodeProxy | string)[];
	childNodes: NodeProxy[];
	id: string | undefined;
	name: string | undefined;
	classList: string[];
	[InternalSymbol]: Node;
}

export const proxify = (json: Node): NodeProxy => {
	if (Reflect.has(json, InternalSymbol)) return json as NodeProxy;

	const shorthands: string[] = ['id', 'classList', 'name'];

	const proxifyNodes = (nodes: (Node | string)[]) => {
		return nodes.map((node) => {
			if (isNode(node)) {
				return proxify(node);
			} else {
				return node;
			}
		});
	};

	const proxied = new Proxy(json, {
		has: (target, name) =>
			Reflect.has(target, name) ||
			(typeof name === 'string' && (shorthands.includes(name) || name === 'parent' || name === 'children' || name === 'childNodes')) ||
			name === InternalSymbol,
		get: (target, name) => {
			if (typeof name === 'string' && shorthands.includes(name)) {
				if (name === 'classList')
					return getAttribute(proxied, 'class', '')
						.split(' ')
						.filter((c) => c !== '');
				return getAttribute(proxied, name);
			}
			if (name === 'children') return proxifyNodes(children(target));
			if (name === 'childNodes') return proxifyNodes(childNodes(target));
			if (name === 'parent') return target.parent != null ? proxify(target.parent) : null;
			if (name === InternalSymbol) {
				return target;
			}
			if (Reflect.has(target, name)) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-return
				return Reflect.get(target, name);
			}
			return undefined;
		},
		set: (target, name, value) => {
			if (typeof name === 'string' && shorthands.includes(name)) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				setAttribute(proxied, name, value);
				return true;
			}
			if (name === 'parent') {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				target.parent = value;
				return true;
			}
			if (name === 'children') {
				return false;
			}
			if (name === 'childNodes') {
				return false;
			}
			return Reflect.set(target, name, value);
		},
		deleteProperty: (target, name) => {
			if (typeof name === 'string' && shorthands.includes(name)) {
				removeAttribute(proxied, name);
				return true;
			}
			return Reflect.deleteProperty(target, name);
		},
		ownKeys: (target) => [...Reflect.ownKeys(target), ...shorthands],
	}) as NodeProxy;

	Object.setPrototypeOf(proxied, NodeProxyProto);

	return proxied;
};
