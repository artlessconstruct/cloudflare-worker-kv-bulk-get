import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { KVNamespace } from '@cloudflare/workers-types';

type Bindings = {
    API_KEY: string;
    MAX_KV_SUBREQUESTS: number;
    MAP: KVNamespace;
};

type KVPair = {
    [key: string]: string | null;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", prettyJSON(), logger(), async (c, next) => {
    const auth = bearerAuth({ token: c.env.API_KEY });
    return auth(c, next);
});

app.get("/api/KV/bulkGet", async (c) => {
    try {
        const page = parseInt(c.req.query('page') || '1');
        if (isNaN(page) || page <= 0) {
            return c.json({ error: "Invalid page parameter. Must be a positive integer." }, 400);
        }
        const maxPages = parseInt(c.req.query('maxPages') || '1');
        if (isNaN(maxPages) || maxPages <= 0) {
            return c.json({ error: "Invalid maxPages parameter. Must be a positive integer." }, 400);
        }

        const pageSize = c.env.MAX_KV_SUBREQUESTS - maxPages; // Maximum number of KV gets we can perform
        const listOptions = {
            limit: pageSize,
            cursor: '',
        };

        // Skip to the correct page
        let listResult = await c.env.MAP.list(listOptions);
        for (let i = 0; i < page - 1; i++) {
            if (listResult.list_complete) {
                // We've reached the end of the list before getting to page N
                if (i < page - 1) {
                    return c.json({ error: "Page number exceeds available data." }, 400);
                }
                break; // We're on the last page, which is what we want
            }
            listOptions.cursor = listResult.cursor;
            listResult = await c.env.MAP.list(listOptions);
        }

        // Get all key values in parallel and wait for all promised results to
        // settle
        const entries = await Promise.all(
            listResult.keys.map(async (key): Promise<[string, string | null]> => [
                key.name,
                await c.env.MAP.get(key.name)
            ])
        );

        // Sort entries alphabetically by key
        entries.sort((a, b) => a[0].localeCompare(b[0]));

        // Convert sorted entries to object
        const sortedResult: KVPair = Object.fromEntries(entries);

        return c.json({
            page: page,
            nextPage: listResult.list_complete ? null : page + 1,
            maxPages: maxPages,
            data: sortedResult,
        });

    } catch (error) {
        return c.json({ error: `Failed to bulk get KV key-value pairs with error: ${error}` }, 500);
    }
});

export default app;