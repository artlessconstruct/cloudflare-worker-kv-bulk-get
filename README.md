# Cloudflare Worker KV Bulk Get

## Overview

A Cloudflare Worker which can bulk get all the key-value pairs from a KV namespace via a GET API endpoint

### Features

### Limitations

## Instructions

### Install

### Usage

```
curl -H "Authorization: Bearer $API_KEY" "https://DEPLOYED_APP_LINK/api/kV/bulkGet?page=1&maxPages=1"
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

Contributions are welcome and are not limited to pull requests. Feel free to
[open an issue][contribute#issue] or [start a discussion][contribute#discuss].

[contribute#discuss]: https://github.com/artlessconstruct/cloudflare-worker-kv-bulk-get/discussions/new
[contribute#issue]: https://github.com/artlessconstruct/cloudflare-worker-kv-bulk-get/issues/new

## License

All works herein are licensed under [MIT](LICENSE).
