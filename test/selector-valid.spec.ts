import { getTestDoc } from './doc';
import { JsonNode, Selector } from '../src';
import { SelectorTest, validSelectors, TEST_QSA, TEST_FIND, scopedSelectors } from './selectors';

function runValidSelectorTest(name: string, root: JsonNode.Node, selectors: SelectorTest[], testType: number, docType = 'xhtml') {
	describe(`${name} valid selectors`, () => {
		const nodeType = 'document';

		for (let i = 0; i < selectors.length; i++) {
			const s = selectors[i];
			const n = s['name'];
			const q = s['selector'];
			const e = s['expect'];
			const ctx = s['ctx'];
			const exclude = s['exclude'] ?? [];

			if (!exclude.includes(nodeType) && !exclude.includes(docType) && !exclude.includes('nonamespace') && (s.testType ?? 0) & testType) {
				it('tokenize ' + n + ': ' + JSON.stringify(q), () => {
					const tokens = Selector.tokenize(q);
					expect(tokens).not.toBeUndefined();

					let result = '';
					for (let k = 0, end = 0; k < tokens.length; k++) {
						const token = tokens[k];
						expect(typeof token.text).toStrictEqual('string');
						expect(token.start).toBeLessThanOrEqual(token.end);
						expect(token.start).toStrictEqual(end);
						end = token.end;
						result += token.text;
					}

					expect(result).toStrictEqual(q);
				});

				const refNode = (ctx ? JsonNode.findFirst(root, ctx) : root)!;

				it('has context', () => {
					expect(refNode).not.toBeUndefined();
				});

				let foundall: JsonNode.Node[] = [];

				it('find ' + n + ': ' + JSON.stringify(q), () => {
					foundall = JsonNode.find(refNode, q);
					expect(foundall).not.toBeUndefined();
					expect(foundall).toHaveLength(e.length);

					for (let k = 0; k < e.length; k++) {
						expect(foundall[k]).not.toBeUndefined();
						expect(JsonNode.getAttribute(foundall[k], 'id')).toStrictEqual(e[k]);
						expect(JsonNode.hasAttribute(foundall[k], 'data-clone')).toBeFalsy();
					}
				});

				if (foundall && foundall.length > 0) {
					test('findFirst ' + n + ': ' + JSON.stringify(q), () => {
						const found = JsonNode.findFirst(refNode, q)!;
						if (e.length > 0) {
							expect(found).not.toBeUndefined();
							expect(found).toStrictEqual(foundall[0]);
							expect(JsonNode.getAttribute(found, 'id')).toStrictEqual(e[0]);
							expect(JsonNode.hasAttribute(found, 'data-clone')).toBeFalsy();
						} else {
							expect(found).toBeUndefined();
						}
					});
				}
			}
		}
	});
}

runValidSelectorTest('Document', getTestDoc(), validSelectors, TEST_QSA | TEST_FIND);
runValidSelectorTest('In-document', getTestDoc(), scopedSelectors, TEST_QSA | TEST_FIND);
