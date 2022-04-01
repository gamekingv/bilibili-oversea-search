// ==UserScript==
// @name         bilibili海外区域搜索_new
// @homepage     https://github.com/gamekingv/bilibili-oversea-search
// @version      0.1.0
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
        const tag = GM_getValue('search_page_style_tag'),
              list = document.querySelector('.search-content.inject-node'),
              area = document.querySelector('#proxy-area').value,
              keyword = document.querySelector('.search-input-el').value,
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
//         list.querySelector('ul').innerHTML = '';
//         list.querySelector('.total-wrap .total-text').innerHTML = '共0条数据';
//         list.querySelector('.flow-loader-state').innerHTML = '<div class="flow-loader-state-loading inject-node"><div class="load-state"><span class="loading">正在加载...</span></div></div>';
//         list.querySelector('.page-wrap').innerHTML = '';
        list.querySelector('.search-page').innerHTML = `<div class="search-loading-container p_relative" ${tag.loading}><p class="loading-text b_text text3 p_center" ${tag.loading}><img class="loading-gif mt_n4 mr_xs" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/loading_new.5a3d88cd.gif" alt="" ${tag.loading}> 加载中... </p></div>`;
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://${GM_getValue('th_search_proxy_server')}/intl/gateway/v2/app/search/type?${Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')}`,
            responseType: 'json',
            onload: e => {
                if (!e.response || !e.response.data) {
                    list.querySelector('.search-page').innerHTML = `<div class="search-neterror-container p_relative" ${tag.neterror}><img class="neterror-img p_center" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/net-error.8ba4a2c3.png" alt="" ${tag.neterror}></div>`;
                    return;
                }
                const result = e.response.data,
                      countNode = list.querySelector('.total-wrap .total-text');
                if (!result.items) {
                    list.querySelector('.search-page').innerHTML = `<div class="search-nodata-container p_relative" ${tag.nodata}><img class="nodata-img p_center" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/empty.3709c24c.png" alt="" ${tag.nodata}></div>`;
                    return;
                }
//                 else list.querySelector('.flow-loader-state').innerHTML = '';
//                 countNode.innerHTML = `共${result.items.length}条数据`;
                const allResultNode = document.createElement('div');
                allResultNode.className = 'row';
                for (let item of result.items) {
                    const resultNode = document.createElement('div'),
                          title = item.title.replace(/<\/?em[^>]*>/g, '');
                    resultNode.className = 'col_6 mb_x40';
                    resultNode.innerHTML = `<div class="bangumi-item-wrap">\
<a href="//www.bilibili.com/bangumi/play/ss${item.season_id}" title="${title}" target="_blank" class="left-img"><div class="lazy-img"><img alt="" src="${item.cover.replace(/https?:/, '')}"></div></a>\
<div class="right-info">\
<div class="headline"><span class="bangumi-label">番剧</span><a href="//www.bilibili.com/bangumi/play/ss${item.season_id}" title="${title}" target="_blank" class="title">${item.title}</a></div>\
<div id="pgc-navigate-wrap" class="grid"><ul class="ep-box clearfix grid"><li class="ep-sub"><a><div title="追番" class="ep-item">追番</div></a></li></ul></div>\
<div class="score"><div class="score-num"></div>\
</div>\
</div></div>`;
                    resultNode.innerHTML = `<div class="media-card" ${tag.card}>\
<a class="media-card-image" href="//www.bilibili.com/bangumi/play/ss${item.season_id}" target="_blank" ${tag.card}>\
<picture class="v-img">\
<source srcset="${item.cover.replace(/https?:/, '')}" type="image/webp">\
<img src="${item.cover.replace(/https?:/, '')}" loading="lazy" onload="">\
</picture>\
<div class="media-card-image-follow" ${tag.card}><svg ${tag.card}><use xlink:href="#widget-follow"></use></svg></div>\
<svg class="media-card-image-play" ${tag.card}><use xlink:href="#widget-play-logo"></use></svg>\
</a>\
<div class="media-card-content" ${tag.card}>\
<div class="media-card-content-head" ${tag.card}>\
<div class="media-card-content-head-title" ${tag.card}>\
<div class="tag tag-primary media-card-content-head-title-tag" ${tag.card} ${tag.tag}>番剧</div>\
<a title="${title}" class="text_ellipsis" href="//www.bilibili.com/bangumi/play/ss${item.season_id}" target="_blank" ${tag.card}>${item.title}</a>\
</div>\
<div class="media-card-content-head-text media-card-content-head-label" ${tag.card}>\
<span>${item.styles}</span>\
</div>\
</div></div></div>`;
                    allResultNode.appendChild(resultNode);
                }
                list.querySelector('.search-page').innerHTML = '<div class="media-list i_wrapper"></div>';
                list.querySelector('.search-page .media-list').appendChild(allResultNode);
                pager(page, result.total);
            },
            onerror: () => {
                list.querySelector('.search-page').innerHTML = `<div class="search-neterror-container p_relative" ${tag.neterror}><img class="neterror-img p_center" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/net-error.8ba4a2c3.png" alt="" ${tag.neterror}></div>`;
            }
        });
    }
    function searchTHM(page) {
        if (!page) page = 1;
        window.oversea_search_mode = 'THM';
        switchToSearch();
        const tag = GM_getValue('search_page_style_tag'),
              list = document.querySelector('.search-content.inject-node'),
              area = document.querySelector('#proxy-area').value,
              keyword = document.querySelector('.search-input-el').value,
              query = {
                  search_type: 'media_bangumi',
                  page,
                  page_size: 20,
                  keyword,
                  __refresh__: true,
                  highlight: '1',
                  single_column: 0,
                  area
              };
        // list.querySelector('.search-page').innerHTML = '';
        // list.querySelector('.total-wrap .total-text').innerHTML = '共0条数据';
        list.querySelector('.search-page').innerHTML = `<div class="search-loading-container p_relative" ${tag.loading}><p class="loading-text b_text text3 p_center" ${tag.loading}><img class="loading-gif mt_n4 mr_xs" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/loading_new.5a3d88cd.gif" alt="" ${tag.loading}> 加载中... </p></div>`;
        // list.querySelector('.search-page > .mt_x50.mb_lg.flex_center').innerHTML = '';
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://${GM_getValue(area + '_search_proxy_server') || 'api.bilibili.com'}/x/web-interface/search/type?${Object.entries(query).map(([key, value]) => `${key}=${value}`).join('&')}`,
            onload: e => {
                const response = e.response ? JSON.parse(e.response) : {};
                if (!e.response || !response.data) {
                    list.querySelector('.search-page').innerHTML = `<div class="search-neterror-container p_relative" ${tag.neterror}><img class="neterror-img p_center" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/net-error.8ba4a2c3.png" alt="" ${tag.neterror}></div>`;
                    // <div class="flow-loader-state-nothing inject-node"><div class="error-wrap error-0"><p class="text">代理服务器无法连接或存在限制</p></div></div>';
                    return;
                }
                const result = response.data;
                // countNode = list.querySelector('.total-wrap .total-text');
                if (result.numResults === 0) {
                    list.querySelector('.search-page').innerHTML = `<div class="search-nodata-container p_relative" ${tag.nodata}><img class="nodata-img p_center" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/empty.3709c24c.png" alt="" ${tag.nodata}></div>`;
                    return;
                }
                // else list.querySelector('.flow-loader-state').innerHTML = '';
                // countNode.innerHTML = `共${result.numResults}条数据`;
                const allResultNode = document.createElement('div');
                allResultNode.className = 'row';
                for (let item of result.result) {
                    const ep = item.eps ? item.eps.map(ep => `<a href="https://www.bilibili.com/bangumi/play/ep${ep.id}" target="_blank" ${tag.card} ${tag.footer}><button class="vui_button media-footer-btn" ${tag.card} ${tag.footer}>${Number(ep.title) ? ep.title : ep.title}</button></a>`) : [];
                    // <li class="ep-sub"><a href="//www.bilibili.com/bangumi/play/ep${ep.id}" target="_blank"><div title="${ep.index_title} ${ep.long_title}" class="ep-item">${Number(ep.title) ? ep.title : `<div class="name">${ep.title}</div>`}</div></a></li>`) : [];
                    const score = item.media_score && item.media_score.user_count > 0 ? `<div class="score media-card-content-footer-score" ${tag.score} ${tag.card}><span class="score-text" ${tag.score}>${item.media_score.user_count < 10000 ? item.media_score.user_count : `${(item.media_score.user_count / 10000).toFixed(1)}万`}人评分</span><span class="score-value" ${tag.score}>${item.media_score.score}<span >分</span></span></div>` : '';
                    const resultNode = document.createElement('div');
                    const title = item.title.replace(/<\/?em[^>]*>/g, '');
                    const date = new Date(item.pubtime*1000);
                    const dateString = `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(-2)}-${('0' + date.getDate()).slice(-2)}`;
                    resultNode.className = 'col_6 mb_x40';
                    resultNode.innerHTML = `<div class="media-card" ${tag.card}>\
<a class="media-card-image" href="//bangumi.bilibili.com/anime/${item.season_id}" target="_blank" ${tag.card}>\
<picture class="v-img">\
<source srcset="${item.cover.replace(/https?:/, '')}" type="image/webp">\
<img src="${item.cover.replace(/https?:/, '')}" loading="lazy" onload="">\
</picture>\
<div class="media-card-image-follow" ${tag.card}><svg ${tag.card}><use xlink:href="#widget-follow"></use></svg></div>\
<svg class="media-card-image-play" ${tag.card}><use xlink:href="#widget-play-logo"></use></svg>\
</a>\
<div class="media-card-content" ${tag.card}>\
<div class="media-card-content-head" ${tag.card}>\
<div class="media-card-content-head-title" ${tag.card}>\
<div class="tag tag-primary media-card-content-head-title-tag" ${tag.card} ${tag.tag}>${item.season_type_name}</div>\
<a title="${title}" class="text_ellipsis" href="//bangumi.bilibili.com/anime/${item.season_id}" target="_blank" ${tag.card}>${item.title}</a>\
</div>\
<div class="media-card-content-head-text media-card-content-head-label" ${tag.card}>\
<span>${item.styles} <span> · </span></span>\
<span>${dateString} <span> · </span></span>\
<span>${item.index_show}</span>\
</div>\
<div class="media-card-content-head-text media-card-content-head-cv text_ellipsis" ${tag.card}>\
<div ${tag.card}>声优:</div><span title=""${item.cv}">"${item.cv}</span></div>\
<div title="${item.desc}" class="media-card-content-head-text media-card-content-head-desc text_ellipsis_3l" ${tag.card}><div>简介:</div><span>${item.desc}</span></div>\
</div>\
<div class="media-card-content-footer" ${tag.card}>\
${score}\
<div class="media-card-content-footer-btns" ${tag.card}>\
<a href="https://www.bilibili.com/bangumi/play/ss${item.season_id}" target="_blank">\
<button class="vui_button vui_button--blue media-card-btn pgc_btn_size" ${tag.card}>立即观看</button>\
</a>\
<div class="media-footer" ${tag.card} ${tag.footer}>${ep.join('')}</div>\
</div></div></div></div>`;
                    allResultNode.appendChild(resultNode);
                }
                list.querySelector('.search-page').innerHTML = '<div class="media-list i_wrapper"></div>';
                list.querySelector('.search-page .media-list').appendChild(allResultNode);
                pager(page, result.numResults);
            },
            onerror: () => {
                list.querySelector('.search-page').innerHTML = `<div class="search-neterror-container p_relative" ${tag.neterror}><img class="neterror-img p_center" src="//s1.hdslb.com/bfs/static/laputa-search/client/assets/net-error.8ba4a2c3.png" alt="" ${tag.neterror}></div>`;
            }
        });
    }
    function pager(page, total) {
        if (total <= 20) return;
        const totalPage = Math.ceil(total / 20);
        let pagesNodes = '<div class="mt_x50 mb_lg flex_center"><div class="vui_pagenation"><div class="vui_pagenation--btns">';
        if (page === 1) pagesNodes += '<button class="vui_button vui_button--disabled vui_pagenation--btn vui_pagenation--btn-side" disabled="">上一页</button>';
        else pagesNodes += '<button class="vui_button vui_pagenation--btn vui_pagenation--btn-side">上一页</button>';
        if (page - 1 <= 4) {
            for (let i = 1; i < page; i++) {
                pagesNodes += `<button class="vui_button vui_button--no-transition vui_pagenation--btn vui_pagenation--btn-num">${i}</button>`;
            }
        }
        else {
            pagesNodes += '<button class="vui_button vui_button--no-transition vui_pagenation--btn vui_pagenation--btn-num">1</button><span class="vui_pagenation--extend">...</span>';
            for (let i = page - 3; i < page; i++) {
                pagesNodes += `<button class="vui_button vui_button--no-transition vui_pagenation--btn vui_pagenation--btn-num">${i}</button>`;
            }
        }
        pagesNodes += `<button class="vui_button vui_button--active vui_button--active-blue vui_button--no-transition vui_pagenation--btn vui_pagenation--btn-num">${page}</button>`;
        if (totalPage - page <= 4) {
            for (let i = page + 1; i <= totalPage; i++) {
                pagesNodes += `<button class="vui_button vui_button--no-transition vui_pagenation--btn vui_pagenation--btn-num">${i}</button>`;
            }
        }
        else {
            for (let i = page + 1; i <= page + 3; i++) {
                pagesNodes += `<button class="vui_button vui_button--no-transition vui_pagenation--btn vui_pagenation--btn-num">${i}</button>`;
            }
            pagesNodes += `<span class="vui_pagenation--extend">...</span><button class="vui_button vui_button--no-transition vui_pagenation--btn vui_pagenation--btn-num">${totalPage}</button>`;
        }
        if (page !== totalPage) pagesNodes += '<button class="vui_button vui_pagenation--btn vui_pagenation--btn-side">下一页</button>';
        else pagesNodes += '<button class="vui_button vui_button--disabled vui_pagenation--btn vui_pagenation--btn-side" disabled="">下一页</button>';
        pagesNodes += '</div></div></div>';

        const newNode = document.createElement('div');
        document.querySelector('.search-content.inject-node .search-page').appendChild(newNode);
        newNode.outerHTML = pagesNodes;
        document.querySelectorAll('.search-content.inject-node .vui_pagenation .vui_button:not(.vui_button--active):not(.vui_button--disabled)').forEach(node => node.addEventListener('click', () => {
            const pageText = node.innerHTML.replace(/<[^>]*>/g, '');
            if (pageText === '上一页') {
                if (window.oversea_search_mode === 'TH') searchTH(page - 1);
                else if (window.oversea_search_mode === 'THM') searchTHM(page - 1);
            }
            else if (pageText === '下一页') {
                if (window.oversea_search_mode === 'TH') searchTH(page + 1);
                else if (window.oversea_search_mode === 'THM') searchTHM(page + 1);
            }
            else {
                if (window.oversea_search_mode === 'TH') searchTH(parseInt(pageText));
                else if (window.oversea_search_mode === 'THM') searchTHM(parseInt(pageText));
            }
            document.querySelector('.btn-to-top').click();
        }));
    }
    function switchToNormal() {
        window.oversea_search_mode = '';
        const list = document.querySelector('.search-content:not(.inject-node)'),
              injectList = document.querySelector('.search-content.inject-node');
        list.style.display = '';
        if (injectList) injectList.style.display = 'none';
    }
    function switchToSearch() {
        const list = document.querySelector('.search-content:not(.inject-node)'),
              injectList = document.querySelector('.search-content.inject-node');
        list.style.display = 'none';
        if (injectList) injectList.style.display = '';
        else {
            const injectNewList = document.createElement('div');
            list.parentNode.appendChild(injectNewList);
            injectNewList.outerHTML = '<div class="search-content inject-node"><div class="search-page-wrapper"><div class="search-page i_page_container search-page-bangumi mt_xxl"></div></div></div>';
            // injectButton(true);
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
        const injectNode = /*document.querySelector(injected ? '#bangumi-list.inject-node .total-wrap' : '#bangumi-list .total-wrap')*/document.querySelector('.search-header'),
              //notInjectNode = document.querySelector(!injected ? '#bangumi-list.inject-node .total-wrap' : '#bangumi-list .total-wrap'),
              injectContainer = document.createElement('div'),
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
        //th_proxyNode.style = 'margin-left: 20px;';
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
        injectContainer.style = 'margin: 10px 0 0 64px;';
        injectContainer.className = 'inject-bar';
        injectContainer.appendChild(th_proxyNode);
        injectContainer.appendChild(hk_proxyNode);
        injectContainer.appendChild(tw_proxyNode);
        injectContainer.appendChild(cn_proxyNode);
        injectContainer.appendChild(proxy_area);
        injectContainer.appendChild(buttonNode);
        injectNode.appendChild(injectContainer);
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
            //if (notInjectNode) notInjectNode.querySelector('#th-proxy-server').value = e.target.value;
            GM_setValue('th_search_proxy_server', e.target.value);
        });
        injectNode.querySelector('#hk-proxy-server').addEventListener('change', e => {
            //if (notInjectNode) notInjectNode.querySelector('#hk-proxy-server').value = e.target.value;
            GM_setValue('hk_search_proxy_server', e.target.value);
        });
        injectNode.querySelector('#tw-proxy-server').addEventListener('change', e => {
            //if (notInjectNode) notInjectNode.querySelector('#tw-proxy-server').value = e.target.value;
            GM_setValue('tw_search_proxy_server', e.target.value);
        });
        injectNode.querySelector('#cn-proxy-server').addEventListener('change', e => {
            //if (notInjectNode) notInjectNode.querySelector('#cn-proxy-server').value = e.target.value;
            GM_setValue('cn_search_proxy_server', e.target.value);
        });
    }
    function injectObserver() {
        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.target.className.includes('-active')) injectButton();
                else if (mutation.type === 'attributes' && !mutation.target.className.includes('-active')) {
                    const injectNode = document.querySelector('.inject-bar');
                    injectNode.parentNode.removeChild(injectNode);
                }
                // const injectNode = document.querySelector('#bangumi-list.inject-node');
                // if (injectNode) injectNode.style.display = 'none';
            }
        }), config = { attributes: true, childList: true };
        let observeNode;
        document.querySelectorAll('.search-tabs > .vui_tabs > nav > ul > li').forEach(node => node.innerHTML.includes('番剧') && (observeNode = node));
        observer.observe(observeNode, config);
        if (observeNode.className.includes('-active')) injectButton();
    }
    const searchAppObserver = new MutationObserver(mutationsList => {
        for (let mutation of mutationsList) {
            console.log(mutation);
            if (mutation.addedNodes.length > 0 && mutation.addedNodes[0].tagName === 'DIV' && mutation.addedNodes[0].querySelector('.search-content')) {
                injectObserver();
                document.querySelector('.search-panel-popover').addEventListener('click', () => switchToNormal());
                document.querySelector('.search-button').addEventListener('click', () => switchToNormal());
                document.querySelector('.search-input-el').addEventListener('keyup', e => e.keyCode === 13 && switchToNormal());
            }
        }
    });
    searchAppObserver.observe(document.querySelector('.search-layout'), { childList: true });
    if (document.querySelector('.search-layout .search-content')) {
        injectObserver();
        document.querySelector('.search-panel-popover').addEventListener('click', () => switchToNormal());
        document.querySelector('.search-button').addEventListener('click', () => switchToNormal());
        document.querySelector('.search-input-el').addEventListener('keyup', e => e.keyCode === 13 && switchToNormal());
    }
    const styleLink = document.head.innerHTML.match(/\/\/s1\.hdslb\.com\/bfs\/static\/laputa-search\/client\/assets\/index\.([^.]+)\.css/);
    if (styleLink && styleLink[1] && styleLink[1] !== GM_getValue('search_page_style_hash')) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://${styleLink[0]}`,
            onload: e => {
                const styles = e.response;
                if(styles) {
                    const card = (styles.match(/\.media-card\[(data-v-[^\]]+)\]/) ?? [])[1];
                    const loading = (styles.match(/\.search-loading-container\[(data-v-[^\]]+)\]/) ?? [])[1];
                    const neterror = (styles.match(/\.search-neterror-container\[(data-v-[^\]]+)\]/) ?? [])[1];
                    const nodata = (styles.match(/\.search-nodata-container\[(data-v-[^\]]+)\]/) ?? [])[1];
                    const score = (styles.match(/\.score\[(data-v-[^\]]+)\]/) ?? [])[1];
                    const tag = (styles.match(/\.tag\[(data-v-[^\]]+)\]/) ?? [])[1];
                    const footer = (styles.match(/\.media-footer\[(data-v-[^\]]+)\]/) ?? [])[1];
                    const search_page_style_tag = {card, loading, neterror, nodata, score, tag, footer};
                    GM_setValue('search_page_style_tag', search_page_style_tag);
                    GM_setValue('search_page_style_hash', styleLink[1]);
                }
            }
        });
    }
})();
