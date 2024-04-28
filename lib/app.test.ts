import { describe, expect, it } from 'vitest';

import app from '@/app';

describe('index', () => {
    it('serve index', async () => {
        const res = await app.request('/');
        expect(res.status).toBe(200);
        expect(await res.text()).toContain('欢迎来到MoeWorld RSSHub - Welcome to RSSHub! ——由 晓空blog 运营的公益RSSHub站点');
    });
});
