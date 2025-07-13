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
curl -X POST http://47.122.125.199/tradex/client/auth/login-or-register \
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

## 编辑用户资料

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/user/update \
-H "Content-Type: application/json" \
-d '{
    "nickname": "iz7joz9rln",
    "gender": "MAN",
    "birthday": null,
    "avatarUrl": null,
    "address": null,
    "wechat": null,
    "qq": null,
    "brief": null
}'
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": null
}
```

## oss 上传文件

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/basic/oss/uploadFile \
-H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJlbmFibGVkXCI6dHJ1ZSxcImd1ZXN0XCI6ZmFsc2UsXCJuaWNrbmFtZVwiOlwiMzRsMDZ0M2RybFwiLFwicGhvbmVcIjpcIjE3MzIyNDQ5ODM4XCIsXCJ1c2VySWRcIjpcIjIwMjUwNTI1MDAwMDFcIixcInVzZXJuYW1lXCI6XCIxNzMyMjQ0OTgzOFwifSIsImlzcyI6Inh0cmFkZSIsImV4cCI6MTc0ODE0NTM5OCwiaWF0IjoxNzQ4MTM4MTk4LCJqdGkiOiIxMWUwMDMzNy1lNTYzLTQwYTctYTk2YS1iNmVmODYzMTMyOWQifQ.LXNOVAJkpFHkAXkXvFuxE8GPNQdJ-RziWwXSs_En1-44VO4NpOPYvkg8xjB3j2_bvn_lzhNGnBmjzuMrPkCST70QHQ5O3zD7usbOZoCisIROEXqsxC84DlE_fQHEZkboYzBP2vc3pl5klxjgYX5-FbiroQvadMQ1dp9ZYdvW2tT1gea-oJ9SudfyL09sHlwP4Y_F6NaSTUgsmr_eOqYlTg7fmG_pv0yqE-fmCo8fwApZDBK9pRCWOtvn5hVOC9IOmLwQv7PqOBpuOkmQEttQ-HjSJ2f3Ud8xiWCoTyZd13EhoiqAF2lrOVGzYO9ruIDhGaCnH_lsPsV2CueHbWfOBA" \
-H "Content-Type: multipart/form-data" \
-F 'file=@/path/to/file.jpg'
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": "http://47.122.125.199/tradex/basic/oss/previewFile/fbe8462c-436a-4275-8cba-272484c9a2c1.png"
}
```

## oss 查看文件

**请求：**

```bash
curl -X GET http://47.122.125.199/tradex/basic/oss/previewFile/{fileName} \
-H "Authorization: eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ7XCJlbmFibGVkXCI6dHJ1ZSxcImd1ZXN0XCI6ZmFsc2UsXCJuaWNrbmFtZVwiOlwiMzRsMDZ0M2RybFwiLFwicGhvbmVcIjpcIjE3MzIyNDQ5ODM4XCIsXCJ1c2VySWRcIjpcIjIwMjUwNTI1MDAwMDFcIixcInVzZXJuYW1lXCI6XCIxNzMyMjQ0OTgzOFwifSIsImlzcyI6Inh0cmFkZSIsImV4cCI6MTc0ODE0NTM5OCwiaWF0IjoxNzQ4MTM4MTk4LCJqdGkiOiIxMWUwMDMzNy1lNTYzLTQwYTctYTk2YS1iNmVmODYzMTMyOWQifQ.LXNOVAJkpFHkAXkXvFuxE8GPNQdJ-RziWwXSs_En1-44VO4NpOPYvkg8xjB3j2_bvn_lzhNGnBmjzuMrPkCST70QHQ5O3zD7usbOZoCisIROEXqsxC84DlE_fQHEZkboYzBP2vc3pl5klxjgYX5-FbiroQvadMQ1dp9ZYdvW2tT1gea-oJ9SudfyL09sHlwP4Y_F6NaSTUgsmr_eOqYlTg7fmG_pv0yqE-fmCo8fwApZDBK9pRCWOtvn5hVOC9IOmLwQv7PqOBpuOkmQEttQ-HjSJ2f3Ud8xiWCoTyZd13EhoiqAF2lrOVGzYO9ruIDhGaCnH_lsPsV2CueHbWfOBA" \
-H "Content-Type: application/x-www-form-urlencoded"
```

