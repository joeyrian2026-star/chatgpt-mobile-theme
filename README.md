# ChatGPT Mobile Theme

一个用于 **iPhone Safari + Userscripts** 的 ChatGPT 网页自定义主题方案。

它可以给 ChatGPT 网页添加：

- 自定义背景
- 自定义 assistant / user 头像
- 自定义名字
- 玻璃拟态聊天气泡
- 移动端小手机聊天观感
- 可选主题面板，用于在网页里调整部分样式

> 说明：本项目作用于 Safari 里的 ChatGPT 网页，不是 ChatGPT App 内置主题，也不是官方功能。

---

## Preview

本项目主要适用于：

```text
iPhone Safari
Userscripts
chatgpt.com
chat.openai.com
```

添加到主屏幕后的 PWA / 网页 App 模式通常不会加载 Safari 扩展，所以更推荐直接使用 Safari 打开 ChatGPT 网页。

---

## Files

```text
.
├── README.md
├── LICENSE
├── chatgpt-bg.user.css
├── chatgpt-panel-v3.user.js
└── docs
    └── small-phone-dialogue-rules.md
```

### `chatgpt-bg.user.css`

主样式文件。

负责：

- 背景图
- 头像
- 名字
- 气泡样式
- 底部输入框透明化
- 部分页面遮罩透明化

### `chatgpt-panel-v3.user.js`

可选增强脚本。

负责：

- 可拖动主题按钮
- 主题设置面板
- 背景 / 头像 / 名字 / 字体设置
- 气泡 CSS 编辑入口

移动端如出现卡顿，可以先只启用 CSS 文件，JS 面板作为可选增强。

### `docs/small-phone-dialogue-rules.md`

可选文档。

用于说明如何让 ChatGPT 的回复更适配气泡显示，让输出更像短信 / 微信聊天，而不是长篇说明文。

---

# Installation Guide

## 1. 准备 App

先在 App Store 安装两个 App：

### Userscripts

用于给 Safari 网页注入 CSS / JS。

### Koder

用于编辑 `.user.css` 和 `.user.js` 文件。

iPhone 自带文件 App 通常只能预览，编辑代码不舒服，所以用 Koder 更稳。

---

## 2. 打开 Safari 扩展权限

打开 iPhone 设置：

```text
设置 → Apps → Safari → 扩展 → Userscripts
```

进入后，把 Userscripts 打开。

权限可以先设置成：

```text
其他网站 → 允许
```

这样后面打开 `chatgpt.com` 的时候，Userscripts 才能生效。

---

## 3. 初始化 Userscripts 文件夹

打开 Userscripts App。

第一次打开时，它会要求选择一个脚本目录。

可以直接使用默认的：

```text
Userscripts App Documents
```

如果页面显示：

```text
CURRENT DIRECTORY: Userscripts App Documents
```

说明初始化成功。

---

## 4. 进入 Userscripts 文件夹

打开 iPhone 自带的 文件 App。

路径一般是：

```text
我的 iPhone → Userscripts
```

进去以后，你会看到类似：

```text
Demo_user_script.user.js
```

这是 Userscripts 自动生成的示例文件。

---

## 5. 创建 CSS 文件

iPhone 文件 App 通常没有“新建文件”，只有“新建文件夹”。

最稳的做法是复制示例文件：

1. 长按 `Demo_user_script.user.js`
2. 选择 `复制`
3. 在空白处长按
4. 选择 `粘贴`

然后会出现一个副本。

长按副本，选择 `重新命名`，改成：

```text
chatgpt-bg.user.css
```

注意后缀必须完整是：

```text
.user.css
```

如果文件 App 显示时把名字拆成 `chatgpt-bg.user`，但详情里类型显示 CSS，并且完整文件名是 `chatgpt-bg.user.css`，那就是成功的。

---

## 6. 用 Koder 编辑 CSS

长按：

```text
chatgpt-bg.user.css
```

选择：

```text
共享 → 用 Koder 打开
```

在 Koder 里打开后，把原来的内容全删掉，粘贴本项目里的 `chatgpt-bg.user.css` 内容。

Koder 一般会自动保存，右上角点 `×` 退出即可。

