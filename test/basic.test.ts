// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

describe('basic', () => {
    const MAP = {
        get: async () => 'test-value',
        list: async () => ({
            keys: [{ name: 'test-key' }],
            list_complete: true,
        }),
    };
    const env = {
        API_KEY: 'TEST_API_KEY',
        MAP,
        MAX_KV_SUBREQUESTS: 1000,
    };

    it('authorised; responds with single key value ', async () => {
        const url = "http://localhost/api/KV/bulkGet?page=1&maxPages=1";
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${env.API_KEY}`,
        };
        const request = new Request(url, {
            method: 'GET',
            headers: headers,
        });
        const context = createExecutionContext();
        const response = await worker.fetch(request, env, context);
        // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
        await waitOnExecutionContext(context);
        expect(await response.text()).toMatchInlineSnapshot(
            '"{"page":1,"nextPage":null,"maxPages":1,"data":{"test-key":"test-value"}}"'
        );
    });
});