**响应：**

```text
显示图片内容

```

## 发布物品

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/item/publish \
-H "Content-Type: application/json" \
-d '{
    "itemTitle": "iphone17",
    "itemType": "玩具",
    "itemImageList": [
        "https://loremflickr.com/400/400?lock=4083905544130397",
        "https://loremflickr.com/400/400?lock=3671663543856805"
    ],
    "itemDescription": "7成新，很好用",
    "depreciation": 1
}'
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": {
        "id": "2025052800001",
        "userId": "2025042300003",
        "itemTitle": "iphone17",
        "itemType": "玩具",
        "itemDescription": "7成新，很好用",
        "firstImage": "https://loremflickr.com/400/400?lock=4083905544130397",
        "itemImageList": null,
        "depreciation": 1,
        "status": "auditing",
        "transferStatus": "own",
        "transferTimes": 0,
        "lastUserId": "2025042300003",
        "blockchainId": null
    }
}
```

## 查询我的物品列表

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/item/list-mine \
-H "Content-Type: application/json" \
-d '
{
  "pageNo": 1,
  "pageSize": 10,
  "status": 'all',
  "itemTitle": "iphone"
}'
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": [
        {
            "id": "2025052800001",
            "userId": "2025042300003",
            "itemTitle": "iphone",
            "itemType": "voluptate",
            "itemDescription": "very good",
            "firstImage": "http://47.122.125.199/tradex/basic/oss/previewFile/601eefec-9737-4717-ac7d-9f2f1f16f8d2.png",
            "itemImageList": ["http://47.122.125.199/tradex/basic/oss/previewFile/601eefec-9737-4717-ac7d-9f2f1f16f8d2.png"],
            "depreciation": 1,
            "status": "auditing",
            "transferStatus": "own",
            "transferTimes": 0,
            "lastUserId": "2025042300003",
            "blockchainId": "hds9232332222"
        }
    ]
}

```

## 我的物品详情

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/item/detail/{itemId} \
-H "Content-Type: application/json" 
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": {
        "id": "2025060100003",
        "userId": "2025052500001",
        "itemTitle": "iPhone",
        "itemType": "电子产品",
        "itemDescription": null,
        "firstImage": "http://47.122.125.199/tradex/basic/oss/previewFile/a3904477-858e-4e09-bf5a-78bc204915f7.png",
        "itemImageList": null,
        "depreciation": 5,
        "status": "auditing",
        "transferStatus": "own",
        "transferTimes": 0,
        "lastUserId": "2025052500001",
        "blockchainId": null,
        "loveCount": 0,
        "collectionCount": 0,
        "viewCount": 0,
        "tradeMethod": null,
        "transferPrice": null,
        "transferPoints": null,
        "expectItem": null,
        "contactInfo": null,
        "deliveryMethod": null
    }
}

```

## 发起我的物品转让

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/item/transfer \
-H "Content-Type: application/json" \
-d '{
    "itemId": "2025060100003",
    "tradeMethod": "ITEM_TO_ITEM",
    "transferPrice": 0,
    "transferPoints": 0,
    "expectItem": "string",
    "contactInfo": "string",
    "deliveryMethod": "SAME_CITY_BY_SELF"
}'
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": null
}

```

