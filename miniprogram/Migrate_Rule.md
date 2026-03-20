# 迁移规则
1. 每个页面必须包含4个文件：.js, .json, .wxml, .wxss；**每个页面对应独立子目录**，主文件名与目录名一致（如 `pages/user/login/login.js` …），与微信官方目录约定一致，便于维护与路由注册。
2. .json文件必须配置 navigationBarTitleText
3. Vue的mounted → 小程序的onLoad
4. Vue的v-for → 小程序的wx:for
5. Vue的@click → 小程序的bindtap
6. 所有图片资源从 /miniprogram/images/ 引用
7. API请求统一使用 utils/request.js 封装（用户/登录/积分见 `api/user.js`，收货地址见 `api/address.js`，登录态写入见 `utils/auth.js`；交易相关见 `api/trade.js`，操作确认与弹窗逻辑见 `utils/trade-actions.js`；拉新榜见 `api/rank.js`）

## Vue 路由 → 小程序页面（`app.json` 已注册）

| Vue `path`（`src/router/index.ts`） | 小程序页面路径 |
| --- | --- |
| `/`（`HomeView`） | `pages/home/home`（启动页；`pages/index/index` 仅 `switchTab` 跳转首页） |
| `/about` | `pages/about/about` |
| `/login` | `pages/user/login/login` |
| `/agreement/privacy` | `pages/agreement/privacy/privacy` |
| `/agreement/swap` | `pages/agreement/swap/swap` |
| `/register` | `pages/user/register/register` |
| `/user/profile` | `pages/user/profile/profile` |
| `/stuff/publish` | `pages/stuff/publish/publish` |
| `/stuff/detail/:id` | `pages/stuff/detail/detail`（`id` 用 `options.id` 或 query） |
| `/trade/list` | `pages/trade/list/list` |
| `/trade/:id` | `pages/trade/detail/detail` |
| `/user/settings` | `pages/user/settings/settings` |
| `/user/help`（`HelpView`） | `pages/help/help/help` |
| `/user/about`（`AboutPlatformView`） | `pages/help/about-platform/about-platform` |
| `/user/edit-profile` | `pages/user/edit-profile/edit-profile` |
| `/user/address` | `pages/user/address/address` |
| `/user/address/new` | `pages/user/address/new/new` |
| `/user/address/edit/:id` | `pages/user/address/edit/edit` |
| `/search` | `pages/search/search` |
| `/square/item/detail/:id` | `pages/square/item/detail/detail?id=物品ID` |
| `/notification` | `pages/notification/notification`（Tab；`onShow` 拉取列表，下拉刷新） |
| `/notification/detail/:id` | `pages/notification/detail/detail?id=通知ID` |
| `/user/security` | `pages/user/security/security` |
| `/audit/:id`（query `itemId`） | `pages/audit/audit?id=任务ID&itemId=物品ID` |
| `/rank/invite`（`InviteRankView`） | `pages/rank/invite/invite`（分享走 `onShareAppMessage` / 朋友圈 `onShareTimeline`） |
| `/user/login-reward` | `pages/user/login-reward/login-reward` |

**`pages/user/` 目录约定**：每个页面对应**一级子目录**，目录名与四件套主文件名一致，例如 `login/login.*`、`address/edit/edit.*`（地址新建/编辑再各一层子目录，仍为「一页一目录」）。

注：`src/router/index.ts` 中注释掉的 `/stuff/list` 未生成页面。
8. 转换时注意：
   - Vue的<template> → 小程序的.wxml
   - Vue的<style> → 小程序的.wxss
   - Vue的<script> → 小程序的.js（生命周期要改为onLoad/onShow等）
   - Vue的路由 → 在app.json的pages数组里注册

## 样式对齐说明（`src/views` ↔ `miniprogram/pages`）

- **技术差异**：H5 使用 Vant + `theme.scss`（`px`）；小程序用原生组件 + **`rpx`**，无 Vant，需在 `.wxss` 中手写与 Vant 接近的圆角、阴影、间距。
- **已对照 Vue 结构/配色做的页面**
  - **首页** `HomeView.vue` ↔ `pages/home/home`：顶栏渐变、搜索条、hero、轮播、四列功能宫格、筛选条、双列 `item-card`、空态；本次加强了筛选条轻阴影、空态主按钮渐变（贴近 Vue 主色按钮）。
  - **登录** `LoginView.vue` ↔ `pages/user/login/login`：此前已按现代表单风格美化（卡片、分段 Tab、主按钮渐变）。
  - **注册** `RegisterView.vue` ↔ `pages/user/register/register`：与登录页统一 — 顶区文案、白卡片 + 左缩进分割线、获取验证码幽灵按钮、渐变注册按钮、简介区灰底 textarea。
  - **设置** `SettingsView.vue` ↔ `pages/user/settings/settings`：补齐 Vue 的 **顶区渐变、分组卡片阴影、底部固定操作区**；列表项用色块首字图标替代 emoji，对应原 `van-cell` + 蓝色 `cell-icon`。
  - **帮助** `HelpView.vue` ↔ `pages/help/help/help` + `styles/help-page.wxss`：折叠与分组样式本就按 Vue 转写；分组标题由 emoji 改为与主题色一致的圆形字标（? / 联 / 约）。
- **其余页面**：按 `app.json` 与上表路径自行对照；若某页仍是「能跑但丑」，优先对齐 Vue 的 **背景渐变、白卡片圆角阴影、主按钮渐变、列表分隔线** 四要素即可。
