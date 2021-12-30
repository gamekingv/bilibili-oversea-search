// ==UserScript==
// @name         bilibili海外区域搜索
// @homepage     https://github.com/gamekingv/bilibili-oversea-search
// @version      0.1.10
// @author       gameking
// @include      https://search.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// ==/UserScript==

(function () {
    'use strict';
    function searchTH(page) {
        if (!page) page = 1;
        window.oversea_search_mode = 'TH';
        switchToSearch();
        const list = document.querySelector('#bangumi-list.inject-node'),
            keyword = document.querySelector('#search-keyword').value,
            query = {
                appkey: '7d089525d3611b1c',
                build: '1001310',
                c_locale: 'zh_SG',
                keyword,
                lang: 'hans',
                mobi_app: 'bstar_a',
                platform: 'android',
                pn: page,
                ps: '20',
                s_locale: 'zh_SG',
                type: '7',
                area: 'th'
            };
        list.querySelector('ul').innerHTML = '';
        list.querySelector('.total-wrap .total-text').innerHTML = '共0条数据';
        list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-loading inject-node"><div class="load-state"><span class="loading">正在加载...</span></div></div>';
        list.querySelector('.page-wrap').innerHTML = '';
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://${GM_getValue('th_search_proxy_server')}/intl/gateway/v2/app/search/type?${Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')}`,
            responseType: 'json',
            onload: e => {
                if (!e.response || !e.response.data) {
                    list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">代理服务器无法连接或存在限制</p></div></div>';
                    return;
                }
                const result = e.response.data,
                    countNode = list.querySelector('.total-wrap .total-text');
                if (!result.items) {
                    list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">没有相关数据</p></div></div>';
                    return;
                }
                else list.querySelector('.flow-loader-state').innerHTML = '';
                countNode.innerHTML = `共${result.items.length}条数据`;
                for (let item of result.items) {
                    const resultNode = document.createElement('li'),
                        title = item.title.replace(/<\/?em[^>]*>/g, '');
                    resultNode.className = 'bangumi-item inject-node';
                    resultNode.innerHTML = `<div class="bangumi-item-wrap">\
<a href="//www.bilibili.com/bangumi/play/ss${item.season_id}" title="${title}" target="_blank" class="left-img"><div class="lazy-img"><img alt="" src="${item.cover.replace(/https?:/, '')}"></div></a>\
<div class="right-info">\
<div class="headline"><span class="bangumi-label">番剧</span><a href="//www.bilibili.com/bangumi/play/ss${item.season_id}" title="${title}" target="_blank" class="title">${item.title}</a></div>\
<div id="pgc-navigate-wrap" class="grid"><ul class="ep-box clearfix grid"><li class="ep-sub"><a><div title="追番" class="ep-item">追番</div></a></li></ul></div>\
<div class="score"><div class="score-num"></div>\
</div>\
</div></div>`;
                    list.querySelector('ul').appendChild(resultNode);
                    resultNode.querySelector('#pgc-navigate-wrap .ep-item').addEventListener('click', () => follow(item.season_id, resultNode.querySelector('.score > .score-num')));
                }
                pager(page, result.total);
            },
            onerror: () => {
                list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">代理服务器无法连接或存在限制</p></div></div>';
            }
        });
    }
    function searchTHM(page) {
        if (!page) page = 1;
        window.oversea_search_mode = 'THM';
        switchToSearch();
        const list = document.querySelector('#bangumi-list.inject-node'),
            area = list.querySelector('#proxy-area').value,
            keyword = document.querySelector('#search-keyword').value,
            query = {
                search_type: 'media_bangumi',
                page,
                keyword,
                __refresh__: true,
                highlight: '1',
                single_column: 0,
                area
            };
        list.querySelector('ul').innerHTML = '';
        list.querySelector('.total-wrap .total-text').innerHTML = '共0条数据';
        list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-loading inject-node"><div class="load-state"><span class="loading">正在加载...</span></div></div>';
        list.querySelector('.page-wrap').innerHTML = '';
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://${GM_getValue(area + '_search_proxy_server') || 'api.bilibili.com'}/x/web-interface/search/type?${Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')}`,
            onload: e => {
                const response = e.response ? JSON.parse(e.response) : {};
                if (!e.response || !response.data) {
                    list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">代理服务器无法连接或存在限制</p></div></div>';
                    return;
                }
                const result = response.data,
                    countNode = list.querySelector('.total-wrap .total-text');
                if (result.numResults === 0) {
                    list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">没有相关数据</p></div></div>';
                    return;
                }
                else list.querySelector('.flow-loader-state').innerHTML = '';
                countNode.innerHTML = `共${result.numResults}条数据`;
                for (let item of result.result) {
                    const ep = item.eps ? item.eps.map(ep => `<li class="ep-sub"><a href="//www.bilibili.com/bangumi/play/ep${ep.id}" target="_blank"><div title="${ep.index_title} ${ep.long_title}" class="ep-item">${Number(ep.title) ? ep.title : `<div class="name">${ep.title}</div>`}</div></a></li>`) : [];
                    const score = item.media_score ? `<div class="score-num">${item.media_score.score}<span class="fen">分</span></div><div class="user-count">${item.media_score.user_count}人点评</div>` : '';
                    const resultNode = document.createElement('li');
                    const title = item.title.replace(/<\/?em[^>]*>/g, '');
                    resultNode.className = 'bangumi-item inject-node';
                    resultNode.innerHTML = `<div class="bangumi-item-wrap">\
<a href="//www.bilibili.com/bangumi/play/ss${item.season_id}" title="${title}" target="_blank" class="left-img"><div class="lazy-img"><img alt="" src="${item.cover.replace(/https?:/, '')}"></div></a>\
<div class="right-info">\
<div class="headline"><span class="bangumi-label">番剧</span><a href="//www.bilibili.com/bangumi/play/ss${item.season_id}" title="${title}" target="_blank" class="title">${item.title}</a></div>\
<div class="intros">\
<div class="line clearfix">\
<div class="left-block"><span class="label">风格：</span><span class="value">${item.styles}</span></div>\
<div class="right-block"><span class="label">地区：</span><span class="value">${item.areas}</span></div>\
</div>\
<div class="line clearfix">\
<div class="left-block"><span class="label">开播时间：</span><span class="value">${new Date(item.pubtime*1000).toLocaleString()}</span></div>\
<div class="right-block"><span class="label">声优：</span><span title="${item.cv}" class="value">${item.cv}</span></div>\
</div>\
<div class="desc">${item.desc}</div>\
</div>\
<div id="pgc-navigate-wrap" class="${item.selection_style}"><ul class="ep-box clearfix ${item.selection_style}">${ep.join('')}</ul></div>\
<div class="score">${score}</div>\
</div></div>`;
                    list.querySelector('ul').appendChild(resultNode);
                }
                pager(page, result.numResults);
            },
            onerror: () => {
                list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">代理服务器无法连接或存在限制</p></div></div>';
            }
        });
    }
    function pager(page, total) {
        if (total <= 20) return;
        const totalPage = Math.ceil(total / 20);
        let pagesNodes = '';
        if (page !== 1) pagesNodes += '<li class="page-item prev"><button class="nav-btn iconfont icon-arrowdown2">上一页</button></li>';
        if (page - 1 <= 4) {
            for (let i = 1; i < page; i++) {
                pagesNodes += `<li class="page-item"><button class="pagination-btn num-btn">${i}</button></li>`;
            }
        }
        else {
            pagesNodes += '<li class="page-item first"><button class="pagination-btn num-btn">1</button></li><strong>...</strong>';
            for (let i = page - 3; i < page; i++) {
                pagesNodes += `<li class="page-item"><button class="pagination-btn num-btn">${i}</button></li>`;
            }
        }
        pagesNodes += `<li class="page-item active"><button class="pagination-btn num-btn">${page}</button></li>`;
        if (totalPage - page <= 4) {
            for (let i = page + 1; i <= totalPage; i++) {
                pagesNodes += `<li class="page-item"><button class="pagination-btn num-btn">${i}</button></li>`;
            }
        }
        else {
            for (let i = page + 1; i <= page + 3; i++) {
                pagesNodes += `<li class="page-item"><button class="pagination-btn num-btn">${i}</button></li>`;
            }
            pagesNodes += `<strong>...</strong><li class="page-item last"><button class="pagination-btn num-btn">${totalPage}</button></li>`;
        }
        if (page !== totalPage) pagesNodes += '<li class="page-item next"><button class="nav-btn iconfont icon-arrowdown3">下一页</button></li>';

        const newNode = document.createElement('div');
        document.querySelector('#bangumi-list.inject-node > .page-wrap').appendChild(newNode);
        newNode.outerHTML = `<div class="pager"><ul class="pages">${pagesNodes}</ul></div>`;
        document.querySelectorAll('#bangumi-list.inject-node .page-item:not(.active):not(.next):not(.prev)').forEach(node => node.addEventListener('click', () => {
            if (window.oversea_search_mode === 'TH') searchTH(parseInt(node.innerHTML.replace(/<[^>]*>/g, '')));
            else if (window.oversea_search_mode === 'THM') searchTHM(parseInt(node.innerHTML.replace(/<[^>]*>/g, '')));
            document.querySelector('.rocket-con').click();
        }));
        document.querySelectorAll('#bangumi-list.inject-node .page-item.prev').forEach(node => node.addEventListener('click', () => {
            if (window.oversea_search_mode === 'TH') searchTH(page - 1);
            else if (window.oversea_search_mode === 'THM') searchTHM(page - 1);
            document.querySelector('.rocket-con').click();
        }));
        document.querySelectorAll('#bangumi-list.inject-node .page-item.next').forEach(node => node.addEventListener('click', () => {
            if (window.oversea_search_mode === 'TH') searchTH(page + 1);
            else if (window.oversea_search_mode === 'THM') searchTHM(page + 1);
            document.querySelector('.rocket-con').click();
        }));
    }
    function switchToNormal() {
        window.oversea_search_mode = '';
        const list = document.querySelector('#bangumi-list:not(.inject-node)'),
            injectList = document.querySelector('#bangumi-list.inject-node');
        list.style.display = '';
        if (injectList) injectList.style.display = 'none';
    }
    function switchToSearch() {
        const list = document.querySelector('#bangumi-list:not(.inject-node)'),
            injectList = document.querySelector('#bangumi-list.inject-node');
        list.style.display = 'none';
        if (injectList) injectList.style.display = '';
        else {
            const injectNewList = document.createElement('div');
            list.parentNode.appendChild(injectNewList);
            injectNewList.outerHTML = '<div class="flow-loader inject-node" id="bangumi-list" style="position: relative;"><div><div class="total-wrap"><p class="total-text">共0条数据</p></div></div><ul></ul><div class="page-wrap"></div><div class="flow-loader-state" style="text-align: center;"></div><div class="flow-loader-detect"style="position: absolute; bottom: 0px; right: 0px; width: 100%; height: 50px; z-index: -1; background: transparent;"></div></div>';
            injectButton(true);
        }
    }
    function follow(season_id, infoNode) {
        infoNode.innerHTML = '处理中';
        if (document.cookie.match(/bili_jct=([^;]*);/)) {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.bilibili.com/pgc/web/follow/add',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Referer': 'https://www.bilibili.com'
                },
                responseType: 'json',
                data: `season_id=${season_id}&csrf=${document.cookie.match(/bili_jct=([^;]*);/)[1]}`,
                onload: e => {
                    if (!e.response) infoNode.innerHTML = '操作失败';
                    else if (e.response.code === 0) infoNode.innerHTML = '追番成功';
                    else infoNode.innerHTML = '操作失败';
                    setTimeout(() => (infoNode.innerHTML = ''), 2000);
                }
            });
        }
        else infoNode.innerHTML = '未登陆';
    }
    function injectButton(injected) {
        const injectNode = document.querySelector(injected ? '#bangumi-list.inject-node .total-wrap' : '#bangumi-list .total-wrap'),
            notInjectNode = document.querySelector(!injected ? '#bangumi-list.inject-node .total-wrap' : '#bangumi-list .total-wrap'),
            th_proxyNode = document.createElement('span'),
            th_proxy = GM_getValue('th_search_proxy_server'),
            hk_proxyNode = document.createElement('span'),
            hk_proxy = GM_getValue('hk_search_proxy_server'),
            tw_proxyNode = document.createElement('span'),
            tw_proxy = GM_getValue('tw_search_proxy_server'),
            cn_proxyNode = document.createElement('span'),
            cn_proxy = GM_getValue('cn_search_proxy_server'),
            proxy_area = document.createElement('span'),
            buttonNode = document.createElement('span'),
            areaNode = document.querySelector('#proxy-area');
        th_proxyNode.innerHTML = `海外服务器：<input id="th-proxy-server" style="width: 100px" type="text" maxlength="100" autocomplete="off" value="${th_proxy ? th_proxy : ''}">`;
        th_proxyNode.style = 'margin-left: 20px;';
        hk_proxyNode.innerHTML = `港澳服务器：<input id="hk-proxy-server" style="width: 100px" type="text" maxlength="100" autocomplete="off" value="${hk_proxy ? hk_proxy : ''}">`;
        hk_proxyNode.style = 'margin-left: 20px;';
        tw_proxyNode.innerHTML = `台湾服务器：<input id="tw-proxy-server" style="width: 100px" type="text" maxlength="100" autocomplete="off" value="${tw_proxy ? tw_proxy : ''}">`;
        tw_proxyNode.style = 'margin-left: 20px;';
        cn_proxyNode.innerHTML = `大陆服务器：<input id="cn-proxy-server" style="width: 100px" type="text" maxlength="100" autocomplete="off" value="${cn_proxy ? cn_proxy : ''}">`;
        cn_proxyNode.style = 'margin-left: 20px;';
        proxy_area.innerHTML = '<select id="proxy-area"><option value="cn">大陆</option><option value="hk">港澳</option><option value="tw">台湾</option><option value="th">海外</option></select>';
        proxy_area.style = 'margin-left: 20px;';
        buttonNode.innerHTML = '搜索';
        buttonNode.style = 'cursor: pointer; color: #00A1D6; margin-left: 20px;';
        buttonNode.addEventListener('click', () => {
            const area = injectNode.querySelector('#proxy-area').value;
            if (area === 'th') searchTH();
            else searchTHM();
        });
        injectNode.appendChild(th_proxyNode);
        injectNode.appendChild(hk_proxyNode);
        injectNode.appendChild(tw_proxyNode);
        injectNode.appendChild(cn_proxyNode);
        injectNode.appendChild(proxy_area);
        injectNode.appendChild(buttonNode);
        if (areaNode) {
            const newAreaNode = proxy_area.querySelector('#proxy-area');
            newAreaNode.value = areaNode.value;
            newAreaNode.addEventListener('input', e => {
                areaNode.value = newAreaNode.value;
            });
            areaNode.addEventListener('input', e => {
                newAreaNode.value = areaNode.value;
            });
        }
        injectNode.querySelector('#th-proxy-server').addEventListener('change', e => {
            if (notInjectNode) notInjectNode.querySelector('#th-proxy-server').value = e.target.value;
            GM_setValue('th_search_proxy_server', e.target.value);
        });
        injectNode.querySelector('#hk-proxy-server').addEventListener('change', e => {
            if (notInjectNode) notInjectNode.querySelector('#hk-proxy-server').value = e.target.value;
            GM_setValue('hk_search_proxy_server', e.target.value);
        });
        injectNode.querySelector('#tw-proxy-server').addEventListener('change', e => {
            if (notInjectNode) notInjectNode.querySelector('#tw-proxy-server').value = e.target.value;
            GM_setValue('tw_search_proxy_server', e.target.value);
        });
        injectNode.querySelector('#cn-proxy-server').addEventListener('change', e => {
            if (notInjectNode) notInjectNode.querySelector('#cn-proxy-server').value = e.target.value;
            GM_setValue('cn_search_proxy_server', e.target.value);
        });
    }
    function injectObserver() {
        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.target.className.includes('is-active')) injectButton();
                const injectNode = document.querySelector('#bangumi-list.inject-node');
                if (injectNode) injectNode.style.display = 'none';
            }
        }), config = { attributes: true, childList: true };
        let observeNode;
        document.querySelectorAll('#navigator .v-switcher-header-tabs > ul > li').forEach(node => node.innerHTML.includes('番剧') && (observeNode = node));
        observer.observe(observeNode, config);
        if (observeNode.className.includes('is-active')) injectButton();
    }
    const searchAppObserver = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].className === 'contain') {
                injectObserver();
                document.querySelector('.suggest-wrap').addEventListener('click', () => switchToNormal());
                document.querySelector('.search-button').addEventListener('click', () => switchToNormal());
                document.querySelector('#search-keyword').addEventListener('keyup', e => e.keyCode === 13 && switchToNormal());
            }
        }
    });
    searchAppObserver.observe(document.querySelector('#server-search-app'), { childList: true });
    if (document.querySelector('#server-search-app > .contain')) {
        injectObserver();
        document.querySelector('.suggest-wrap').addEventListener('click', () => switchToNormal());
        document.querySelector('.search-button').addEventListener('click', () => switchToNormal());
        document.querySelector('#search-keyword').addEventListener('keyup', e => e.keyCode === 13 && switchToNormal());
    }
})();