## 取消我的物品转让

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/item/cancel-transfer \
-H "Content-Type: application/json" \
-d '{
    "itemId": "2025060100003",
    "cancelReason": "我不想交易了，还有用"
}'
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": null
}
```

## 查询交易广场-转让中物品列表

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/square/list-item \
-H "Content-Type: application/json" \
-d '
{
  "pageNo": 1,
  "pageSize": 10,
  "searchKey": '自行车',
  "itemType": "all",
  "tradeMethod": "ITEM_TO_ITEM",
  "sortBy": "newest|price_asc|price_desc"
}'
```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": [
        {
            "id": "2025052800001",
            "userId": "2025042300003",
            "userAvatar": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
            "userNickname": "NPE",
            "itemTitle": "iphone",
            "itemType": "电子产品",
            "itemDescription": "very good",
            "firstImage": "http://47.122.125.199/tradex/basic/oss/previewFile/601eefec-9737-4717-ac7d-9f2f1f16f8d2.png",
            "depreciation": 1,
            "transferTimes": 0,
            "lastUserId": "2025042300003",
            "blockchainId": "hds9232332222",
            "loveCount": 0,
            "collectionCount": 0,
            "viewCount": 10,
            "tradeMethod": "ITEM_TO_POINTS",
            "transferPrice": null,
            "transferPoints": 10,
            "expectItem": null,
            "publishTime": 1744790484000
        }
    ]
}

```

## 查询交易广场-转让中物品详情

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/square/detail-item/{itemId} \

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": {
        "id": "2025061700001",
        "userId": "2025061600001",
        "userAvatar": "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg",
        "userNickname": "NPE",
        "itemTitle": "吉娃娃",
        "itemType": "衣服",
        "itemDescription": "很好的",
        "firstImage": "http://127.0.0.1:8099/tradex/basic/oss/previewFile/aca4bd93-9dba-4fec-81b0-361923b933e9.png",
        "depreciation": 5,
        "transferTimes": 0,
        "lastUserId": "2025061600001",
        "blockchainId": "hasheljklfjsdfjk",
        "loveCount": 0,
        "collectionCount": 0,
        "viewCount": 0,
        "tradeMethod": "ITEM_TO_ITEM",
        "transferPrice": 0,
        "transferPoints": 0,
        "expectItem": "玩具车",
        "publishTime": 1744790484000,
        "itemImageList": [
            "http://127.0.0.1:8099/tradex/basic/oss/previewFile/aca4bd93-9dba-4fec-81b0-361923b933e9.png"
        ],
        "userExt": {
            "blockchainId":"2222",
            "tradeScore": 15
        },
        "contactInfo": {
            "linkman": "张三",
            "phone": "17322449888",
            "address": "龙华万家"
        },
        "exchangeApplyCount": 0,
        "deliveryMethod": "SAME_CITY_BY_SELF",
        "isLiked": false,
        "isCollected": false
    }
}

```

## 交易广场-发起交换申请

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/trade/transfer-apply \
-H "Content-Type: application/json" \
-d '
{
  "itemId": "item12222",
  "fromUserId": "user12222",
  "swapItemId": "item12222",
  "contactInfo":  {
            "linkman": "张三",
            "phone": "17322449888",
            "address": "龙华万家"
        }
}'

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": null
}

```

## 交易管理-查询我的交易

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/trade/list-mine \
-H "Content-Type: application/json" \
-d '
{
  "pageNo": 1,
  "pageSize": 10
  "tradeStatus": "all"
}'

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": [{
            "id": "2025040100001",
            "itemId": "2025040100001",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "ITEM_TO_ITEM",
            "tradeStatus": "trading",
            "paymentStatus": 0,
            "tradePrice": null,
            "tradePoints": null,
            "swapItemId": "20250324000002",
            "swapItemTitle": "小米6",
            "contactInfo": "",
            "logisticsFrom": null,
            "logisticsTo": null,
            "fromScore": null,
            "toScore": null,
            "finishTradeTime": null,
            "createTime": 1743470905967,
            "flag": 'SELL'
        }]
}

```

