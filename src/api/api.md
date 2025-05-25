# api目录说明

```text
src/
  ├── api/
  │   ├── request.ts      // axios 配置和拦截器
  │   ├── types.ts        // 接口类型定义
  │   ├── user.ts         // 用户相关接口
  │   └── index.ts        // API 统一导出
  ├── store/
  │   ├── modules/
  │   │   └── user.ts     // 用户状态管理
  │   └── index.ts        // store 配置
```

---

# 接口列表

---

## 发送验证码

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/auth/send-sms \
-H "Content-Type: application/x-www-form-urlencoded" \
-d 'phoneNumbers=17338789999'
```

**响应：**

```json
{
    "success": true,
    "data": null,
    "code": "000000",
    "desc": "请求成功"
}
```

## 手机号+验证码登录

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex//client/auth/login-or-register \
-H "Content-Type: application/x-www-form-urlencoded" \
-d 'phoneNumbers=17338789999&verifyCode=888999'
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJlbmFibGVkXCI6dHJ1ZSxcImd1ZXN0XCI6ZmFsc2UsXCJuaWNrbmFtZVwiOlwiMzRsMDZ0M2RybFwiLFwicGhvbmVcIjpcIjE3MzIyNDQ5ODM4XCIsXCJ1c2VySWRcIjpcIjIwMjUwNTI1MDAwMDFcIixcInVzZXJuYW1lXCI6XCIxNzMyMjQ0OTgzOFwifSIsImlzcyI6Inh0cmFkZSIsImV4cCI6MTc0ODE0NTM5OCwiaWF0IjoxNzQ4MTM4MTk4LCJqdGkiOiIxMWUwMDMzNy1lNTYzLTQwYTctYTk2YS1iNmVmODYzMTMyOWQifQ.LXNOVAJkpFHkAXkXvFuxE8GPNQdJ-RziWwXSs_En1-44VO4NpOPYvkg8xjB3j2_bvn_lzhNGnBmjzuMrPkCST70QHQ5O3zD7usbOZoCisIROEXqsxC84DlE_fQHEZkboYzBP2vc3pl5klxjgYX5-FbiroQvadMQ1dp9ZYdvW2tT1gea-oJ9SudfyL09sHlwP4Y_F6NaSTUgsmr_eOqYlTg7fmG_pv0yqE-fmCo8fwApZDBK9pRCWOtvn5hVOC9IOmLwQv7PqOBpuOkmQEttQ-HjSJ2f3Ud8xiWCoTyZd13EhoiqAF2lrOVGzYO9ruIDhGaCnH_lsPsV2CueHbWfOBA",
        "client": null,
        "phone": "17322449838",
        "username": "17322449838",
        "userContext": {
            "userId": "2025052500001",
            "nickname": "34l06t3drl",
            "realName": null,
            "gender": null,
            "birthday": null,
            "avatarUrl": null,
            "address": null,
            "wechat": null,
            "qq": null,
            "brief": null,
            "authStatus": null,
            "blockchainId": null,
            "tradeScore": null
        }
    }
}
```
