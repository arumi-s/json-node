export interface ElementNode {
	tagName: string;
	attributes: Attr[];
	parent: ParentNode | null;
	children: ChildNode[];
}

export interface TextNode {
	tagName: '#text';
	parent: ParentNode | null;
	text: string;
}

export interface CommentNode {
	tagName: '#comment';
	parent: ParentNode | null;
	text: string;
}

export interface DocumentNode {
	tagName: '#document';
	attributes: Attr[];
	parent: null;
	children: ChildNode[];
}

export type ParentNode = DocumentNode | ElementNode;

export type ChildNode = ElementNode | TextNode | CommentNode;

export type AnyNode = DocumentNode | ElementNode | TextNode | CommentNode;

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

export type Checker = (node: ParentNode, scope: ParentNode) => boolean;