## 交易管理-查询我的交易详情

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/trade/{tradeId} \

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": {
            "id": "2025040100001",
            "itemId": "2025040100001",
            "itemTitle": "iphone 16",
            "firstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "fromUserId": "20250324000002",
            "toUserId": "20250324000001",
            "tradeMethod": "ITEM_TO_ITEM",
            "tradeStatus": "trading",
            "paymentStatus": 0,
            "tradePrice": null,
            "tradePoints": null,
            "swapItemId": "20250324000002",
            "swapItemTitle": "小米6",
            "swapItemFirstImage": "https://fastly.jsdelivr.net/npm/@vant/assets/ipad.jpeg",
            "contactInfo": "",
            "logisticsFrom": null,
            "logisticsTo": null,
            "fromScore": null,
            "toScore": null,
            "finishTradeTime": null,
            "createTime": 1743470905967,
            "flag": 'SELL'
            "payment": {
              "paymentMethod": "CASH",
              "paymentNo": "PO0000001",
              "amount": 10
            }
        }
}

```


## 以物换物-查询我可以交换的物品

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/client/item/list-my-can-trade-item \
-H "Content-Type: application/json" 

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": [
        {
            "id": "2025041600004",
            "userId": "2025041600008",
            "itemTitle": "ipad",
            "itemType": "电子产品",
            "firstImage": "https://loremflickr.com/400/400?lock=4629788122736503"
        },
        {
            "id": "2025061400001",
            "userId": "2025041600008",
            "itemTitle": "小兔子",
            "itemType": "玩具",
            "firstImage": "http://127.0.0.1:80/tradex/basic/oss/previewFile/6ecfc82f-91eb-4d55-94b5-abf88b76fce6.png"
        },
        {
            "id": "2025062200001",
            "userId": "2025041600008",
            "itemTitle": "宠物企鹅",
            "itemType": "玩具",
            "firstImage": "http://127.0.0.1:80/tradex/basic/oss/previewFile/b10bc147-8633-4d63-86c6-e2b702ab92c0.png"
        },
        {
            "id": "2025062200002",
            "userId": "2025041600008",
            "itemTitle": "迷你鼠",
            "itemType": "玩具",
            "firstImage": "http://127.0.0.1:80/tradex/basic/oss/previewFile/fe599d5f-ccb8-42e8-908e-11011952f5ce.png"
        }
    ]
}

```

## 以物换物-卖方接受交易

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/clien/trade/accept-transfer-apply \
-H "Content-Type: application/json" \
-d '
{
  "tradeId": "trade12222"
}'

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": null
}

```

## 以物换物-卖方拒绝交易

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/clien/trade/reject-transfer-apply \
-H "Content-Type: application/json" \
-d '
{
  "tradeId": "trade12222",
  "rejectReason": "不喜欢"
}'

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": null
}

```

## 交易列表-交易完成，买方确认即可

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/clien/trade/completed \
-H "Content-Type: application/json" \
-d '
{
  "tradeId": "trade12222"
}'

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": null
}

```

## 积分换物-发起支付,创建支付订单

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/clien/trade/create-pay \
-H "Content-Type: application/json" \
-d '
{
  "itemId": "item12222",
  "fromUserId": "user20222222",
  "contactInfo":{
            "linkman": "张三",
            "phone": "17322449888",
            "address": "龙华万家"
        }
}'

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": {
        "tradeId":"trade20222222",
        "itemId": "item100000",
        "tradeMethod": "ITEM_TO_POINTS",
        "tradePrice": null,
        "tradePoints": 10
    }
}

```

## 积分换物-立即支付

**请求：**

```bash
curl -X POST http://47.122.125.199/tradex/clien/trade/goPay \
-H "Content-Type: application/json" \
-d '
{
    "tradeId":"trade20222222",
    "itemId": "item100000",
    "tradePassword":"123456"
    "tradeMethod": "ITEM_TO_POINTS",
    "tradePrice": null,
    "tradePoints": 10，
    "paymentMethod": null
}'

```

**响应：**

```json
{
    "success": true,
    "code": "000000",
    "desc": "请求成功",
    "data": null
}

```