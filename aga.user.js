// ==UserScript==
// @name         AGA News Fix
// @namespace    https://github.com/MurakumoIndustries/Userscript
// @version      0.3
// @description  Userscript for fixing news on desktop browser
// @author       Murakumo Industries
// @match        http://alice.colopl.jp/news*
// @match        http://alice.colopl.jp/help*
// @match        http://alice.colopl.jp/web*
// @match        https://alice.colopl.jp/news*
// @match        https://alice.colopl.jp/help*
// @match        https://alice.colopl.jp/web*
// @updateURL    https://github.com/MurakumoIndustries/Userscript/raw/master/aga.user.js
// @downloadURL  https://github.com/MurakumoIndustries/Userscript/raw/master/aga.user.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    var addStyle = function (cssStr) {
        var D = document;
        var newNode = D.createElement('style');
        newNode.textContent = cssStr;
        var targ = D.getElementsByTagName('head')[0] || D.body || D.documentElement;
        targ.appendChild(newNode);
    };
    //fix scroll on PC
    window.mainScroll.destroy();
    document.getElementById('mainScroll').style.overflowY = 'visible';
    addStyle(`
    * {
        overflow-y:visible;
    }
`);
    //fix unclickable external links
    var dataUrlList = document.querySelectorAll('[data-url]');
    for (const key in dataUrlList) {
        if (dataUrlList.hasOwnProperty(key)) {
            const element = dataUrlList[key];

            element.addEventListener('click', function () {
                window.open(element.getAttribute('data-url'), '_blank');
            });
            element.style.cursor = "pointer";
        }
    }
    //fix clickable imgs with no pointer cursor
    var onclickList = document.querySelectorAll('[onclick]');
    for (const key in onclickList) {
        if (onclickList.hasOwnProperty(key)) {
            const element = onclickList[key];
            element.style.cursor = "pointer";
        }
    }
    //fix clickable links with no pointer cursor
    var dataHrefList = document.querySelectorAll('[data-href]');
    for (const key in dataHrefList) {
        if (dataHrefList.hasOwnProperty(key)) {
            const element = dataHrefList[key];
            element.style.cursor = "pointer";
        }
    }
    //reduce size for big window
    var clientWidth = 0;
    if (window.innerWidth) {
        clientWidth = window.innerWidth
    }
    else {
        if (document.documentElement && document.documentElement.clientWidth != 0) {
            clientWidth = document.documentElement.clientWidth
        }
        else {
            if (document.body) {
                clientWidth = document.body.clientWidth
            }
        }
    }
    var maxWidth = 466.66;
    var clientWidthReal = clientWidth;
    if (clientWidth > maxWidth) {
        clientWidth = maxWidth;
    }

    var fontSize = Math.round((clientWidth / 26.67) * 100) / 100;
    var lineHeight = Math.round((clientWidth / 26.67 * 1.4) * 100) / 100;

    var html = document.getElementsByTagName("html")[0];
    html.style.fontSize = ((clientWidth / 640) * 100) + "px";

    document.body.style.fontSize = fontSize + "px";
    document.body.style.lineHeight = lineHeight + "px";
    document.body.style.width = clientWidth + "px";
    document.body.style.height = "auto";

    var mainScrollWidth = clientWidth / maxWidth * 600;
    if (mainScrollWidth > clientWidthReal) {
        mainScrollWidth = clientWidthReal;
        document.getElementById('mainScroll').style.width = mainScrollWidth + 'px';
    }
    else {
        document.getElementById('mainScroll').style.width = 'auto';
        document.getElementsByClassName('scroller')[0].style.width = mainScrollWidth + 'px';
    }
    //disable hide_Android,hide_iOS,hide_DMM
    addStyle(`
    .hide_Android,.hide_iOS,.hide_DMM   { display: block; }
    .show_only_Android {
        display:block;
        background-color: rgba(0, 255, 0, 0.2);
    }
    .show_only_iOS {
        display:block;
        background-color: rgba(0, 0, 0, 0.2);
    }
    .show_only_DMM {
        display:block;
        background-color: rgba(0, 188, 212, 0.2);
    }
`);
    //fix news
    addStyle(`
.one-line{
    white-space: normal;
    text-indent: 0;
    padding-left: 0;
}
`);
    //add expand all button on /news/importants
    if (location.pathname === "/news/importants") {
        var btn = document.createElement("a");
        btn.style.display = 'block';
        btn.style.padding = '0.1rem';
        btn.style.color = 'white';
        btn.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        btn.style.right = '0.1rem';
        btn.style.bottom = '0.1rem';
        btn.style.position = 'fixed';
        btn.style.zIndex = '9999';
        btn.style.cursor = 'pointer';
        btn.text = 'Expand/Collapse All';
        btn.addEventListener('click', function () {
            var event = new MouseEvent('click', {
                'view': window,
                'bubbles': true,
                'cancelable': true
            });
            var activeList = document.getElementsByClassName('weighty-column active');
            var len = activeList.length
            if (len) {
                for (let i = 0; i < len; i++) {
                    activeList[0].dispatchEvent(event);
                }
            }
            else {
                var allList = document.getElementsByClassName('weighty-column');
                len = allList.length
                for (let i = 0; i < len; i++) {
                    allList[i].dispatchEvent(event);
                }
            }
        });
        document.body.appendChild(btn)
    }
})();