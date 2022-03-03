# magic-mint-shell engine

Smart contracts for Magic Mint.

## Development

Install dependencies:

```
yarn
```

Compile all artifacts and generate typechain types:

```
yarn build
```

Run unit tests:

```
yarn test
```

Run unit tests showing gas usage by function and deploy costs:

```
REPORT_GAS=1 yarn test
```

Run unit tests and report coverage:

```
yarn test:coverage
```

## Deployment

Copy `.env.example` to `.env` and override the default values before deploying.

Deploy a contract (eg, `MagicMintEngine`):

```
yarn deploy --network rinkeby --contract MagicMintEngine
```

> NOTE: The contract will automatically be verified on etherscan

### Verification

The `deploy` task will automatically verify contracts generally.

This can occasionally fail. If it does, verify manually:

```
yarn verify --network rinkeby $CONTRACT_ADDRESS
```

Verification may fail if run too quickly after contract deployment.