没有明显保存按钮是正常的。

---

## 7. CSS 文件头

`.user.css` 文件最上面需要有 UserStyle 文件头，让 Userscripts 知道它作用在哪些网站：

```css
/* ==UserStyle==
@name ChatGPT Joey Mobile Theme CSS Stable
@match https://chatgpt.com/*
@match https://chat.openai.com/*
==/UserStyle== */
```

后面的 CSS 才会注入到 ChatGPT 网页里。

---

## 8. 打开 ChatGPT 网页并授权

用 Safari 打开 ChatGPT 网页：

```text
https://chatgpt.com/
```

点地址栏旁边的扩展按钮 / 拼图按钮 / aA 菜单。

找到 Userscripts。

确认它对当前网站是允许状态。

如果弹权限，选择：

```text
允许此网站
```

或者：

```text
始终允许
```

然后刷新页面。

---

## 9. 为什么添加到主屏幕后没效果

Safari 里能生效。

但是把 ChatGPT “添加到主屏幕”以后，它会变成 iOS 的 PWA / 网页 App 模式。

这个模式通常不会加载 Safari 扩展，所以 Userscripts 注入的 CSS / JS 就没了。

所以如果想保留背景和气泡效果，最稳是：

```text
直接用 Safari 打开 chatgpt.com
```

也可以做一个快捷指令图标：

```text
快捷指令 → 新建快捷指令 → 打开 URL → https://chatgpt.com/ → 添加到主屏幕
```

这个图标点开后会进入真正的 Safari 页面，Userscripts 还能生效。

---

## 10. Safari 工具栏能不能默认隐藏

不能靠 CSS 默认隐藏。

Safari 工具栏是浏览器外壳，不属于网页内容，Userscripts 控不了。

只能手动：

```text
底部菜单 → 隐藏工具栏
```

---

# Recommended Usage

## 稳定思路

先不要乱改 ChatGPT 的底部输入框结构。

最稳的是：

1. 注入背景
2. 隐藏底部提示文字
3. 给 assistant 回复加气泡
4. 再根据实际 DOM 微调用 user 气泡和底部白块

不要一开始就用太粗暴的选择器，比如：

```css
main [class*="bottom"]
div:has(form)
div:has(textarea)
```

这些选择器很容易误伤输入框、侧边栏，甚至把输入框直接弄没。

---

## 气泡识别原理

气泡不是靠特殊符号识别。

ChatGPT 网页会把回复渲染成 HTML。

assistant 的普通段落通常是：

```css
[data-message-author-role="assistant"] .markdown > p
```

所以 CSS 可以把每一个 `<p>` 段落变成一颗气泡。

也就是说：

```text
空行分段 = 新气泡
同一段里的多句话 = 同一颗气泡
```

代码块是 `<pre>`，最好不要强行气泡化，否则排版容易炸。

列表 `<ul>` / `<ol>` 可以作为一颗列表气泡处理。

---

## 测试流程

每次改完 CSS 后：

1. 退出 Koder
2. 回到 Safari
3. 关掉当前 ChatGPT 标签页
4. 重新打开 `chatgpt.com`

不要只刷新。

Safari 有时候会缓存旧 CSS，关标签重开更稳。

---

# Troubleshooting

## 背景没出现

检查：

```text
文件名是不是 chatgpt-bg.user.css
Userscripts 扩展是不是开启
@match https://chatgpt.com/* 有没有写
Safari 当前网站有没有允许 Userscripts
```

## Safari 有效果，但桌面图标没效果

这是正常的。

桌面 PWA 通常不加载 Safari 扩展。

## 页面布局乱了

先退回稳定版 CSS。

不要继续在坏版本上叠代码。

## 用户气泡变双层

说明不是改到了原气泡，而是在外面新套了一层。

这种情况需要重新抓真实 DOM，不能继续盲猜。

---

# Notes About Images

示例图片仅用于演示。

如果你 fork 或二次发布本项目，请替换为你自己有权使用的图片链接。

代码基于 MIT License 开源。图片素材不包含在 MIT 授权范围内，使用者需自行替换或确认授权。

---

# License

MIT License
