# Cloudflare Worker KV Bulk Get

## Overview

A Cloudflare Worker which can bulk get all the key-value pairs from a KV namespace via a GET API endpoint

## Installation

```bash
# Create a wrangler.toml from wranger.template.toml
pnpm run build
# Deploy the worker
pnpm run deploy
# Create the API_KEY secret and store in your .env file
pnpm run create-api-key
# Source the API_KEY value from the .env
. .env
# Upload to Cloudflare worker
pnpm run upload-api-key
```

## Usage

```bash
curl -H "Authorization: Bearer $API_KEY" "https://${WORKER_NAME}.${ZONE_NAME}.workers.dev/api/kV/bulkGet?page=1&maxPages=1"
```

## Acknowledgements

Reference sources:
- [List keys | Cloudflare Workers KV](https://developers.cloudflare.com/kv/api/list-keys/)
- [Read key-value pairs | Cloudflare Workers KV](https://developers.cloudflare.com/kv/api/read-key-value-pairs/)
- [Limits | Cloudflare Workers docs](https://developers.cloudflare.com/workers/platform/limits/#how-many-subrequests-can-i-make)
- [Wrangler KV commands | Cloudflare Workers KV](https://developers.cloudflare.com/kv/reference/kv-commands/#kv-bulk)

Tutorials:
- [Build an API to access D1 using a proxy Worker | Cloudflare D1 docs](https://developers.cloudflare.com/d1/tutorials/build-an-api-to-access-d1#11-deploy-the-api)
- [Hono | Cloudflare Pages docs](https://developers.cloudflare.com/pages/framework-guides/deploy-a-hono-site/)

## Contributions

Contributions as well as pull requests are welcome so feel free to:
- [Open an issue](https://github.com/artlessconstruct/cloudflare-worker-kv-bulk-get/discussions/new/choose)
- [Start a discussion](https://github.com/artlessconstruct/cloudflare-worker-kv-bulk-get/issues/new)

## License

All works herein are licensed under [MIT](LICENSE).
