# bilibili海外区域搜索
首先安装Tampermonkey等脚本管理工具，然后点击[这里](https://github.com/gamekingv/bilibili-oversea-search/raw/main/bilibili-oversea-search.user.js)安装脚本。

在搜索页面选中番剧标签，设置好代理服务器，代理服务器相关详见[这里](https://github.com/yujincheng08/BiliRoaming/wiki/%E5%85%AC%E5%85%B1%E8%A7%A3%E6%9E%90%E6%9C%8D%E5%8A%A1%E5%99%A8)。

设置好代理服务器后在下拉框选择相应的服务器点击“搜索”按钮即可搜索。

# 港澳台搜索代理
港澳台可通过部署阿里云函数香港节点 HTTP 函数实现，下面为部署代码，代理服务器填写除了 `https://` 外的完整路径。另外部分公共服务器可能不支持港澳台搜索，请自行选择使用。

```javascript
var getRawBody = require('raw-body');
var getFormBody = require('body/form');
var body = require('body');

exports.handler = (req, resp, context) => {
    'use strict';

    const params = {
        path: req.path,
        queries: req.queries,
        headers: req.headers,
        method: req.method,
        requestURI: req.url,
        clientIP: req.clientIP,
    }
    const https = require('https');
    let queries = [];
    for (const key in req.queries) {
        queries.push(`${key}=${encodeURIComponent(req.queries[key])}`);
    }
    const options = {
        hostname: 'api.bilibili.com',
        port: 443,
        path: req.path + '?' + queries.join('&'),
        method: 'GET',
        headers: {
            'Referer': 'https://search.bilibili.com/bangumi',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36 Edg/93.0.961.52'
        }
    };
    const httpsRequest = https.request(options, (res) => {
        console.log('statusCode:', res.statusCode);
        let responseText = '';
        res.on('data', (d) => {
            responseText += d.toString();
        });
        res.on('end', function() {
            resp.send(responseText);
        });
    });

    httpsRequest.on('error', (error) => {
        resp.send(error.toString());
    });
    httpsRequest.end();
}
```
