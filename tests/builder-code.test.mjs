import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import ts from 'typescript';
import { createWalletClient, custom, decodeFunctionData, encodeFunctionData, parseAbi } from 'viem';
import { base } from 'viem/chains';

const source = readFileSync(new URL('../app/builderCode.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } });
const { BUILDER_CODE_DATA_SUFFIX: suffix } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`);

// Parse backwards independently of the encoder, as specified by ERC-8021 schema 0.
function decodeSuffix(data) {
  const bytes = Buffer.from(data.slice(2), 'hex');
  assert.equal(bytes.subarray(-16).toString('hex'), '80218021802180218021802180218021');
  assert.equal(bytes.at(-17), 0);
  const length = bytes.at(-18);
  assert.ok(length <= bytes.length - 18, 'code length exceeds available bytes');
  return bytes.subarray(bytes.length - 18 - length, bytes.length - 18).toString('ascii');
}

test('schema 0 encodes exactly the eleven-byte Dashboard code', () => {
  assert.equal(Buffer.from(suffix.slice(2), 'hex').length, 29);
  assert.equal(decodeSuffix(suffix), 'bc_jpgprce5');
  assert.throws(() => decodeSuffix(suffix.replace('350b00', '350c00')));
});

for (const [name, signature, args] of [
  ['Oracle Consult', 'function consult()', []],
  ['Daily GM', 'function gm()', []],
  ['Agent Forge', 'function register(string agentURI) returns (uint256)', ['data:application/json,%7B%22name%22%3A%22Test%22%7D']],
]) {
  test(`${name}: wallet receives intact ABI calldata and attribution on Base`, async () => {
    const abi = parseAbi([signature]);
    const functionName = abi[0].name;
    const original = encodeFunctionData({ abi, functionName, args });
    let sent;
    const client = createWalletClient({
      account: '0x0000000000000000000000000000000000000001',
      chain: base,
      transport: custom({ request: async ({ method, params }) => {
        if (method === 'eth_chainId') return '0x2105';
        if (method === 'eth_sendTransaction') {
          sent = params[0];
          return `0x${'11'.repeat(32)}`;
        }
        throw new Error(`Unexpected RPC method: ${method}`);
      } }),
    });
    await client.sendTransaction({
      to: '0x0000000000000000000000000000000000000002',
      data: `${original}${suffix.slice(2)}`,
    });
    assert.equal(sent.data.slice(0, original.length), original);
    assert.equal(decodeSuffix(sent.data), 'bc_jpgprce5');
    const decoded = decodeFunctionData({ abi, data: sent.data });
    assert.equal(decoded.functionName, functionName);
    assert.deepEqual(decoded.args ?? [], args);
    assert.equal(sent.to, '0x0000000000000000000000000000000000000002');
    assert.equal(sent.value, undefined);
  });
}
