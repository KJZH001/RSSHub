import type { FC } from 'hono/jsx';

import { Layout } from '@/views/layout';
import { config } from '@/config';
import { gitHash, gitDate } from '@/utils/git-hash';
import { getDebugInfo } from '@/utils/debug-info';

const startTime = Date.now();

const Index: FC<{ debugQuery: string | undefined }> = ({ debugQuery }) => {
    const debug = getDebugInfo();

    const showDebug = !config.debugInfo || config.debugInfo === 'false' ? false : config.debugInfo === 'true' || config.debugInfo === debugQuery;
    const { disallowRobot, nodeName, cache } = config;

    const duration = Date.now() - startTime;

    const info = {
        showDebug,
        disallowRobot,
        debug: [
            ...(nodeName
                ? [
                      {
                          name: 'Node Name',
                          value: nodeName,
                      },
                  ]
                : []),
            ...(gitHash
                ? [
                      {
                          name: 'Git Hash',
                          value: (
                              <a className="underline" href={`https://github.com/DIYgod/RSSHub/commit/${gitHash}`}>
                                  {gitHash}
                              </a>
                          ),
                      },
                  ]
                : []),
            ...(gitDate
                ? [
                      {
                          name: 'Git Date',
                          value: gitDate.toUTCString(),
                      },
                  ]
                : []),
            {
                name: 'Cache Duration',
                value: cache.routeExpire + 's',
            },
            {
                name: 'Request Amount',
                value: debug.request,
            },
            {
                name: 'Request Frequency',
                value: ((debug.request / (duration / 1000)) * 60).toFixed(3) + ' times/minute',
            },
            {
                name: 'Cache Hit Ratio',
                value: debug.request ? ((debug.hitCache / debug.request) * 100).toFixed(2) + '%' : 0,
            },
            {
                name: 'ETag Matched Ratio',
                value: debug.request ? ((debug.etag / debug.request) * 100).toFixed(2) + '%' : 0,
            },
            {
                name: 'Health',
                value: debug.request ? ((1 - debug.error / debug.request) * 100).toFixed(2) + '%' : 0,
            },
            {
                name: 'Uptime',
                value: (duration / 3_600_000).toFixed(2) + ' hour(s)',
            },
            {
                name: 'Hot Routes',
                value: Object.keys(debug.routes)
                    .sort((a, b) => debug.routes[b] - debug.routes[a])
                    .slice(0, 30)
                    .map((route) => (
                        <>
                            {debug.routes[route]} {route}
                            <br />
                        </>
                    )),
            },
            {
                name: 'Hot Paths',
                value: Object.keys(debug.paths)
                    .sort((a, b) => debug.paths[b] - debug.paths[a])
                    .slice(0, 30)
                    .map((path) => (
                        <>
                            {debug.paths[path]} {path}
                            <br />
                        </>
                    )),
            },
            {
                name: 'Hot Error Routes',
                value: Object.keys(debug.errorRoutes)
                    .sort((a, b) => debug.errorRoutes[b] - debug.errorRoutes[a])
                    .slice(0, 30)
                    .map((route) => (
                        <>
                            {debug.errorRoutes[route]} {route}
                            <br />
                        </>
                    )),
            },
            {
                name: 'Hot Error Paths',
                value: Object.keys(debug.errorPaths)
                    .sort((a, b) => debug.errorPaths[b] - debug.errorPaths[a])
                    .slice(0, 30)
                    .map((path) => (
                        <>
                            {debug.errorPaths[path]} {path}
                            <br />
                        </>
                    )),
            },
        ],
    };

    return (
        <Layout>
            <div
                className="pointer-events-none absolute w-full h-screen"
                style={{
                    backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHZpZXdCb3g9JzAgMCAzMiAzMicgd2lkdGg9JzMyJyBoZWlnaHQ9JzMyJyBmaWxsPSdub25lJyBzdHJva2U9J3JnYigxNSAyMyA0MiAvIDAuMDQpJz48cGF0aCBkPSdNMCAuNUgzMS41VjMyJy8+PC9zdmc+')`,
                    maskImage: 'linear-gradient(transparent, black, transparent)',
                }}
            ></div>
            <div className="w-full h-screen flex items-center justify-center flex-col space-y-4">
                <img src="/logo.png" alt="RSSHub" width="100" loading="lazy" />
                <h1 className="text-4xl font-bold">
                    欢迎来到<span className="text-[#F5712C]">RSSHub</span>!
                </h1>
                <p className="text-zinc-500">如果你看到这个页面，说明RSSHub已经在正常运行</p>
                <p className="text-zinc-500">本站由 <a href="https://blog.moeworld.tech">晓空</a> 维护，在合理的范围内提供公益使用</p>
                <p className="text-zinc-500">除对主页进行汉化修改和增加维护者署名以外，和上游项目保持一致，但不会始终保持更新</p>
                <p className="text-xl font-medium text-zinc-600">让任何站点可被rss订阅</p>
                <div className="font-bold space-x-4 text-sm">
                    <a target="_blank" href="https://docs.rsshub.app">
                        <button className="text-white bg-[#F5712C] hover:bg-[#DD4A15] py-2 px-4 rounded-full transition-colors">阅读文档</button>
                    </a>
                    <a target="_blank" href="https://github.com/KJZH001/RSSHub">
                        <button className="bg-zinc-200 hover:bg-zinc-300 py-2 px-4 rounded-full transition-colors">在Github查看</button>
                    </a>
                    <a target="_blank" href="https://docs.rsshub.app/sponsor" className="text-[#F5712C]">
                        <button className="text-white bg-red-500 hover:bg-red-600 py-2 px-4 rounded-full transition-colors">❤️ 赞助原作者</button>
                    </a>
                </div>
                {info.showDebug ? (
                    <details className="text-xs w-96 !mt-8 max-h-[400px] overflow-auto">
                        <summary className="text-sm cursor-pointer">调试信息</summary>
                        {info.debug.map((item) => (
                            <div class="debug-item my-3 pl-8">
                                <span class="debug-key w-32 text-right inline-block mr-2">{item.name}: </span>
                                <span class="debug-value inline-block break-all align-top">{item.value}</span>
                            </div>
                        ))}
                    </details>
                ) : null}
            </div>
            <div className="absolute bottom-10 text-center w-full text-sm font-medium space-y-2">
                <p className="space-x-4">
                    <a target="_blank" href="https://github.com/DIYgod/RSSHub">
                        <img className="inline" src="https://icons.ly/github/_/fff" alt="github" width="20" height="20" />
                    </a>
                    <a target="_blank" href="https://t.me/rsshub">
                        <img className="inline" src="https://icons.ly/telegram" alt="telegram group" width="20" height="20" />
                    </a>
                    <a target="_blank" href="https://t.me/awesomeRSSHub">
                        <img className="inline" src="https://icons.ly/telegram" alt="telegram channel" width="20" height="20" />
                    </a>
                    <a target="_blank" href="https://twitter.com/intent/follow?screen_name=_RSSHub" className="text-[#F5712C]">
                        <img className="inline" src="https://icons.ly/twitter" alt="github" width="20" height="20" />
                    </a>
                </p>
                <p className="!mt-6">
                    请支持并{' '}
                    <a target="_blank" href="https://docs.rsshub.app/sponsor" className="text-[#F5712C]">
                        赞助
                    </a>{' '}
                    这有助于推动RSSHub的发展和持续更新
                </p>
                <p>
                    Made with ❤️ by{' '}
                    <a target="_blank" href="https://diygod.cc" className="text-[#F5712C]">
                        DIYgod
                    </a>{' '}
                    and{' '}
                    <a target="_blank" href="https://github.com/DIYgod/RSSHub/graphs/contributors" className="text-[#F5712C]">
                        Contributors
                    </a>{' '}
                    使用 MIT License 许可
                </p>
            </div>
        </Layout>
    );
};

export default Index;
