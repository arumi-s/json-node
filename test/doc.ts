import fs from 'fs';
import path from 'path';
import { JsonNode, parseXML } from '../src';

const testXml = fs.readFileSync(path.join(__dirname, 'doc.xml'), { encoding: 'utf8' });

export function parse(text: string): JsonNode.Node {
	return JsonNode.fromTxml(parseXML(text, { keepComments: true, keepDeclarations: true }))!;
}

export function getTestDoc(): JsonNode.Node {
	return JsonNode.fromTxml(parse(testXml))!;
}
