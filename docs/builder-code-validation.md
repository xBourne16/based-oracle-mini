# Builder Code validation

## Scope

PR #2, branch `chore/base-builder-code-attribution`, reviewed from commit
`20a231a7c8b8014748d3ec0a88a0fd059d993476` on 2026-11-18.
The existing suffix was correctly encoded. The duplicate in `app/page.tsx`
is replaced with an import from `app/builderCode.ts`.
No design, wallet connector, storage, manifest, contract address, payment
amount, payment implementation, or deployment configuration is changed.

## Encoding and transaction paths

Code supplied by the owner: `bc_jpgprce5` (11 ASCII bytes).
Schema 0: code bytes + `0b` length + `00` schema + 16-byte ERC marker.

```
0x62635f6a706770726365350b0080218021802180218021802180218021
```

This matches `Attribution.toDataSuffix({ codes: ['bc_jpgprce5'] })` from
the installed Viem dependency's Ox 0.14.22 exactly. Dashboard ownership
has NOT been verified: the available browser showed a sign-in screen.

Oracle Consult (`consult()`), Daily GM (`gm()`), and Agent Forge
(`register(string)`) append the shared suffix after ABI encoding and
explicitly submit on chain 8453. Existing chain switching is preserved.
Offline tests check the suffix independently and capture the outgoing
Viem wallet request with a mock transport; arguments, destination, and
absence of ETH value are preserved. These are not wallet or chain execution tests.

## Reproduction

```
npm install
npm run build
npx --no-install tsc --noEmit --incremental false
node --test tests/builder-code.test.mjs
```

Environment: Windows, Node 24.15.0; installed Viem 2.50.4, Next 15.5.7.
Installation succeeded without changing package.json or package-lock.json.
The four offline attribution tests pass. Build and standalone TypeScript
checks pass. Build emits an Ox/Tempo dynamic-dependency warning and an
outdated Browserslist dataset warning.

`npm audit` reports 75 dependency findings: 19 moderate, 55 high, 1 critical.
Next 15.5.7 is flagged critical. Assess and patch dependencies in a focused
security change before production release; broad automatic fixes can change
wallet, styling, or payment dependencies. No automatic audit fix was applied.

## USDC review and recommendation

Despite its name, `useX402Payment` performs a direct ERC-20 transfer rather
than a facilitator-based x402 settlement. It transfers 0.001 USDC (1000 base
units) on the Base USDC contract
`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913` to
`0x602628CaDb00F0c466aF885b854c37984b5A8356`.
The server verifies a successful receipt and the token's Transfer log,
recipient, and minimum amount, not the calldata length.

The installed Viem supports per-call `dataSuffix` on `writeContract`.
A separate payment change can import the same suffix and pass
`dataSuffix: BUILDER_CODE_DATA_SUFFIX` on that call, preserving the ABI,
recipient and amount. Do not also concatenate it manually. First compare
original and suffixed `eth_call` results on Base at the same block and sender,
then validate with an injected wallet and Base Account. A smart account may
wrap calldata; successful inner-call encoding alone does not prove attribution
at the UserOperation level. Payment code remains unchanged here.

Existing limitations to address separately:
- The payment hook does not explicitly enforce chain 8453, although the
  configured provider lists only Base, and uses a non-null assertion for its
  public client.
- The payment endpoint has no payer authentication binding or hash replay
  protection: a qualifying public transaction hash can be reused.
- Consult and GM update success state after receipt retrieval without checking
  `receipt.status`; Agent Forge similarly can display success for a reverted
  receipt. No failing onchain transaction was executed to test these paths.

## Safe Base Mainnet test plan

1. Sign in to Base Dashboard, select the Based Oracle project, and compare
   Settings > Project Settings > Builder Code and Encoded String with the
   values above. Do not merge on an unverified code.
2. On the PR preview or a local build, verify injected-wallet and Base Account
   connection, reconnect, rejection, wrong-network handling, Mini App launch,
   sharing, and existing history/cooldowns. Use a test profile; never clear
   existing user storage. Do not sign a transaction in this phase.
3. Use read-only Base RPC calls (chain ID must be 8453) to verify deployed
   contract code and simulate both original and attributed calldata with
   identical sender/block/value. Consult target:
   `0x10d57710D44e56A76D8CC3Be57879A0131879e3b`; GM target:
   `0xC92919f5C886083b6473672b1e1Cef6f97860Ec7`; registry:
   `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432`.
   Respect cooldowns and distinguish state-related reverts from suffix errors.
4. Obtain explicit owner approval of each paid test and a maximum gas budget.
   Show chain, destination, operation and expected value before signing.
   Consult/GM/register requests attach no ETH value, but gas still costs ETH;
   Agent Forge also creates a persistent onchain registration. Any USDC test
   additionally spends the existing 0.001 USDC. No retries without review.
5. After the owner signs, record the transaction hash and successful receipt.
   For an EOA, decode transaction input; for ERC-4337 inspect UserOperation
   calldata and its success event, not just the outer bundler receipt.
   Confirm decoded codes include `bc_jpgprce5`; a wallet may add another code.
   Check with the official-linked Builder Code Validation tool and confirm
   Dashboard attribution after indexing. Retain evidence for each wallet/path.
6. Compare UI results, history/cooldowns, Agent Forge registration and (if
   separately authorized) the exact USDC Transfer event. On unexpected
   recipient, amount, network, revert or missing attribution, stop and retain
   hashes; do not redeploy contracts or repeat payments.

No Mainnet transaction, contract deployment, production deployment, or merge
was performed. Dashboard and real-wallet validation remain release gates.

## Sources

- https://docs.base.org/specifications/builder-codes/for-app-developers
- https://docs.base.org/specifications/builder-codes/overview
- https://builder-code-checker.vercel.app/
