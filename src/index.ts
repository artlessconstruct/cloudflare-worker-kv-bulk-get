import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { KVNamespace } from '@cloudflare/workers-types';

type Bindings = {
    API_KEY: string;
    MAP: KVNamespace;
    MAX_KV_SUBREQUESTS: number;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", prettyJSON(), logger(), async (c, next) => {
    const auth = bearerAuth({ token: c.env.API_KEY });
    return auth(c, next);
});

app.get("/api/listKV", async (c) => {
    try {
        const page = parseInt(c.req.query('page') || '1');
        if (isNaN(page) || page < 1) {
            return c.json({ error: "Invalid page parameter. Must be a positive integer." }, 400);
        }
        const totalPages = parseInt(c.req.query('totalPages') || '1');
        if (isNaN(totalPages) || totalPages < 1) {
            return c.json({ error: "Invalid totalPages parameter. Must be a positive integer." }, 400);
        }

        const pageSize = c.env.MAX_KV_SUBREQUESTS - totalPages; // Maximum number of KV gets we can perform
        const listOptions = {
            limit: pageSize,
            cursor: '',
        };

        // Skip to the correct page
        for (let i = 0; i < page; i++) {
            const listResult = await c.env.MAP.list(listOptions);
            if (listResult.list_complete) {
                return c.json({ error: "Page number exceeds available data." }, 400);
            }
            listOptions.cursor = listResult.cursor;
        }

        // Get the keys for the requested page
        const listResult = await c.env.MAP.list(listOptions);
        const result = {};

        // Fetch values for each key
        const promises = listResult.keys.map(async (key) => {
            const value = await c.env.MAP.get(key.name);
            result[key.name] = value;
        });

        await Promise.all(promises);

        return c.json({
            page: page,
            data: result,
            next_page: listResult.list_complete ? null : page + 1
        });

    } catch (error) {
        return c.json({ error: error.message }, 500);
    }
});

export default app;