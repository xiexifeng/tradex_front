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
