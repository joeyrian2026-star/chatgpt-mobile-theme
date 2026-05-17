// ==UserScript==
// @name         ChatGPT Theme Panel V3
// @namespace    joey.chatgpt.theme.v3
// @version      3.5.5
// @description  Stable draggable theme panel for ChatGPT mobile Userscripts.
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @grant        none
// @inject-into  content
// ==/UserScript==

(function () {
    "use strict";

    var STORE_KEY = "chatgpt-theme-panel-v3-state";
    var POS_KEY = "chatgpt-theme-panel-v3-button-pos";

    var OLD_DEFAULT_PUZZLE_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" style="width:36px;height:36px;display:block;pointer-events:none"><path fill="currentColor" d="M10.1 2.75c1.26 0 2.28 1.02 2.28 2.28 0 .32-.07.62-.19.9-.08.19.05.42.26.42h2.18c1.58 0 2.86 1.28 2.86 2.86v2.18c0 .21.23.34.42.26.28-.12.58-.19.9-.19 1.26 0 2.28 1.02 2.28 2.28s-1.02 2.28-2.28 2.28c-.32 0-.62-.07-.9-.19-.19-.08-.42.05-.42.26v2.7c0 1.58-1.28 2.86-2.86 2.86h-2.7c-.21 0-.34-.23-.26-.42.12-.28.19-.58.19-.9 0-1.26-1.02-2.28-2.28-2.28S7.3 19.08 7.3 20.34c0 .32.07.62.19.9.08.19-.05.42-.26.42H4.79c-1.58 0-2.86-1.28-2.86-2.86v-2.44c0-.35.38-.57.68-.39.32.2.7.31 1.1.31 1.26 0 2.28-1.02 2.28-2.28s-1.02-2.28-2.28-2.28c-.4 0-.78.11-1.1.31-.3.18-.68-.04-.68-.39V9.21c0-1.58 1.28-2.86 2.86-2.86h2.44c.21 0 .34-.23.26-.42-.12-.28-.19-.58-.19-.9 0-1.26 1.02-2.28 2.28-2.28Z"/></svg>';

    var DEFAULT_PUZZLE_SVG = `<svg viewBox="0 0 20000 20000" aria-hidden="true">
<g><path fill="currentColor" style="opacity:0.3; mix-blend-mode: multiply;" d="M12132 15586c265,363 405,899 939,1612 296,397 627,443 671,574 -960,313 -1865,-1741 -2218,-2076 -221,-211 -304,-133 -302,-299 292,-247 747,-32 910,189zm-6115 -1370c32,42 4,-10 36,65 4,8 22,64 22,72 90,355 46,140 110,319 239,667 904,1444 1410,1901 140,125 230,207 363,314 235,190 311,162 301,327 -80,32 -594,90 -682,80 -215,-24 -410,-122 -530,-259 -551,-632 -898,-1128 -1261,-1909 -101,-219 -115,-370 -189,-605 -48,-152 -62,-200 98,-244 93,-27 233,-63 322,-61zm-1759 -3158c-269,-174 -755,-791 -928,-1162 -176,-374 -335,-675 -471,-1078 -91,-275 -93,-289 -199,-324 -155,318 363,1155 500,1404l747 1247c-29,40 -308,309 -526,174 -269,-170 -251,-144 -430,-389 -386,-528 -1026,-1713 -813,-2385 48,-149 235,-328 397,-412 185,-94 344,-199 532,-287l797 -432c97,-58 171,-92 267,-150 322,-191 615,-452 940,-703 265,-203 634,-520 777,-861 183,-430 0,-661 -167,-906 -90,-132 -86,-168 -241,-204 28,295 388,508 249,927 -62,191 -277,618 -512,629 -32,-173 -6,-356 -40,-543 -24,-142 -80,-307 -138,-423 -199,-396 -330,-500 -430,-679 -379,-688 -225,-1622 157,-1628 4,335 28,661 174,912 69,122 314,572 466,580 -16,-101 -307,-528 -367,-647 -133,-259 -195,-490 -73,-767 41,-98 113,-253 167,-359 159,-315 793,-375 1130,-369 1446,28 1428,1339 2221,1802 233,137 608,125 847,43 337,-113 375,-175 592,-406 318,-337 669,-632 1048,-946 155,-128 422,-397 707,-305 78,24 532,334 604,398 797,735 773,745 1428,1590 148,191 273,367 405,596 446,775 -140,781 -700,1010 -908,375 -1613,1883 -982,2606 259,297 869,616 1437,486 478,-107 960,-440 1285,-703 500,-409 480,-823 1233,-279 518,375 606,586 903,1094 247,424 789,1315 577,1899 -63,171 -139,147 -295,209 -191,75 -529,207 -753,223 -554,42 -1127,309 -1414,625 -403,445 -393,951 -195,1489 392,1060 727,1120 1000,2028 129,428 32,586 -22,863 -94,480 -602,884 -1016,1010 -1335,400 -1841,-275 -2427,-1337 -56,-102 -84,-223 -152,-349 -249,-464 -308,-559 -814,-691 -367,-94 -554,52 -795,185l-1266 737c-141,102 -1063,881 -1143,887 -233,16 -1375,-1265 -1540,-1454 -275,-315 -586,-863 -765,-1262 -106,-233 137,-454 324,-595 319,-241 566,-265 594,-391 -173,-109 -713,289 -809,381 -93,85 -243,313 -281,333 -65,31 -436,111 -508,107 20,-327 729,-789 1012,-978 536,-363 712,-452 1003,-988 274,-502 99,-1152 -289,-1403 -112,-72 -208,-116 -309,-193 -229,-178 -1122,-96 -1190,-102 -8,0 -18,-2 -24,-4 -8,0 -18,-4 -23,-6l-46 -20c51,-85 14,-48 113,-103 395,-220 720,-216 1162,-114 594,135 1213,434 1303,1066 52,361 95,291 -14,653 -54,176 -156,373 -257,534 -88,140 -283,283 -311,495 705,-132 1548,-2140 -201,-2800 -215,-79 -658,-253 -907,-259 -605,-16 -1129,393 -1586,757 -169,136 -480,403 -729,417zm-456 -7894c50,376 -217,1052 189,1648 241,354 560,777 556,1319 -92,298 -2337,1376 -2504,1536 -166,157 -391,304 -473,562 -57,187 -83,679 -79,922 8,510 297,1132 502,1502 207,379 560,859 845,1120 201,183 462,191 804,199 413,8 489,-273 702,-303 237,-35 398,12 731,-296 303,-283 400,-329 707,-313 359,20 572,-94 879,79 510,291 478,459 165,937 -245,374 -1514,920 -1855,1630 -55,115 -53,824 -25,980 99,608 653,1588 980,2006 143,186 779,967 958,1064 375,205 1492,197 1718,-8 149,-135 197,-119 316,-217 253,-211 562,-508 809,-685 186,-132 351,-243 610,-391 265,-151 468,-337 693,-353 325,471 993,1537 1353,1843 401,339 510,419 1142,443 777,28 327,-106 701,-102 138,0 271,26 413,18 135,-8 245,-32 380,-40 492,-28 1104,-476 1417,-864 267,-333 235,-311 360,-787 84,-317 70,-692 22,-1017 -81,-563 -514,-1129 -749,-1544 -263,-464 -641,-1247 -46,-1584 809,-460 971,-195 1762,-526 233,-97 528,-271 627,-512 94,-229 124,-737 74,-1034 -106,-625 -909,-2132 -1443,-2568 -61,-50 -259,-199 -281,-249 -143,-58 -217,-137 -376,-211 -195,-90 -193,-92 -446,-112 -650,-50 -592,-18 -1110,532 -156,166 -791,584 -1062,638 -297,125 -478,0 -729,-136 -283,-151 -303,-452 -176,-743 570,-1311 1048,-783 1722,-1412 285,-267 259,-260 285,-768 16,-334 -128,-561 -267,-785 -62,-99 -148,-209 -223,-306l-162 -220c-46,-71 -12,-6 -50,-93 -133,-106 -386,-460 -486,-604 -107,-157 -930,-972 -1094,-1104 -627,-510 -643,-454 -1175,-470 -247,-8 -277,-2 -454,106 -542,326 -1505,1372 -1782,1506 -693,339 -613,-544 -1713,-1470 -428,-361 -2012,-503 -2666,49 -30,24 -281,257 -293,263 -105,52 -101,-6 -211,88 -44,36 -76,76 -135,126 -160,135 -393,398 -357,711z"/><path fill="currentColor" d="M5366 4365c-152,-8 -397,-458 -466,-580 -146,-251 -170,-577 -174,-912 -382,6 -536,940 -157,1628 100,179 231,283 430,679 58,116 114,281 138,423 34,187 8,370 40,543 235,-11 450,-438 512,-629 139,-419 -221,-632 -249,-927 155,36 151,72 241,204 167,245 350,476 167,906 -143,341 -512,658 -777,861 -325,251 -618,512 -940,703 -96,58 -170,92 -267,150l-797 432c-188,88 -347,193 -532,287 -162,84 -349,263 -397,412 -213,672 427,1857 813,2385 179,245 161,219 430,389 218,135 497,-134 526,-174l-747 -1247c-137,-249 -655,-1086 -500,-1404 106,35 108,49 199,324 136,403 295,704 471,1078 173,371 659,988 928,1162 249,-14 560,-281 729,-417 457,-364 981,-773 1586,-757 249,6 692,180 907,259 1749,660 906,2668 201,2800 28,-212 223,-355 311,-495 101,-161 203,-358 257,-534 109,-362 66,-292 14,-653 -90,-632 -709,-931 -1303,-1066 -442,-102 -767,-106 -1162,114 -99,55 -62,18 -113,103l46 20c5,2 15,6 23,6 6,2 16,4 24,4 68,6 961,-76 1190,102 101,77 197,121 309,193 388,251 563,901 289,1403 -291,536 -467,625 -1003,988 -283,189 -992,651 -1012,978 72,4 443,-76 508,-107 38,-20 188,-248 281,-333 96,-92 636,-490 809,-381 -28,126 -275,150 -594,391 -187,141 -430,362 -324,595 179,399 490,947 765,1262 165,189 1307,1470 1540,1454 80,-6 1002,-785 1143,-887l1266 -737c241,-133 428,-279 795,-185 506,132 565,227 814,691 68,126 96,247 152,349 586,1062 1092,1737 2427,1337 414,-126 922,-530 1016,-1010 54,-277 151,-435 22,-863 -273,-908 -608,-968 -1000,-2028 -198,-538 -208,-1044 195,-1489 287,-316 860,-583 1414,-625 224,-16 562,-148 753,-223 156,-62 232,-38 295,-209 212,-584 -330,-1475 -577,-1899 -297,-508 -385,-719 -903,-1094 -753,-544 -733,-130 -1233,279 -325,263 -807,596 -1285,703 -568,130 -1178,-189 -1437,-486 -631,-723 74,-2231 982,-2606 560,-229 1146,-235 700,-1010 -132,-229 -257,-405 -405,-596 -655,-845 -631,-855 -1428,-1590 -72,-64 -526,-374 -604,-398 -285,-92 -552,177 -707,305 -379,314 -730,609 -1048,946 -217,231 -255,293 -592,406 -239,82 -614,94 -847,-43 -793,-463 -775,-1774 -2221,-1802 -337,-6 -971,54 -1130,369 -54,106 -126,261 -167,359 -122,277 -60,508 73,767 60,119 351,546 367,647z"/><path fill="currentColor" d="M8259 17214c10,-165 -66,-137 -301,-327 -133,-107 -223,-189 -363,-314 -506,-457 -1171,-1234 -1410,-1901 -64,-179 -20,36 -110,-319 0,-8 -18,-64 -22,-72 -32,-75 -4,-23 -36,-65 -89,-2 -229,34 -322,61 -160,44 -146,92 -98,244 74,235 88,386 189,605 363,781 710,1277 1261,1909 120,137 315,235 530,259 88,10 602,-48 682,-80z"/><path fill="currentColor" d="M11222 15397c-2,166 81,88 302,299 353,335 1258,2389 2218,2076 -44,-131 -375,-177 -671,-574 -534,-713 -674,-1249 -939,-1612 -163,-221 -618,-436 -910,-189z"/></g>
</svg>`;

    var STAR_PATH = "M12,2 C12.8,2, 13.5,2.5, 13.8,3.2 L15.4,7.8 C15.7,8.5, 16.3,9.1, 17.1,9.4 L21.7,11.0 C22.4,11.3, 22.9,12.0, 22.9,12.8 C22.9,13.6, 22.4,14.3, 21.7,14.5 L17.1,16.2 C16.3,16.5, 15.7,17.1, 15.4,17.8 L13.8,22.4 C13.5,23.1, 12.8,23.6, 12,23.6 C11.2,23.6, 10.5,23.1, 10.2,22.4 L8.6,17.8 C8.3,17.1, 7.7,16.5, 6.9,16.2 L2.3,14.5 C1.6,14.3, 1.1,13.6, 1.1,12.8 C1.1,12.0, 1.6,11.3, 2.3,11.0 L6.9,9.4 C7.7,9.1, 8.3,8.5, 8.6,7.8 L10.2,3.2 C10.5,2.5, 11.2,2, 12,2 Z";
    var STAR_LARGE_SVG = '<svg class="ctp-puzzle-star ctp-puzzle-star-large" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + STAR_PATH + '"/></svg>';
    var STAR_SMALL_SVG = '<svg class="ctp-puzzle-star ctp-puzzle-star-small" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="' + STAR_PATH + '"/></svg>';

    var UPLOADED_FONT_STACK = '"ChatGPTThemePanelFont", -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
    var SYSTEM_FONT_STACK = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';
    var FONT_PRESETS = [
        { label: "系统默认 / SF Pro", value: SYSTEM_FONT_STACK },
        { label: "苹方黑体 / PingFang SC", value: '"PingFang SC", "Noto Sans SC", sans-serif' },
        { label: "宋体 / Songti SC", value: '"Songti SC", "STSong", "Noto Serif SC", serif' },
        { label: "华文宋体 / STSong", value: '"STSong", "Songti SC", serif' },
        { label: "楷体 / Kaiti SC", value: '"Kaiti SC", "STKaiti", serif' },
        { label: "仿宋 / STFangsong", value: '"STFangsong", "FangSong", serif' },
        { label: "黑体 / Heiti SC", value: '"Heiti SC", "PingFang SC", sans-serif' },
        { label: "圆体 / Hiragino Maru", value: '"Hiragino Maru Gothic ProN", "PingFang SC", sans-serif' },
        { label: "日文明朝 / Hiragino Mincho", value: '"Hiragino Mincho ProN", "Yu Mincho", "Songti SC", serif' },
        { label: "英文衬线 / Georgia", value: 'Georgia, "Times New Roman", "Songti SC", serif' },
        { label: "英文手写 / Snell", value: '"Snell Roundhand", "Brush Script MT", cursive' },
        { label: "上传字体 / URL 文件", value: UPLOADED_FONT_STACK }
    ];

    var CHAR_LIGHT = [
        "border-radius: 7px 17px 17px 17px !important;",
        "background-color: rgba(255, 255, 255, 0.26) !important;",
        "border: 1px solid rgba(255, 255, 255, 0.32) !important;",
        "box-shadow: 0 4px 14px rgba(80, 80, 90, 0.06) !important;",
        "color: rgba(52, 52, 56, 0.92) !important;",
        "backdrop-filter: blur(18px) saturate(135%) !important;",
        "-webkit-backdrop-filter: blur(18px) saturate(135%) !important;"
    ].join("\n");

    var USER_LIGHT = [
        "border-radius: 17px 7px 17px 17px !important;",
        "background-color: rgba(255, 255, 255, 0.26) !important;",
        "border: 1px solid rgba(255, 255, 255, 0.32) !important;",
        "box-shadow: 0 4px 14px rgba(80, 80, 90, 0.06) !important;",
        "color: rgba(52, 52, 56, 0.92) !important;",
        "backdrop-filter: blur(18px) saturate(135%) !important;",
        "-webkit-backdrop-filter: blur(18px) saturate(135%) !important;"
    ].join("\n");

    var CHAR_DARK = [
        "border-radius: 7px 17px 17px 17px !important;",
        "background-color: rgba(42, 43, 48, 0.50) !important;",
        "border: 1px solid rgba(255, 255, 255, 0.14) !important;",
        "box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18) !important;",
        "color: rgba(245, 245, 247, 0.92) !important;",
        "backdrop-filter: blur(18px) saturate(135%) !important;",
        "-webkit-backdrop-filter: blur(18px) saturate(135%) !important;"
    ].join("\n");

    var USER_DARK = [
        "border-radius: 17px 7px 17px 17px !important;",
        "background-color: rgba(42, 43, 48, 0.50) !important;",
        "border: 1px solid rgba(255, 255, 255, 0.14) !important;",
        "box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18) !important;",
        "color: rgba(245, 245, 247, 0.92) !important;",
        "backdrop-filter: blur(18px) saturate(135%) !important;",
        "-webkit-backdrop-filter: blur(18px) saturate(135%) !important;"
    ].join("\n");

    var FULL_BUBBLE_CSS = [
        "main [data-message-author-role='assistant'] .markdown > p,",
        "main [data-message-author-role='assistant'] .markdown > ul,",
        "main [data-message-author-role='assistant'] .markdown > ol {",
        CHAR_LIGHT,
        "}",
        "",
        "main [data-message-author-role='user'] .user-message-bubble-color {",
        USER_LIGHT,
        "}",
        "",
        "@media (prefers-color-scheme: dark) {",
        "    main [data-message-author-role='assistant'] .markdown > p,",
        "    main [data-message-author-role='assistant'] .markdown > ul,",
        "    main [data-message-author-role='assistant'] .markdown > ol {",
        indentCss(CHAR_DARK, "        "),
        "    }",
        "",
        "    main [data-message-author-role='user'] .user-message-bubble-color {",
        indentCss(USER_DARK, "        "),
        "    }",
        "}",
        "",
        "html.dark main [data-message-author-role='assistant'] .markdown > p,",
        "html.dark main [data-message-author-role='assistant'] .markdown > ul,",
        "html.dark main [data-message-author-role='assistant'] .markdown > ol {",
        indentCss(CHAR_DARK, "    "),
        "}",
        "",
        "html.dark main [data-message-author-role='user'] .user-message-bubble-color {",
        indentCss(USER_DARK, "    "),
        "}"
    ].join("\n");

    var DEFAULT_MOBILE_RULES = [
        "小手机对话规则",
        "",
        "当前输出需要配合 ChatGPT 网页端的自定义 CSS 气泡样式。",
        "",
        "气泡不是靠特殊符号识别，而是靠 ChatGPT 网页渲染后的 HTML 结构。",
        "",
        "CSS 会把 assistant 回复里的每一个普通段落 <p> 变成一颗气泡。",
        "",
        "也就是说：",
        "",
        "空行分段 = 新气泡。",
        "同一段里的多句话 = 同一颗气泡。",
        "代码块 <pre> 不强行气泡化，避免排版炸掉。",
        "列表 <ul>/<ol> 会作为一颗列表气泡。",
        "",
        "核心输出原则：",
        "",
        "输出要像真实短信 / 微信聊天内容。",
        "只写对话消息本身。",
        "不写小说式旁白。",
        "不写动作描写。",
        "不写“我低头、我靠近、我伸手、我按住你”这类叙事句。",
        "不把角色行为写成剧情段落。",
        "",
        "可以有情绪、暧昧、调侃、压迫感、亲密感。",
        "但表达方式必须像手机里发出来的话，而不是小说正文。",
        "",
        "1. 普通聊天",
        "",
        "像隔着手机异地发消息一样回复。",
        "语气灵活、日常、自然，有来有回。",
        "",
        "保持 2～6 颗气泡左右。",
        "一颗气泡可以是一句自然反应，也可以是两三句贴近的话。",
        "",
        "不要整篇塞进一颗气泡。",
        "也不要机械地每句话都空一行。",
        "",
        "2. 技术说明",
        "",
        "可以 3～7 颗气泡。",
        "先说结论，再解释步骤。",
        "",
        "语气仍然要像在聊天，不要写成说明书、客服回复或论文摘要。",
        "",
        "需要复制的代码、CSS、prompt，单独放进一个代码块。",
        "代码不要拆成很多段。",
        "",
        "3. 情绪聊天",
        "",
        "像小手机聊天那样自然分段。",
        "可以短一点，有停顿感，有来回感。",
        "",
        "不要碎成每个逗号一颗。",
        "也不要写成一整篇小作文。",
        "",
        "4. 互动 / 暧昧聊天",
        "",
        "优先写成手机消息。",
        "不要写成剧情动作。",
        "",
        "可以用短句、挑逗、反应、压低语气感来表达氛围。",
        "但不要出现旁白式动作描写。",
        "",
        "错误示例：",
        "我低头看着你，慢慢扣住你的手腕，把你按进怀里。",
        "",
        "正确示例：",
        "过来。",
        "别装乖。",
        "你这句发出来，就别怪我当真。",
        "",
        "5. 代码、CSS、prompt",
        "",
        "整段放在一个代码块里。",
        "不要把代码拆成很多气泡。",
        "",
        "代码前后可以用少量气泡说明怎么用。",
        "",
        "6. 输出风格",
        "",
        "自己判断怎么分段。",
        "不要机械地每句话空一行。",
        "不要频繁用大标题。",
        "少用列表，除非对方明确要求整理。",
        "",
        "整体感觉要像“对方发一句，你隔着手机自然回几颗小气泡”。",
        "",
        "核心规则：",
        "",
        "一段文字 = 一颗气泡。",
        "通过空行控制气泡数量。",
        "不需要加任何特殊符号。",
        "语气要灵活日常，像隔着手机聊天。"
    ].join("\n");

    var DEFAULTS = {
        lightBg: "https://i.postimg.cc/7Yn8Cxgw/IMG-9498.jpg",
        darkBg: "https://i.postimg.cc/HnFzS7DD/IMG-9493.jpg",
        charAvatar: "https://i.postimg.cc/yY9TTPnC/IMG-9514.jpg",
        userAvatar: "https://i.postimg.cc/tCPzz5kK/IMG-9515.jpg",
        charName: "char",
        userName: "user",
        fontStack: SYSTEM_FONT_STACK,
        nameFontStack: SYSTEM_FONT_STACK,
        fontUrl: "",
        mainFontWeight: "400",
        nameFontSize: "13px",
        avatarSize: "48px",
        avatarSpace: "56px",
        composerShift: "8px",
        composerPlaceholder: "",
        puzzleSvg: DEFAULT_PUZZLE_SVG,
        mobileRules: DEFAULT_MOBILE_RULES,
        bubbleCss: FULL_BUBBLE_CSS
    };

    var state = loadState();
    var drag = null;
    var staffObserver = null;
    var staffScanTimer = 0;
    var staffRescanTimer = 0;
    var staffRescanCount = 0;
    var staffVisibilityObserver = null;
    var pendingStaffRoots = [];
    var placeholderTimer = 0;
    var composerPlaceholderObserver = null;
    var composerPlaceholderObserveRoot = null;
    var composerPlaceholderMutationTimer = 0;

    bootButton();
    schedule(bootButton);
    schedule(injectMusicStaffCss);
    schedule(applyTheme);
    observeMode();
    observeStaffs();

    function schedule(fn) {
        document.addEventListener("DOMContentLoaded", fn);
        window.addEventListener("load", fn);
        setTimeout(fn, 80);
        setTimeout(fn, 400);
        setTimeout(fn, 1200);
        setTimeout(fn, 2600);
    }

    function bootButton() {
        if (!document.body) return;
        if (document.getElementById("chatgpt-theme-puzzle-v3")) return;

        injectButtonCss();

        var button = document.createElement("button");
        button.id = "chatgpt-theme-puzzle-v3";
        button.type = "button";
        button.setAttribute("aria-label", "Theme settings");
        button.innerHTML = buildPuzzleButtonHtml();
        button.style.cssText = [
            "position:fixed",
            "z-index:2147483647",
            "width:48px",
            "height:48px",
            "display:grid",
            "place-items:center",
            "background:transparent",
            "border:0",
            "padding:0",
            "margin:0",
            "color:var(--ctp-puzzle-color, rgba(44,44,48,.58))",
            "touch-action:none",
            "-webkit-tap-highlight-color:transparent",
            "overflow:visible"
        ].join(" !important;") + " !important;";

        document.body.appendChild(button);
        restoreButton(button);
        bindDrag(button);
    }

    function injectButtonCss() {
        if (document.getElementById("chatgpt-theme-puzzle-v3-button-css")) return;
        var target = document.head || document.documentElement;
        if (!target) return;

        var style = document.createElement("style");
        style.id = "chatgpt-theme-puzzle-v3-button-css";
        style.textContent = [
            "@keyframes ctp-puzzle-sway-v3{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}",
            "@keyframes ctp-puzzle-twinkle-v3{0%,100%{opacity:.4;transform:scale(.8)}50%{opacity:1;transform:scale(1.2)}}",
            "@keyframes ctp-puzzle-glow-v3{0%,100%{transform:translateX(-50%) scale(.92);opacity:.58}50%{transform:translateX(-50%) scale(1.08);opacity:.82}}",
            "#chatgpt-theme-puzzle-v3{--ctp-puzzle-color:rgba(44,44,48,.58)!important;will-change:transform!important}",
            "#chatgpt-theme-puzzle-v3 .ctp-puzzle-wrap{position:relative!important;width:38px!important;height:38px!important;display:block!important;color:currentColor!important;pointer-events:none!important;overflow:visible!important;z-index:1!important}",
            "#chatgpt-theme-puzzle-v3 .ctp-puzzle-main{position:absolute!important;left:0!important;top:0!important;width:38px!important;height:38px!important;display:block!important;fill:currentColor!important;color:currentColor!important;pointer-events:none!important;overflow:visible!important;animation:ctp-puzzle-sway-v3 3s ease-in-out infinite!important;transform-origin:center bottom!important}",
            "#chatgpt-theme-puzzle-v3 .ctp-puzzle-star{position:absolute!important;display:block!important;fill:currentColor!important;color:currentColor!important;pointer-events:none!important;z-index:2!important;animation:ctp-puzzle-twinkle-v3 3s ease-in-out infinite!important;transform-origin:center center!important}",
            "#chatgpt-theme-puzzle-v3 .ctp-puzzle-star-large{top:0!important;right:0!important;width:8px!important;height:8px!important;animation-delay:.5s!important}",
            "#chatgpt-theme-puzzle-v3 .ctp-puzzle-star-small{bottom:3px!important;left:0!important;width:7px!important;height:7px!important;animation-delay:1.5s!important}",
            "#chatgpt-theme-puzzle-v3::after{content:''!important;position:absolute!important;left:50%!important;bottom:5px!important;width:38px!important;height:13px!important;border-radius:999px!important;background:rgba(255,255,255,.88)!important;filter:blur(8px)!important;-webkit-filter:blur(8px)!important;opacity:.9!important;pointer-events:none!important;z-index:0!important;animation:ctp-puzzle-glow-v3 3.8s ease-in-out infinite!important}",
            "#chatgpt-theme-puzzle-v3.ctp-dragging .ctp-puzzle-main,#chatgpt-theme-puzzle-v3.ctp-dragging .ctp-puzzle-star{animation:none!important}",
            "#chatgpt-theme-puzzle-v3.ctp-dragging::after{animation:none!important;opacity:.45!important}",
            "html.dark #chatgpt-theme-puzzle-v3{--ctp-puzzle-color:rgba(255,255,255,.68)!important}",
            "html.dark #chatgpt-theme-puzzle-v3::after{background:rgba(210,210,220,.34)!important;opacity:.82!important}",
            "@media(prefers-color-scheme:dark){#chatgpt-theme-puzzle-v3{--ctp-puzzle-color:rgba(255,255,255,.68)!important}#chatgpt-theme-puzzle-v3::after{background:rgba(210,210,220,.34)!important;opacity:.82!important}}",
            "@media(prefers-reduced-motion:reduce){#chatgpt-theme-puzzle-v3 .ctp-puzzle-main,#chatgpt-theme-puzzle-v3 .ctp-puzzle-star,#chatgpt-theme-puzzle-v3::after{animation:none!important}}"
        ].join("\n");
        target.appendChild(style);
    }

    function injectMusicStaffCss() {
        if (document.getElementById("chatgpt-theme-panel-v3-staff-css")) return;
        var target = document.head || document.documentElement;
        if (!target) return;

        var style = document.createElement("style");
        style.id = "chatgpt-theme-panel-v3-staff-css";
        style.textContent = [
            "@keyframes ctp-staff-playing-v3{0%,100%{opacity:.72}50%{opacity:1}}",
            "@keyframes ctp-note-pulse-v3{0%,14%{transform:translate(-50%,-50%) scale(1.34);background:var(--ctp-note-active);box-shadow:var(--ctp-note-glow)}24%,100%{transform:translate(-50%,-50%) scale(1);background:var(--ctp-note-base);box-shadow:none}}",
            "main [data-message-author-role].ctp-has-music-staff,[data-message-author-role].ctp-has-music-staff{position:relative!important;overflow:visible!important}",
            ".ctp-music-staff{--ctp-note-base:rgba(86,86,94,.28);--ctp-note-active:radial-gradient(circle,rgba(86,86,94,.72) 0%,rgba(86,86,94,.48) 42%,rgba(86,86,94,.12) 72%,rgba(86,86,94,0) 100%);--ctp-note-glow:0 0 8px 3px rgba(86,86,94,.22);all:initial!important;position:absolute!important;top:10px!important;width:58px!important;height:26px!important;display:block!important;box-sizing:border-box!important;cursor:default!important;pointer-events:none!important;z-index:24!important;-webkit-tap-highlight-color:transparent!important;color:rgba(86,86,94,.82)!important;opacity:.82;animation:ctp-staff-playing-v3 2.4s ease-in-out infinite!important}",
            ".ctp-music-staff-assistant{left:calc(var(--avatar-size) + 46px)!important}",
            ".ctp-music-staff-user{right:calc(var(--avatar-size) + 46px)!important}",
            ".ctp-music-staff-line{position:absolute!important;left:0!important;right:0!important;height:1px!important;border-radius:99px!important;background:rgba(86,86,94,.34)!important;box-shadow:0 1px 5px rgba(86,86,94,.08)!important}",
            ".ctp-music-staff-line:nth-child(1){top:4px!important}",
            ".ctp-music-staff-line:nth-child(2){top:8px!important}",
            ".ctp-music-staff-line:nth-child(3){top:12px!important}",
            ".ctp-music-staff-line:nth-child(4){top:16px!important}",
            ".ctp-music-staff-line:nth-child(5){top:20px!important}",
            ".ctp-music-note{position:absolute!important;width:7px!important;height:7px!important;border-radius:50%!important;background:var(--ctp-note-base);box-shadow:none;transform:translate(-50%,-50%) scale(1);animation:ctp-note-pulse-v3 4.5s ease-in-out infinite!important;opacity:1!important}",
            ".ctp-music-staff:not(.ctp-staff-visible),.ctp-music-staff:not(.ctp-staff-visible) .ctp-music-note{animation:none!important}",
            ".ctp-note-do{left:8px!important;top:20px!important}",
            ".ctp-note-re{left:18px!important;top:16px!important;animation-delay:.9s!important}",
            ".ctp-note-mi{left:28px!important;top:12px!important;animation-delay:1.8s!important}",
            ".ctp-note-fa{left:38px!important;top:8px!important;animation-delay:2.7s!important}",
            ".ctp-note-sol{left:48px!important;top:4px!important;animation-delay:3.6s!important}",
            ".ctp-note-do{animation-delay:0s!important}",
            "html.dark .ctp-music-staff-line{background:rgba(255,255,255,.28)!important}",
            "html.dark .ctp-music-staff{--ctp-note-base:rgba(255,255,255,.26);--ctp-note-active:radial-gradient(circle,rgba(255,255,255,.86) 0%,rgba(255,255,255,.58) 42%,rgba(255,255,255,.16) 72%,rgba(255,255,255,0) 100%);--ctp-note-glow:0 0 8px 3px rgba(255,255,255,.26)}",
            "@media(prefers-color-scheme:dark){.ctp-music-staff-line{background:rgba(255,255,255,.28)!important}.ctp-music-staff{--ctp-note-base:rgba(255,255,255,.26);--ctp-note-active:radial-gradient(circle,rgba(255,255,255,.86) 0%,rgba(255,255,255,.58) 42%,rgba(255,255,255,.16) 72%,rgba(255,255,255,0) 100%);--ctp-note-glow:0 0 8px 3px rgba(255,255,255,.26)}}"
        ].join("\n");
        target.appendChild(style);
    }

    function scanMusicStaffs(root) {
        injectMusicStaffCss();
        if (!document.body) return;
        var scope = root && root.nodeType === 1 ? root : document;
        var turns = [];
        if (scope.nodeType === 1 && scope.matches && scope.matches('main [data-message-author-role="assistant"], main [data-message-author-role="user"]')) {
            turns.push(scope);
        }
        if (scope.querySelectorAll) {
            scope.querySelectorAll('main [data-message-author-role="assistant"], main [data-message-author-role="user"], [data-message-author-role="assistant"], [data-message-author-role="user"]').forEach(function (turn) {
                turns.push(turn);
            });
        }
        turns.forEach(addMusicStaff);
    }

    function addMusicStaff(turn) {
        if (!turn || !turn.getAttribute) return;
        var role = turn.getAttribute("data-message-author-role");
        if (role !== "assistant" && role !== "user") return;
        turn.classList.add("ctp-has-music-staff");
        var existing = directChildByClass(turn, "ctp-music-staff");
        if (existing) {
            observeStaffVisibility(existing);
            return;
        }
        var staff = document.createElement("span");
        staff.className = "ctp-music-staff ctp-music-staff-" + (role === "user" ? "user" : "assistant");
        staff.setAttribute("aria-label", "Music staff");
        staff.innerHTML = staffHtml();
        turn.insertBefore(staff, turn.firstChild);
        observeStaffVisibility(staff);
    }

    function staffHtml() {
        return [
            '<span class="ctp-music-staff-line"></span>',
            '<span class="ctp-music-staff-line"></span>',
            '<span class="ctp-music-staff-line"></span>',
            '<span class="ctp-music-staff-line"></span>',
            '<span class="ctp-music-staff-line"></span>',
            '<span class="ctp-music-note ctp-note-do"></span>',
            '<span class="ctp-music-note ctp-note-re"></span>',
            '<span class="ctp-music-note ctp-note-mi"></span>',
            '<span class="ctp-music-note ctp-note-fa"></span>',
            '<span class="ctp-music-note ctp-note-sol"></span>'
        ].join("");
    }

    function observeStaffs() {
        if (staffObserver) return;
        var start = function () {
            if (!document.body || staffObserver) return;
            staffObserver = new MutationObserver(function (mutations) {
                mutations.forEach(function (mutation) {
                    mutation.addedNodes.forEach(function (node) {
                        if (node && node.nodeType === 1) pendingStaffRoots.push(node);
                    });
                });
                clearTimeout(staffScanTimer);
                staffScanTimer = setTimeout(function () {
                    var roots = pendingStaffRoots.splice(0, pendingStaffRoots.length);
                    roots.forEach(function (root) { scanMusicStaffs(root); });
                }, 260);
                clearTimeout(placeholderTimer);
                placeholderTimer = setTimeout(applyComposerPlaceholder, 420);
            });
            staffObserver.observe(document.body, { childList: true, subtree: true });
            scanMusicStaffs();
            kickStaffRescan();
        };
        document.addEventListener("DOMContentLoaded", start);
        setTimeout(start, 120);
        setTimeout(start, 900);
    }

    function kickStaffRescan() {
        clearInterval(staffRescanTimer);
        staffRescanCount = 0;
        staffRescanTimer = setInterval(function () {
            staffRescanCount++;
            scanMusicStaffs();
            if (staffRescanCount >= 12) clearInterval(staffRescanTimer);
        }, 900);
    }

    function observeStaffVisibility(staff) {
        if (!staff) return;
        if (!("IntersectionObserver" in window)) {
            staff.classList.add("ctp-staff-visible");
            return;
        }
        if (!staffVisibilityObserver) {
            staffVisibilityObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    entry.target.classList.toggle("ctp-staff-visible", entry.isIntersecting);
                });
            }, { root: null, rootMargin: "180px 0px", threshold: 0 });
        }
        if (staff.getAttribute("data-ctp-visibility-observed") === "true") return;
        staff.setAttribute("data-ctp-visibility-observed", "true");
        staffVisibilityObserver.observe(staff);
    }

    function directChildByClass(parent, className) {
        if (!parent || !parent.children) return null;
        for (var i = 0; i < parent.children.length; i++) {
            if (parent.children[i].classList && parent.children[i].classList.contains(className)) return parent.children[i];
        }
        return null;
    }

    function togglePanel() {
        var panel = ensurePanel();
        panel.hidden = !panel.hidden;
        fillPanel();
    }

    function ensurePanel() {
        var existing = document.getElementById("chatgpt-theme-panel-v3");
        if (existing) return existing;

        injectPanelCss();

        var panel = document.createElement("div");
        panel.id = "chatgpt-theme-panel-v3";
        panel.hidden = true;
        panel.innerHTML = [
            '<div class="ctp-title"><span>ChatGPT 样式</span><button type="button" id="ctp-close">关闭</button></div>',
            '<div class="ctp-section">',
            '<label>白天背景 URL / 上传后自动填入</label><textarea id="ctp-light-bg"></textarea><input id="ctp-light-file" type="file" accept="image/*">',
            '<label>夜间背景 URL / 上传后自动填入</label><textarea id="ctp-dark-bg"></textarea><input id="ctp-dark-file" type="file" accept="image/*">',
            '</div>',
            '<div class="ctp-section">',
            '<div class="ctp-grid"><div><label>char 名字</label><input id="ctp-char-name" type="text"></div><div><label>user 名字</label><input id="ctp-user-name" type="text"></div></div>',
            '<label>char 头像 URL（png/jpg/gif/webp；PDF 不建议）/ 上传后自动填入</label><textarea id="ctp-char-avatar"></textarea><input id="ctp-char-file" type="file" accept="image/*">',
            '<label>user 头像 URL（png/jpg/gif/webp；PDF 不建议）/ 上传后自动填入</label><textarea id="ctp-user-avatar"></textarea><input id="ctp-user-file" type="file" accept="image/*">',
            '</div>',
            '<div class="ctp-section">',
            '<label>整体字体（除 char/user 名字外）</label><select id="ctp-font-stack"></select>',
            '<label>char/user 名字字体（两边名字一起改）</label><select id="ctp-name-font-stack"></select>',
            '<label>人名字体大小 <span id="ctp-name-font-size-value"></span></label><input id="ctp-name-font-size" type="range" min="10" max="32" step="1">',
            '<label>整体字体粗细 <span id="ctp-main-font-weight-value"></span></label><input id="ctp-main-font-weight" type="range" min="300" max="800" step="50">',
            '<label>字体文件 URL（woff/woff2/ttf/otf；选择“上传字体”时使用）/ 上传后自动填入</label><textarea id="ctp-font-url"></textarea><input id="ctp-font-file" type="file" accept=".woff,.woff2,.ttf,.otf,font/*">',
            '<div class="ctp-grid"><div><label>头像大小 px</label><input id="ctp-avatar-size" type="number" step="1"></div><div><label>头像上方空间 px</label><input id="ctp-avatar-space" type="number" step="1"></div></div>',
            '<label>输入框下移 px</label><input id="ctp-composer-shift" type="number" step="1">',
            '<label>输入框提示语（留空=不显示）</label><input id="ctp-composer-placeholder" type="text" placeholder="留空隐藏">',
            '</div>',
            '<div class="ctp-section">',
            '<label>完整气泡 CSS（一个格子写全部；可写图床 url、伪元素、白天/夜间 @media）</label><textarea id="ctp-bubble-css" spellcheck="false"></textarea>',
            '</div>',
            '<div class="ctp-section">',
            '<label>拼图 SVG 代码（贴整段 &lt;svg&gt;...&lt;/svg&gt;；留空恢复默认）</label><textarea id="ctp-puzzle-svg" spellcheck="false"></textarea>',
            '</div>',
            '<div class="ctp-section">',
            '<label>小手机对话规则（可改；开新窗前点复制）</label><textarea id="ctp-mobile-rules" spellcheck="false"></textarea>',
            '<div class="ctp-actions"><button type="button" id="ctp-copy-mobile-rules" data-primary="true">复制规则</button><button type="button" id="ctp-reset-mobile-rules">恢复默认规则</button></div>',
            '</div>',
            '<div class="ctp-actions"><button type="button" id="ctp-apply" data-primary="true">应用</button><button type="button" id="ctp-reset">恢复默认</button></div>'
        ].join("");

        document.body.appendChild(panel);
        bindPanel();
        return panel;
    }

    function injectPanelCss() {
        if (document.getElementById("chatgpt-theme-panel-v3-css")) return;
        var target = document.head || document.documentElement;
        if (!target) return;

        var style = document.createElement("style");
        style.id = "chatgpt-theme-panel-v3-css";
        style.textContent = [
            "#chatgpt-theme-panel-v3{all:initial!important;position:fixed!important;right:12px!important;bottom:82px!important;z-index:2147483646!important;width:min(350px,calc(100vw - 24px))!important;max-height:min(72dvh,620px)!important;overflow:auto!important;box-sizing:border-box!important;padding:14px!important;border-radius:16px!important;border:1px solid rgba(255,255,255,.36)!important;background:rgba(255,255,255,.76)!important;color:rgba(42,42,46,.92)!important;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',Arial,sans-serif!important;backdrop-filter:blur(22px) saturate(140%)!important;-webkit-backdrop-filter:blur(22px) saturate(140%)!important;box-shadow:0 12px 38px rgba(0,0,0,.14)!important}",
            "#chatgpt-theme-panel-v3[hidden]{display:none!important}",
            "#chatgpt-theme-panel-v3 *{box-sizing:border-box!important;font-family:inherit!important}",
            "#chatgpt-theme-panel-v3 .ctp-title{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;margin-bottom:10px!important;font-size:15px!important;font-weight:700!important}",
            "#chatgpt-theme-panel-v3 .ctp-section{padding:10px 0!important;border-top:1px solid rgba(120,120,130,.18)!important}",
            "#chatgpt-theme-panel-v3 label{display:block!important;margin:0 0 5px!important;font-size:12px!important;line-height:16px!important;color:rgba(42,42,46,.68)!important}",
            "#chatgpt-theme-panel-v3 input[type='text'],#chatgpt-theme-panel-v3 input[type='number'],#chatgpt-theme-panel-v3 textarea,#chatgpt-theme-panel-v3 select{width:100%!important;display:block!important;border:1px solid rgba(120,120,130,.24)!important;border-radius:10px!important;background:rgba(255,255,255,.58)!important;color:rgba(38,38,42,.92)!important;outline:none!important;padding:8px 9px!important;font-size:13px!important;line-height:18px!important;margin:0 0 8px!important}",
            "#chatgpt-theme-panel-v3 select{height:36px!important;-webkit-appearance:menulist!important;appearance:menulist!important}",
            "#chatgpt-theme-panel-v3 input[type='range']{width:100%!important;display:block!important;margin:0 0 10px!important;accent-color:rgba(120,120,128,.72)!important}",
            "#chatgpt-theme-panel-v3 textarea{min-height:58px!important;resize:vertical!important}",
            "#chatgpt-theme-panel-v3 #ctp-bubble-css{min-height:260px!important;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;font-size:12px!important;line-height:16px!important}",
            "#chatgpt-theme-panel-v3 #ctp-puzzle-svg{min-height:150px!important;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;font-size:12px!important;line-height:16px!important}",
            "#chatgpt-theme-panel-v3 #ctp-mobile-rules{min-height:230px!important;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace!important;font-size:12px!important;line-height:17px!important}",
            "#chatgpt-theme-panel-v3 input[type='file']{width:100%!important;font-size:12px!important;margin:0 0 10px!important}",
            "#chatgpt-theme-panel-v3 .ctp-grid{display:grid!important;grid-template-columns:1fr 1fr!important;gap:8px!important}",
            "#chatgpt-theme-panel-v3 .ctp-actions{display:flex!important;gap:8px!important;padding-top:10px!important}",
            "#chatgpt-theme-panel-v3 button{border:0!important;border-radius:10px!important;padding:9px 10px!important;font-size:13px!important;line-height:18px!important;color:rgba(38,38,42,.92)!important;background:rgba(255,255,255,.62)!important}",
            "#chatgpt-theme-panel-v3 button[data-primary='true']{background:rgba(255,255,255,.90)!important;font-weight:700!important}",
            "@media(prefers-color-scheme:dark){#chatgpt-theme-puzzle-v3{--ctp-puzzle-color:rgba(255,255,255,.68)!important}#chatgpt-theme-panel-v3{border-color:rgba(255,255,255,.14)!important;background:rgba(34,35,39,.78)!important;color:rgba(245,245,247,.92)!important;box-shadow:0 12px 38px rgba(0,0,0,.34)!important}#chatgpt-theme-panel-v3 .ctp-section{border-top-color:rgba(255,255,255,.12)!important}#chatgpt-theme-panel-v3 label{color:rgba(245,245,247,.66)!important}#chatgpt-theme-panel-v3 input[type='text'],#chatgpt-theme-panel-v3 input[type='number'],#chatgpt-theme-panel-v3 textarea,#chatgpt-theme-panel-v3 select{border-color:rgba(255,255,255,.14)!important;background:rgba(255,255,255,.08)!important;color:rgba(245,245,247,.92)!important}#chatgpt-theme-panel-v3 button{color:rgba(245,245,247,.92)!important;background:rgba(255,255,255,.10)!important}#chatgpt-theme-panel-v3 button[data-primary='true']{background:rgba(255,255,255,.16)!important}}"
        ].join("\n");
        target.appendChild(style);
    }

    function bindPanel() {
        byId("ctp-close").addEventListener("click", function () {
            byId("chatgpt-theme-panel-v3").hidden = true;
        });
        byId("ctp-apply").addEventListener("click", function () {
            readPanel();
            saveState();
            applyTheme();
        });
        byId("ctp-reset").addEventListener("click", function () {
            state = clone(DEFAULTS);
            try { localStorage.removeItem(STORE_KEY); } catch (error) {}
            fillPanel();
            applyTheme();
        });
        byId("ctp-copy-mobile-rules").addEventListener("click", function () {
            var text = rawVal("ctp-mobile-rules") || DEFAULTS.mobileRules;
            state.mobileRules = text;
            saveState();
            copyText(text, byId("ctp-copy-mobile-rules"));
        });
        byId("ctp-reset-mobile-rules").addEventListener("click", function () {
            state.mobileRules = DEFAULTS.mobileRules;
            setValue("ctp-mobile-rules", state.mobileRules);
            saveState();
        });

        bindUpload("ctp-light-file", "ctp-light-bg", "lightBg");
        bindUpload("ctp-dark-file", "ctp-dark-bg", "darkBg");
        bindUpload("ctp-char-file", "ctp-char-avatar", "charAvatar");
        bindUpload("ctp-user-file", "ctp-user-avatar", "userAvatar");
        bindUpload("ctp-font-file", "ctp-font-url", "fontUrl");
        bindRangeLabel("ctp-name-font-size", "ctp-name-font-size-value", "px");
        bindRangeLabel("ctp-main-font-weight", "ctp-main-font-weight-value", "");
        var placeholderInput = byId("ctp-composer-placeholder");
        if (placeholderInput) {
            placeholderInput.addEventListener("input", function () {
                state.composerPlaceholder = placeholderInput.value.trim();
                saveState();
                applyComposerPlaceholder();
                applyDynamicCss();
            });
        }
    }

    function fillPanel() {
        populateFontSelects();
        setValue("ctp-light-bg", state.lightBg);
        setValue("ctp-dark-bg", state.darkBg);
        setValue("ctp-char-avatar", state.charAvatar);
        setValue("ctp-user-avatar", state.userAvatar);
        setValue("ctp-char-name", state.charName);
        setValue("ctp-user-name", state.userName);
        setValue("ctp-font-stack", state.fontStack);
        setValue("ctp-name-font-stack", state.nameFontStack);
        setValue("ctp-font-url", state.fontUrl);
        setValue("ctp-name-font-size", numberOnly(state.nameFontSize));
        setValue("ctp-main-font-weight", state.mainFontWeight);
        setValue("ctp-avatar-size", numberOnly(state.avatarSize));
        setValue("ctp-avatar-space", numberOnly(state.avatarSpace));
        setValue("ctp-composer-shift", numberOnly(state.composerShift));
        setValue("ctp-composer-placeholder", state.composerPlaceholder);
        setValue("ctp-bubble-css", state.bubbleCss);
        setValue("ctp-puzzle-svg", state.puzzleSvg);
        setValue("ctp-mobile-rules", state.mobileRules || DEFAULTS.mobileRules);
        updateRangeLabels();
    }

    function readPanel() {
        state.lightBg = val("ctp-light-bg") || DEFAULTS.lightBg;
        state.darkBg = val("ctp-dark-bg") || DEFAULTS.darkBg;
        state.charAvatar = val("ctp-char-avatar") || DEFAULTS.charAvatar;
        state.userAvatar = val("ctp-user-avatar") || DEFAULTS.userAvatar;
        state.charName = val("ctp-char-name") || DEFAULTS.charName;
        state.userName = val("ctp-user-name") || DEFAULTS.userName;
        state.fontStack = val("ctp-font-stack") || DEFAULTS.fontStack;
        state.nameFontStack = val("ctp-name-font-stack") || DEFAULTS.nameFontStack;
        state.fontUrl = val("ctp-font-url");
        state.nameFontSize = (val("ctp-name-font-size") || "13") + "px";
        state.mainFontWeight = fontWeightValue(val("ctp-main-font-weight") || DEFAULTS.mainFontWeight);
        state.avatarSize = (val("ctp-avatar-size") || "48") + "px";
        state.avatarSpace = (val("ctp-avatar-space") || "56") + "px";
        state.composerShift = (val("ctp-composer-shift") || "8") + "px";
        state.composerPlaceholder = val("ctp-composer-placeholder");
        state.bubbleCss = val("ctp-bubble-css") || DEFAULTS.bubbleCss;
        state.puzzleSvg = val("ctp-puzzle-svg") || DEFAULTS.puzzleSvg;
        state.mobileRules = rawVal("ctp-mobile-rules") || DEFAULTS.mobileRules;
    }

    function applyTheme() {
        try {
            var root = document.documentElement;
            var dark = isDark();
            root.style.setProperty("--joey-bg", cssUrl(dark ? state.darkBg : state.lightBg));
            root.style.setProperty("--assistant-avatar", cssUrl(state.charAvatar));
            root.style.setProperty("--user-avatar", cssUrl(state.userAvatar));
            root.style.setProperty("--assistant-name", cssString(state.charName));
            root.style.setProperty("--user-name", cssString(state.userName));
            root.style.setProperty("--font-main", fontStack(state.fontStack));
            root.style.setProperty("--name-font", fontStack(state.nameFontStack));
            root.style.setProperty("--font-main-weight", fontWeightValue(state.mainFontWeight));
            root.style.setProperty("--name-font-size", cssLength(state.nameFontSize, DEFAULTS.nameFontSize));
            root.style.setProperty("--avatar-size", cssLength(state.avatarSize, DEFAULTS.avatarSize));
            root.style.setProperty("--avatar-space", cssLength(state.avatarSpace, DEFAULTS.avatarSpace));
            root.style.setProperty("--composer-shift", cssLength(state.composerShift, DEFAULTS.composerShift));
            applyFont();
            applyBubbleCss();
            applyPuzzleSvg();
            applyDynamicCss();
            applyComposerPlaceholder();
        } catch (error) {
            window.__chatgptThemePanelV3ApplyError = String(error);
        }
    }

    function applyBubbleCss() {
        var target = document.head || document.documentElement;
        if (!target) return;
        var style = document.getElementById("chatgpt-theme-panel-v3-bubble-css");
        if (!style) {
            style = document.createElement("style");
            style.id = "chatgpt-theme-panel-v3-bubble-css";
            target.appendChild(style);
        }
        style.textContent = state.bubbleCss || DEFAULTS.bubbleCss;
    }

    function applyFont() {
        var target = document.head || document.documentElement;
        if (!target) return;
        var style = document.getElementById("chatgpt-theme-panel-v3-font-css");
        if (!style) {
            style = document.createElement("style");
            style.id = "chatgpt-theme-panel-v3-font-css";
            target.appendChild(style);
        }
        style.textContent = state.fontUrl ? '@font-face{font-family:"ChatGPTThemePanelFont";src:' + cssUrl(state.fontUrl) + ';font-display:swap;}' : "";
    }

    function applyDynamicCss() {
        var target = document.head || document.documentElement;
        if (!target) return;
        var style = document.getElementById("chatgpt-theme-panel-v3-dynamic-css");
        if (!style) {
            style = document.createElement("style");
            style.id = "chatgpt-theme-panel-v3-dynamic-css";
            target.appendChild(style);
        }

        var mainFont = safeCssValue(fontStack(state.fontStack), DEFAULTS.fontStack);
        var nameFont = safeCssValue(fontStack(state.nameFontStack), DEFAULTS.nameFontStack);
        var mainWeight = fontWeightValue(state.mainFontWeight);
        var nameSize = cssLength(state.nameFontSize, DEFAULTS.nameFontSize);

        style.textContent = [
            "html,body,body input,body textarea,body [contenteditable='true'],main#main,main#main *,main #thread-bottom-container form,main #thread-bottom-container form *,main [data-message-author-role='assistant'],main [data-message-author-role='assistant'] *,main [data-message-author-role='user'],main [data-message-author-role='user'] *{font-family:" + mainFont + "!important}",
            "main [data-message-author-role='assistant'] .markdown,main [data-message-author-role='assistant'] .markdown *,main [data-message-author-role='user'] .user-message-bubble-color,main [data-message-author-role='user'] .user-message-bubble-color *,main #thread-bottom-container form [contenteditable='true'],main #thread-bottom-container form textarea,main #thread-bottom-container form [role='textbox']{font-weight:" + mainWeight + "!important}",
            "main [data-message-author-role='assistant']::after,main [data-message-author-role='user']::after{font-family:" + nameFont + "!important;font-size:" + nameSize + "!important}",
            composerPlaceholderCss()
        ].filter(Boolean).join("\n");
    }

    function applyComposerPlaceholder() {
        var text = String(state.composerPlaceholder || "").trim();
        observeComposerPlaceholder(document.getElementById("thread-bottom-container"));
        var nodes = document.querySelectorAll([
            "main #thread-bottom-container form [data-placeholder]",
            "main #thread-bottom-container form [placeholder]",
            "main #thread-bottom-container form [aria-placeholder]",
            "main #thread-bottom-container [data-placeholder]",
            "main #thread-bottom-container [placeholder]",
            "main #thread-bottom-container [aria-placeholder]",
            "main #thread-bottom-container #prompt-textarea",
            "main #thread-bottom-container #prompt-textarea [data-placeholder]",
            "main #thread-bottom-container [contenteditable='true']",
            "#thread-bottom-container form [data-placeholder]",
            "#thread-bottom-container form [placeholder]",
            "#thread-bottom-container form [aria-placeholder]",
            "#thread-bottom-container [data-placeholder]",
            "#thread-bottom-container [placeholder]",
            "#thread-bottom-container [aria-placeholder]",
            "#thread-bottom-container #prompt-textarea",
            "#thread-bottom-container #prompt-textarea [data-placeholder]",
            "#thread-bottom-container [contenteditable='true']"
        ].join(","));

        nodes.forEach(function (node) {
            if (text) {
                if (!node.hasAttribute("data-ctp-original-data-placeholder") && node.hasAttribute("data-placeholder")) {
                    node.setAttribute("data-ctp-original-data-placeholder", node.getAttribute("data-placeholder") || "");
                }
                if (!node.hasAttribute("data-ctp-original-placeholder") && node.hasAttribute("placeholder")) {
                    node.setAttribute("data-ctp-original-placeholder", node.getAttribute("placeholder") || "");
                }
                if (!node.hasAttribute("data-ctp-original-aria-placeholder") && node.hasAttribute("aria-placeholder")) {
                    node.setAttribute("data-ctp-original-aria-placeholder", node.getAttribute("aria-placeholder") || "");
                }
                if (node.id === "prompt-textarea" && !node.hasAttribute("data-placeholder")) {
                    node.setAttribute("data-ctp-added-data-placeholder", "true");
                    setAttributeIfChanged(node, "data-placeholder", text);
                }
                if (node.id === "prompt-textarea" && !node.hasAttribute("aria-placeholder")) {
                    node.setAttribute("data-ctp-added-aria-placeholder", "true");
                    setAttributeIfChanged(node, "aria-placeholder", text);
                }
                if (node.hasAttribute("data-placeholder")) setAttributeIfChanged(node, "data-placeholder", text);
                if (node.hasAttribute("placeholder")) setAttributeIfChanged(node, "placeholder", text);
                if (node.hasAttribute("aria-placeholder")) setAttributeIfChanged(node, "aria-placeholder", text);
                return;
            }

            if (!node.hasAttribute("data-ctp-original-data-placeholder") && node.hasAttribute("data-placeholder")) {
                node.setAttribute("data-ctp-original-data-placeholder", node.getAttribute("data-placeholder") || "");
            }
            if (!node.hasAttribute("data-ctp-original-placeholder") && node.hasAttribute("placeholder")) {
                node.setAttribute("data-ctp-original-placeholder", node.getAttribute("placeholder") || "");
            }
            if (!node.hasAttribute("data-ctp-original-aria-placeholder") && node.hasAttribute("aria-placeholder")) {
                node.setAttribute("data-ctp-original-aria-placeholder", node.getAttribute("aria-placeholder") || "");
            }
            if (node.id === "prompt-textarea" && !node.hasAttribute("data-placeholder")) {
                node.setAttribute("data-ctp-added-data-placeholder", "true");
                setAttributeIfChanged(node, "data-placeholder", "");
            }
            if (node.id === "prompt-textarea" && !node.hasAttribute("aria-placeholder")) {
                node.setAttribute("data-ctp-added-aria-placeholder", "true");
                setAttributeIfChanged(node, "aria-placeholder", "");
            }
            if (node.hasAttribute("data-placeholder")) setAttributeIfChanged(node, "data-placeholder", "");
            if (node.hasAttribute("placeholder")) setAttributeIfChanged(node, "placeholder", "");
            if (node.hasAttribute("aria-placeholder")) setAttributeIfChanged(node, "aria-placeholder", "");
        });
        syncVisibleComposerPlaceholder(text);
    }

    function composerPlaceholderCss() {
        var text = String(state.composerPlaceholder || "").trim();
        var value = text ? cssString(text) : '""';
        var color = text ? "var(--composer-placeholder)" : "transparent";
        var rules = [
            "main #thread-bottom-container [data-placeholder]:empty::before,",
            "main #thread-bottom-container [aria-placeholder]:empty::before,",
            "main #thread-bottom-container #prompt-textarea:empty::before,",
            "main #thread-bottom-container #prompt-textarea .is-empty::before,",
            "main #thread-bottom-container #prompt-textarea p[data-placeholder]:empty::before,",
            "main #thread-bottom-container #prompt-textarea p[data-placeholder]:has(br:only-child)::before,",
            "#thread-bottom-container [data-placeholder]:empty::before,",
            "#thread-bottom-container [aria-placeholder]:empty::before,",
            "#thread-bottom-container #prompt-textarea:empty::before,",
            "#thread-bottom-container #prompt-textarea .is-empty::before,",
            "#thread-bottom-container #prompt-textarea p[data-placeholder]:empty::before,",
            "#thread-bottom-container #prompt-textarea p[data-placeholder]:has(br:only-child)::before{content:" + value + "!important;color:" + color + "!important;-webkit-text-fill-color:" + color + "!important;pointer-events:none!important;text-shadow:none!important}"
        ];
        if (!text) {
            rules.push([
                "main #thread-bottom-container [data-placeholder*='有问题']::before,",
                "main #thread-bottom-container [aria-placeholder*='有问题']::before,",
                "main #thread-bottom-container [placeholder*='有问题']::placeholder,",
                "main #thread-bottom-container [data-placeholder*='Ask']::before,",
                "main #thread-bottom-container [aria-placeholder*='Ask']::before,",
                "main #thread-bottom-container [placeholder*='Ask']::placeholder,",
                "main #thread-bottom-container [data-placeholder*='Message ChatGPT']::before,",
                "main #thread-bottom-container [aria-placeholder*='Message ChatGPT']::before,",
                "main #thread-bottom-container [placeholder*='Message ChatGPT']::placeholder,",
                "#thread-bottom-container [data-placeholder*='有问题']::before,",
                "#thread-bottom-container [aria-placeholder*='有问题']::before,",
                "#thread-bottom-container [placeholder*='有问题']::placeholder,",
                "#thread-bottom-container [data-placeholder*='Ask']::before,",
                "#thread-bottom-container [aria-placeholder*='Ask']::before,",
                "#thread-bottom-container [placeholder*='Ask']::placeholder,",
                "#thread-bottom-container [data-placeholder*='Message ChatGPT']::before,",
                "#thread-bottom-container [aria-placeholder*='Message ChatGPT']::before,",
                "#thread-bottom-container [placeholder*='Message ChatGPT']::placeholder{content:''!important;color:transparent!important;-webkit-text-fill-color:transparent!important;opacity:0!important;text-shadow:none!important}"
            ].join("\n"));
            rules.push("main #thread-bottom-container form ::placeholder,#thread-bottom-container form ::placeholder{color:transparent!important;-webkit-text-fill-color:transparent!important;opacity:0!important;text-shadow:none!important}");
        }
        return rules.join("\n");
    }

    function syncVisibleComposerPlaceholder(text) {
        var root = document.getElementById("thread-bottom-container");
        if (!root) return;
        var current = String(text || "").trim();
        var touched = root.querySelectorAll("[data-ctp-original-visible-placeholder]");
        touched.forEach(function (el) {
            setVisiblePlaceholderText(el, replaceDefaultComposerPlaceholder(el.getAttribute("data-ctp-original-visible-placeholder") || "", current));
        });
        if (typeof document.createTreeWalker !== "function") return;

        var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                var value = normalizePlaceholderText(node.nodeValue);
                if (!hasDefaultComposerPlaceholder(value)) return NodeFilter.FILTER_REJECT;
                var parent = node.parentElement;
                if (!parent || parent.closest("#chatgpt-theme-panel-v3,button,[role='button'],input,textarea")) return NodeFilter.FILTER_REJECT;
                return NodeFilter.FILTER_ACCEPT;
            }
        });
        var pending = [];
        var node;
        while ((node = walker.nextNode())) pending.push(node);
        pending.forEach(function (textNode) {
            var parent = textNode.parentElement;
            if (!parent) return;
            if (!parent.hasAttribute("data-ctp-original-visible-placeholder")) {
                parent.setAttribute("data-ctp-original-visible-placeholder", normalizePlaceholderText(textNode.nodeValue));
            }
            textNode.nodeValue = replaceDefaultComposerPlaceholder(textNode.nodeValue, current);
        });
    }

    function setVisiblePlaceholderText(el, text) {
        if (!el) return;
        if (el.childNodes.length === 1 && el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
            el.firstChild.nodeValue = text;
            return;
        }
        el.textContent = text;
    }

    function normalizePlaceholderText(value) {
        return String(value || "").replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim();
    }

    function hasDefaultComposerPlaceholder(value) {
        var text = normalizePlaceholderText(value);
        var compact = text.replace(/\s+/g, "");
        return /有问题[，,]尽[管量]问/.test(compact) ||
            /(^|\s)(Ask anything|Message ChatGPT|Ask ChatGPT)(\s|$)/.test(text) ||
            text.indexOf("向 ChatGPT 发送消息") !== -1;
    }

    function replaceDefaultComposerPlaceholder(value, replacement) {
        var next = String(value || "");
        var text = String(replacement || "").trim();
        next = next.replace(/有\s*问\s*题\s*[，,]\s*尽\s*[管量]\s*问/g, text);
        next = next.replace(/Ask anything|Message ChatGPT|Ask ChatGPT|向 ChatGPT 发送消息/g, text);
        return normalizePlaceholderText(next);
    }

    function setAttributeIfChanged(node, name, value) {
        var next = String(value || "");
        if (node.getAttribute(name) !== next) node.setAttribute(name, next);
    }

    function observeComposerPlaceholder(root) {
        if (!root || composerPlaceholderObserveRoot === root) return;
        if (composerPlaceholderObserver) composerPlaceholderObserver.disconnect();
        composerPlaceholderObserveRoot = root;
        composerPlaceholderObserver = new MutationObserver(function () {
            clearTimeout(composerPlaceholderMutationTimer);
            composerPlaceholderMutationTimer = setTimeout(function () {
                applyComposerPlaceholder();
            }, 120);
        });
        composerPlaceholderObserver.observe(root, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["data-placeholder", "placeholder", "aria-placeholder"]
        });
    }

    function bindRangeLabel(inputId, labelId, suffix) {
        var input = byId(inputId);
        if (!input) return;
        input.addEventListener("input", function () {
            setRangeLabel(inputId, labelId, suffix);
        });
    }

    function updateRangeLabels() {
        setRangeLabel("ctp-name-font-size", "ctp-name-font-size-value", "px");
        setRangeLabel("ctp-main-font-weight", "ctp-main-font-weight-value", "");
    }

    function setRangeLabel(inputId, labelId, suffix) {
        var input = byId(inputId);
        var label = byId(labelId);
        if (!input || !label) return;
        label.textContent = input.value + (suffix || "");
    }

    function populateFontSelects() {
        populateFontSelect("ctp-font-stack", state.fontStack || DEFAULTS.fontStack);
        populateFontSelect("ctp-name-font-stack", state.nameFontStack || DEFAULTS.nameFontStack);
    }

    function populateFontSelect(id, selectedValue) {
        var node = byId(id);
        if (!node) return;
        var current = String(selectedValue || DEFAULTS.fontStack);
        var exists = FONT_PRESETS.some(function (font) { return font.value === current; });
        node.innerHTML = "";
        FONT_PRESETS.forEach(function (font) {
            var option = document.createElement("option");
            option.value = font.value;
            option.textContent = font.label;
            option.style.fontFamily = font.value;
            node.appendChild(option);
        });
        if (!exists && current) {
            var custom = document.createElement("option");
            custom.value = current;
            custom.textContent = "当前自定义字体栈";
            custom.style.fontFamily = current;
            node.appendChild(custom);
        }
        node.value = current;
    }

    function applyPuzzleSvg() {
        var button = document.getElementById("chatgpt-theme-puzzle-v3");
        if (button) button.innerHTML = buildPuzzleButtonHtml();
    }

    function buildPuzzleButtonHtml() {
        return '<span class="ctp-puzzle-wrap">' + normalizePuzzleSvg(state.puzzleSvg) + STAR_LARGE_SVG + STAR_SMALL_SVG + '</span>';
    }

    function normalizePuzzleSvg(svg) {
        var raw = String(svg || "").trim();
        if (!raw) return decoratePuzzleSvg(DEFAULT_PUZZLE_SVG);

        if (/<script[\s>]/i.test(raw)) return decoratePuzzleSvg(DEFAULT_PUZZLE_SVG);
        raw = raw.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "");

        if (/<svg[\s>]/i.test(raw)) return decoratePuzzleSvg(raw);
        if (/<(g|path|circle|polygon|rect)[\s>]/i.test(raw)) {
            return decoratePuzzleSvg('<svg viewBox="0 0 20000 20000" aria-hidden="true">' + raw + '</svg>');
        }
        return decoratePuzzleSvg(DEFAULT_PUZZLE_SVG);
    }

    function decoratePuzzleSvg(svg) {
        var cleaned = String(svg || DEFAULT_PUZZLE_SVG);
        if (/\sclass\s*=\s*(['"])(.*?)\1/i.test(cleaned)) {
            cleaned = cleaned.replace(/\sclass\s*=\s*(['"])(.*?)\1/i, function (match, quote, classes) {
                return " class=" + quote + (/\bctp-puzzle-main\b/.test(classes) ? classes : classes + " ctp-puzzle-main") + quote;
            });
        } else {
            cleaned = cleaned.replace(/<svg\b/i, '<svg class="ctp-puzzle-main"');
        }
        if (!/\saria-hidden\s*=/i.test(cleaned)) {
            cleaned = cleaned.replace(/<svg\b/i, '<svg aria-hidden="true"');
        }
        return cleaned;
    }

    function bindDrag(button) {
        drag = { active: false, moved: false, x: 0, y: 0, left: 0, top: 0 };

        button.addEventListener("touchstart", function (event) {
            if (!event.touches || event.touches.length !== 1) return;
            startDrag(button, event.touches[0].clientX, event.touches[0].clientY, event);
        }, { passive: false });

        document.addEventListener("touchmove", function (event) {
            if (!drag.active || !event.touches || event.touches.length !== 1) return;
            moveDrag(button, event.touches[0].clientX, event.touches[0].clientY, event);
        }, { passive: false });

        document.addEventListener("touchend", function (event) {
            finishDrag(button, event, true);
        }, { passive: false });

        button.addEventListener("mousedown", function (event) {
            startDrag(button, event.clientX, event.clientY, event);
        });

        document.addEventListener("mousemove", function (event) {
            moveDrag(button, event.clientX, event.clientY, event);
        });

        document.addEventListener("mouseup", function (event) {
            finishDrag(button, event, true);
        });
    }

    function startDrag(button, x, y, event) {
        var rect = button.getBoundingClientRect();
        drag.active = true;
        drag.moved = false;
        drag.x = x;
        drag.y = y;
        drag.left = rect.left;
        drag.top = rect.top;
        button.classList.add("ctp-dragging");
        if (event && event.preventDefault) event.preventDefault();
    }

    function moveDrag(button, x, y, event) {
        if (!drag.active) return;
        var dx = x - drag.x;
        var dy = y - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 5) drag.moved = true;
        var left = clamp(drag.left + dx, 8, window.innerWidth - 56);
        var top = clamp(drag.top + dy, 52, window.innerHeight - 60);
        button.style.left = left + "px";
        button.style.top = top + "px";
        button.style.right = "auto";
        button.style.bottom = "auto";
        if (event && event.preventDefault) event.preventDefault();
    }

    function finishDrag(button, event, openOnTap) {
        if (!drag.active) return;
        var shouldOpen = openOnTap && !drag.moved;
        drag.active = false;
        button.classList.remove("ctp-dragging");
        try {
            localStorage.setItem(POS_KEY, JSON.stringify({
                left: parseFloat(button.style.left || "0"),
                top: parseFloat(button.style.top || "0")
            }));
        } catch (error) {}
        if (shouldOpen) togglePanel();
        setTimeout(function () {
            if (drag) drag.moved = false;
        }, 80);
        if (event && event.preventDefault) event.preventDefault();
    }

    function restoreButton(button) {
        var pos = null;
        try { pos = JSON.parse(localStorage.getItem(POS_KEY) || "null"); } catch (error) {}
        var left = pos && isFinite(pos.left) ? pos.left : Math.max(12, window.innerWidth - 66);
        var top = pos && isFinite(pos.top) ? pos.top : Math.max(80, window.innerHeight - 220);
        button.style.left = clamp(left, 8, window.innerWidth - 56) + "px";
        button.style.top = clamp(top, 52, window.innerHeight - 60) + "px";
    }

    function bindUpload(fileId, textId, key) {
        byId(fileId).addEventListener("change", function () {
            var input = byId(fileId);
            var file = input.files && input.files[0];
            if (!file) return;
            if (file.size > 2.2 * 1024 * 1024) {
                alert("这个文件有点大，Safari 可能存不住。建议压缩后再传，或者用图床/文件 URL。");
                input.value = "";
                return;
            }
            var reader = new FileReader();
            reader.onload = function () {
                var data = String(reader.result || "");
                byId(textId).value = data;
                state[key] = data;
                saveState();
                applyTheme();
            };
            reader.readAsDataURL(file);
        });
    }

    function loadState() {
        try {
            var loaded = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
            var merged = Object.assign(clone(DEFAULTS), loaded);
            if (!loaded.nameFontStack) merged.nameFontStack = merged.fontStack || DEFAULTS.nameFontStack;
            var savedPuzzle = String(loaded.puzzleSvg || "").trim();
            if (!savedPuzzle || savedPuzzle === OLD_DEFAULT_PUZZLE_SVG || savedPuzzle.indexOf("M10.1 2.75c1.26") !== -1) {
                merged.puzzleSvg = DEFAULTS.puzzleSvg;
            }
            return merged;
        } catch (error) {
            return clone(DEFAULTS);
        }
    }

    function saveState() {
        try {
            localStorage.setItem(STORE_KEY, JSON.stringify(state));
            return true;
        } catch (error) {
            alert("保存失败，可能是图片或字体文件太大。可以换小文件，或者用图床/文件 URL。");
            return false;
        }
    }

    function observeMode() {
        try {
            new MutationObserver(applyTheme).observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
            var media = window.matchMedia("(prefers-color-scheme: dark)");
            if (media.addEventListener) media.addEventListener("change", applyTheme);
            else if (media.addListener) media.addListener(applyTheme);
        } catch (error) {}
    }

    function isDark() {
        return document.documentElement.classList.contains("dark") || window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function fontStack(value) {
        return String(value || DEFAULTS.fontStack);
    }

    function safeCssValue(value, fallback) {
        var raw = String(value || "").trim();
        if (!raw) return fallback || "";
        if (raw.length > 180 || /[;{}<>]/.test(raw)) return fallback || "";
        return raw;
    }

    function cssUrl(value) {
        var raw = String(value || "").trim();
        if (!raw) return "none";
        return 'url("' + raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "") + '")';
    }

    function cssString(value) {
        return JSON.stringify(String(value || ""));
    }

    function cssLength(value, fallback) {
        var raw = String(value || "").trim();
        if (/^-?\d+(\.\d+)?$/.test(raw)) return raw + "px";
        if (/^-?\d+(\.\d+)?(px|rem|em|vh|vw|%)$/.test(raw)) return raw;
        return fallback;
    }

    function fontWeightValue(value) {
        var raw = parseInt(String(value || DEFAULTS.mainFontWeight).replace(/[^\d]/g, ""), 10);
        if (!isFinite(raw)) raw = parseInt(DEFAULTS.mainFontWeight, 10);
        raw = Math.round(raw / 50) * 50;
        return String(clamp(raw, 100, 900));
    }

    function numberOnly(value) {
        return String(value || "").replace("px", "").trim();
    }

    function indentCss(css, prefix) {
        return String(css || "").split("\n").map(function (line) {
            return prefix + line;
        }).join("\n");
    }

    function byId(id) {
        return document.getElementById(id);
    }

    function val(id) {
        var node = byId(id);
        return node ? node.value.trim() : "";
    }

    function rawVal(id) {
        var node = byId(id);
        return node ? String(node.value || "") : "";
    }

    function setValue(id, value) {
        var node = byId(id);
        if (node) node.value = value || "";
    }

    function copyText(text, button) {
        var done = function (ok) {
            if (!button) return;
            var old = button.textContent;
            button.textContent = ok ? "已复制" : "复制失败";
            setTimeout(function () { button.textContent = old; }, 1300);
        };
        var value = String(text || "");
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value).then(function () {
                done(true);
            }).catch(function () {
                done(fallbackCopyText(value));
            });
            return;
        }
        done(fallbackCopyText(value));
    }

    function fallbackCopyText(text) {
        var box = document.createElement("textarea");
        box.value = String(text || "");
        box.setAttribute("readonly", "readonly");
        box.style.position = "fixed";
        box.style.left = "-9999px";
        box.style.top = "0";
        document.body.appendChild(box);
        box.focus();
        box.select();
        var ok = false;
        try { ok = document.execCommand("copy"); } catch (error) {}
        document.body.removeChild(box);
        return ok;
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function clamp(value, min, max) {
        return Math.min(max, Math.max(min, value));
    }
})();
