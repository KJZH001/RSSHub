import type { Radar } from '@/types';

export const radar: Radar = [
    {
        source: ['/Index/InfoSQList.aspx', '/Index/InfoPage.aspx'],
        target: (params, url) => {
            const classID = new URL(url).searchParams.get('classID') ?? '11';
            return `/zjzs/info/${classID}`;
        },
    },
];
