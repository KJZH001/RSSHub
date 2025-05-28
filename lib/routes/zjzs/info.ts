import type { Route } from '@/types';
import { ofetch } from '@/utils/ofetch'; // RSSHub 内置轻量 fetch
import { load } from 'cheerio'; // HTML 解析
import { parseDate } from '@/utils/parse-date';

export const route: Route = {
    path: '/zjzs/info/:classID?',
    name: '浙江省自考公告',
    example: '/zjzs/info/11',
    maintainers: ['your-github-id'],
    // Radar already defined separately
    handler,
};

async function handler(ctx) {
    const classID = ctx.req.param('classID') ?? '11';
    const pages = +(ctx.req.query('pages') ?? 1); // 抓取页数可选
    const base = 'https://zk.zjzs.net';

    // 并行抓取列表页
    const htmlList = await Promise.all(
        Array.from({ length: pages }, (_, i) =>
            ofetch(`${base}/Index/ajax_InfoSQList.aspx`, {
                query: {
                    pageSize: 10,
                    goPage: i + 1,
                    classID,
                },
            })
        )
    );

    // 解析条目
    const items = htmlList
        .flatMap((html) => {
            const $ = load(html);
            return $('.news-list .item')
                .map((_, el) => {
                    const $el = $(el);
                    const a = $el.find('.title a');
                    const title = a.text().trim();
                    const link = new URL(a.attr('href')!, base).href;
                    const date = $el.find('.des').text().replace('发布时间:', '').trim();
                    return {
                        title,
                        link,
                        pubDate: parseDate(date, 'YYYY-MM-DD'),
                    };
                })
                .get();
        })
        // 过滤空标题或未来日期
        .filter((it) => it.title);

    return {
        title: `浙江自考信息公告（classID=${classID}）`,
        link: `${base}/Index/InfoSQList.aspx?classID=${classID}`,
        item: items,
    };
}
