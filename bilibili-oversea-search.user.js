// ==UserScript==
// @name         bilibili海外区域搜索
// @homepage     https://github.com/gamekingv/bilibili-oversea-search
// @version      0.1
// @author       gameking
// @include      https://search.bilibili.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function () {
    'use strict';
    let proxy = GM_getValue('th_search_proxy_server');
    function searchTH(page) {
        if (!page) page = 1;
        switchToTH();
        const list = document.querySelector('#bangumi-list.inject-node'),
            keyword = document.querySelector('#search-keyword').value;
        list.querySelector('ul').innerHTML = '';
        list.querySelector('.total-wrap .total-text').innerHTML = '共0条数据';
        list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-loading inject-node"><div class="load-state"><span class="loading">正在加载...</span></div></div>';
        list.querySelector('.page-wrap').innerHTML = '';
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://${proxy}/intl/gateway/v2/app/search/type?appkey=7d089525d3611b1c&build=1001310&c_locale=zh_SG&channel=master&device=android&fnval=16&fnver=0&fourk=0&highlight=1&keyword=${keyword}&lang=hans&locale=zh_CN&mobi_app=bstar_a&platform=android&pn=${page}&ps=20&qn=0&s_locale=zh_SG&sim_code=46000&statistics=%7B%22appId%22%3A1%2C%22platform%22%3A3%2C%22version%22%3A%222.10.1%22%2C%22abtest%22%3A%22%22%7D&type=7`,
            responseType: 'json',
            onload: e => {
                if (!e.response || !e.response.data) {
                    list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">代理服务器无法连接或存在限制</p></div></div>';
                    return;
                }
                const result = e.response.data,
                    countNode = list.querySelector('.total-wrap .total-text');
                if (result.total === 0) {
                    list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">没有相关数据</p></div></div>';
                    return;
                }
                else list.querySelector('.flow-loader-state').innerHTML = '';
                countNode.innerHTML = `共${result.total}条数据`;
                for (let item of result.items) {
                    const resultNode = document.createElement('li'),
                        title = item.title.replace(/<\/?em[^>]*>/g, '');
                    resultNode.className = 'bangumi-item inject-node';
                    resultNode.innerHTML = `<div class="bangumi-item-wrap">\
<a href="//bangumi.bilibili.com/anime/${item.season_id}" title="${title}" target="_blank" class="left-img"><div class="lazy-img"><img alt="" src="${item.cover.replace(/https?:/, '')}"></div></a>\
<div class="right-info">\
<div class="headline"><span class="bangumi-label">番剧</span><a href="//bangumi.bilibili.com/anime/${item.season_id}" title="${title}" target="_blank" class="title">${item.title}</a></div>\
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
            searchTH(parseInt(node.innerHTML.replace(/<[^>]*>/g, '')));
            document.querySelector('.rocket-con').click();
        }));
        document.querySelectorAll('#bangumi-list.inject-node .page-item.prev').forEach(node => node.addEventListener('click', () => {
            searchTH(page - 1);
            document.querySelector('.rocket-con').click();
        }));
        document.querySelectorAll('#bangumi-list.inject-node .page-item.next').forEach(node => node.addEventListener('click', () => {
            searchTH(page + 1);
            document.querySelector('.rocket-con').click();
        }));
    }
    function switchToNormal() {
        document.querySelector('#bangumi-list:not(.inject-node)').style.display = '';
        document.querySelector('#bangumi-list.inject-node').style.display = 'none';
    }
    function switchToTH() {
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
                    console.log(e.response);
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
            buttonNode = document.createElement('span'),
            proxyNode = document.createElement('span');
        buttonNode.innerHTML = '搜海外';
        buttonNode.style = 'cursor: pointer; color: #00A1D6; margin-left: 20px;';
        buttonNode.addEventListener('click', () => searchTH());
        proxyNode.innerHTML = `代理服务器：<input id="proxy-server" type="text" maxlength="100" autocomplete="off" value="${proxy ? proxy : ''}">`;
        proxyNode.style = 'margin-left: 20px;';
        injectNode.appendChild(buttonNode);
        injectNode.appendChild(proxyNode);
        injectNode.querySelector('#proxy-server').addEventListener('change', e => {
            if (notInjectNode) notInjectNode.querySelector('#proxy-server').value = e.target.value;
            GM_setValue('th_search_proxy_server', e.target.value);
            proxy = e.target.value;
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