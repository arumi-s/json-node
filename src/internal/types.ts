export interface ElementNode {
	tagName: string;
	attributes: Attr[];
	parent: ElementNode | null;
	children: AnyNode[];
}

export interface TextNode {
	tagName: '#text';
	parent: ElementNode | null;
	text: string;
}

export interface CommentNode {
	tagName: '#comment';
	parent: ElementNode | null;
	text: string;
}

export type AnyNode = ElementNode | TextNode | CommentNode;

export interface NodeExport {
	name?: string;
	attr?: AttrsMap;
	child?: (NodeExport | string)[];
}

export interface Attr {
	name: string;
	value: string;
}

export interface ParseXmlOptions {
	position?: number;
	noChildNodes?: string[];
	keepComments?: boolean;
	keepDeclarations?: boolean;
}

export type AttrsMap = Record<string, string>;

export type Checker = (node: ElementNode, scope: ElementNode) => boolean;
