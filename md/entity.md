# 换物平台实体信息设计

## 1. 用户实体 (User)

### 1.1 实体属性
- [userId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L41-L41): 用户唯一标识
- [nickname](file://C:\mine\xmine\tradex_front\src\api\types.ts#L11-L11): 昵称
- [realName](file://C:\mine\xmine\tradex_front\src\api\types.ts#L12-L12): 真实姓名
- [gender](file://C:\mine\xmine\tradex_front\src\api\types.ts#L13-L13): 性别
- [birthday](file://C:\mine\xmine\tradex_front\src\api\types.ts#L14-L14): 生日
- [avatarUrl](file://C:\mine\xmine\tradex_front\src\api\types.ts#L15-L15): 头像URL
- [address](file://C:\mine\xmine\tradex_front\src\api\types.ts#L16-L16): 地址
- [wechat](file://C:\mine\xmine\tradex_front\src\api\types.ts#L17-L17): 微信
- [qq](file://C:\mine\xmine\tradex_front\src\api\types.ts#L18-L18): QQ
- [brief](file://C:\mine\xmine\tradex_front\src\api\types.ts#L19-L19): 个人简介
- [authStatus](file://C:\mine\xmine\tradex_front\src\api\types.ts#L20-L20): 认证状态
- [blockchainId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L52-L52): 区块链ID
- [tradeScore](file://C:\mine\xmine\tradex_front\src\api\stuff.ts#L208-L215): 交易评分
- [phone](file://C:\mine\xmine\tradex_front\src\api\types.ts#L33-L33): 手机号
- [username](file://C:\mine\xmine\tradex_front\src\api\types.ts#L34-L34): 用户名
- `enabled`: 账户是否启用
- `guest`: 是否为游客

### 1.2 页面功能应用
- **登录页**: [phone](file://C:\mine\xmine\tradex_front\src\api\types.ts#L33-L33), [username](file://C:\mine\xmine\tradex_front\src\api\types.ts#L34-L34)
- **个人中心**: [avatarUrl](file://C:\mine\xmine\tradex_front\src\api\types.ts#L15-L15), [nickname](file://C:\mine\xmine\tradex_front\src\api\types.ts#L11-L11), [brief](file://C:\mine\xmine\tradex_front\src\api\types.ts#L19-L19), [tradeScore](file://C:\mine\xmine\tradex_front\src\api\stuff.ts#L208-L215)
- **编辑资料**: [nickname](file://C:\mine\xmine\tradex_front\src\api\types.ts#L11-L11), [gender](file://C:\mine\xmine\tradex_front\src\api\types.ts#L13-L13), [birthday](file://C:\mine\xmine\tradex_front\src\api\types.ts#L14-L14), [avatarUrl](file://C:\mine\xmine\tradex_front\src\api\types.ts#L15-L15), [address](file://C:\mine\xmine\tradex_front\src\api\types.ts#L16-L16), [brief](file://C:\mine\xmine\tradex_front\src\api\types.ts#L19-L19)
- **交易详情**: [avatarUrl](file://C:\mine\xmine\tradex_front\src\api\types.ts#L15-L15), [nickname](file://C:\mine\xmine\tradex_front\src\api\types.ts#L11-L11), [tradeScore](file://C:\mine\xmine\tradex_front\src\api\stuff.ts#L208-L215)
- **物品详情**: [avatarUrl](file://C:\mine\xmine\tradex_front\src\api\types.ts#L15-L15), [nickname](file://C:\mine\xmine\tradex_front\src\api\types.ts#L11-L11)

## 2. 物品实体 (Item)

### 2.1 实体属性
- [id](file://C:\mine\xmine\tradex_front\src\api\types.ts#L40-L40): 物品唯一标识
- [userId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L41-L41): 发布用户ID
- [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42): 物品标题
- [itemType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L43-L43): 物品类别
- [itemDescription](file://C:\mine\xmine\tradex_front\src\api\types.ts#L44-L44): 物品描述
- [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45): 首图URL
- [itemImageList](file://C:\mine\xmine\tradex_front\src\api\types.ts#L46-L46): 物品图片列表
- [depreciation](file://C:\mine\xmine\tradex_front\src\api\types.ts#L47-L47): 折旧程度
- [status](file://C:\mine\xmine\tradex_front\src\api\types.ts#L48-L48): 物品状态
- [transferStatus](file://C:\mine\xmine\tradex_front\src\api\types.ts#L49-L49): 转让状态
- [transferTimes](file://C:\mine\xmine\tradex_front\src\api\types.ts#L50-L50): 转让次数
- [lastUserId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L51-L51): 最后用户ID
- [blockchainId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L52-L52): 区块链ID
- [loveCount](file://C:\mine\xmine\tradex_front\src\api\types.ts#L57-L57): 点赞数
- [collectionCount](file://C:\mine\xmine\tradex_front\src\api\types.ts#L58-L58): 收藏数
- [viewCount](file://C:\mine\xmine\tradex_front\src\api\types.ts#L59-L59): 浏览数
- [tradeMethod](file://C:\mine\xmine\tradex_front\src\api\types.ts#L60-L60): 交易方式
- [transferPrice](file://C:\mine\xmine\tradex_front\src\api\types.ts#L61-L61): 转让价格
- [transferPoints](file://C:\mine\xmine\tradex_front\src\api\types.ts#L62-L62): 转让积分
- [expectItem](file://C:\mine\xmine\tradex_front\src\api\types.ts#L63-L63): 期望物品
- [contactInfo](file://C:\mine\xmine\tradex_front\src\api\types.ts#L64-L64): 联系信息
- [deliveryMethod](file://C:\mine\xmine\tradex_front\src\api\types.ts#L65-L65): 配送方式
- [publishTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L121-L121): 发布时间

### 2.2 页面功能应用
- **发布页**: [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42), [itemType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L43-L43), [itemDescription](file://C:\mine\xmine\tradex_front\src\api\types.ts#L44-L44), [itemImageList](file://C:\mine\xmine\tradex_front\src\api\types.ts#L46-L46), [depreciation](file://C:\mine\xmine\tradex_front\src\api\types.ts#L47-L47)
- **广场页**: [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45), [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42), [itemType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L43-L43), [depreciation](file://C:\mine\xmine\tradex_front\src\api\types.ts#L47-L47), [loveCount](file://C:\mine\xmine\tradex_front\src\api\types.ts#L57-L57), [collectionCount](file://C:\mine\xmine\tradex_front\src\api\types.ts#L58-L58), [viewCount](file://C:\mine\xmine\tradex_front\src\api\types.ts#L59-L59)
- **详情页**: [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45), [itemImageList](file://C:\mine\xmine\tradex_front\src\api\types.ts#L46-L46), [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42), [itemType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L43-L43), [itemDescription](file://C:\mine\xmine\tradex_front\src\api\types.ts#L44-L44), [depreciation](file://C:\mine\xmine\tradex_front\src\api\types.ts#L47-L47), [publishTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L121-L121)
- **我的物品**: [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45), [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42), [status](file://C:\mine\xmine\tradex_front\src\api\types.ts#L48-L48), [transferTimes](file://C:\mine\xmine\tradex_front\src\api\types.ts#L50-L50)
- **搜索页**: [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45), [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42), [itemType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L43-L43)

## 3. 交易实体 (Trade)

### 3.1 实体属性
- [id](file://C:\mine\xmine\tradex_front\src\api\types.ts#L40-L40): 交易唯一标识
- [itemId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L183-L183): 物品ID
- [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42): 物品标题
- [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45): 物品首图
- [fromUserId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L186-L186): 发起方用户ID
- [toUserId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L187-L187): 接收方用户ID
- [tradeMethod](file://C:\mine\xmine\tradex_front\src\api\types.ts#L60-L60): 交易方式
- [tradeStatus](file://C:\mine\xmine\tradex_front\src\api\types.ts#L189-L189): 交易状态
- [paymentStatus](file://C:\mine\xmine\tradex_front\src\api\types.ts#L190-L190): 支付状态
- [tradePrice](file://C:\mine\xmine\tradex_front\src\api\types.ts#L191-L191): 交易价格
- [tradePoints](file://C:\mine\xmine\tradex_front\src\api\types.ts#L192-L192): 交易积分
- [swapItemId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L193-L193): 交换物品ID
- [swapItemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L194-L194): 交换物品标题
- [swapItemFirstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L195-L195): 交换物品首图
- [contactInfo](file://C:\mine\xmine\tradex_front\src\api\types.ts#L64-L64): 联系信息
- [logisticsFrom](file://C:\mine\xmine\tradex_front\src\api\types.ts#L197-L197): 发货物流
- [logisticsTo](file://C:\mine\xmine\tradex_front\src\api\types.ts#L198-L198): 收货物流
- [fromScore](file://C:\mine\xmine\tradex_front\src\api\types.ts#L199-L199): 发起方评分
- [toScore](file://C:\mine\xmine\tradex_front\src\api\types.ts#L200-L200): 接收方评分
- [finishTradeTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L201-L201): 完成时间
- [createTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L202-L202): 创建时间
- [flag](file://C:\mine\xmine\tradex_front\src\api\types.ts#L203-L203): 交易标志（SELL/BUY）
- [payment](file://C:\mine\xmine\tradex_front\src\api\types.ts#L204-L208): 支付信息对象

### 3.2 页面功能应用
- **交易列表**: [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45), [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42), [tradeStatus](file://C:\mine\xmine\tradex_front\src\api\types.ts#L189-L189), [createTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L202-L202)
- **交易详情**: [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45), [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42), [tradeStatus](file://C:\mine\xmine\tradex_front\src\api\types.ts#L189-L189), [tradeMethod](file://C:\mine\xmine\tradex_front\src\api\types.ts#L60-L60), [contactInfo](file://C:\mine\xmine\tradex_front\src\api\types.ts#L64-L64)
- **交换页**: [itemId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L183-L183), [itemTitle](file://C:\mine\xmine\tradex_front\src\api\types.ts#L42-L42), [firstImage](file://C:\mine\xmine\tradex_front\src\api\types.ts#L45-L45), [contactInfo](file://C:\mine\xmine\tradex_front\src\api\types.ts#L64-L64)
- **支付页**: [tradePoints](file://C:\mine\xmine\tradex_front\src\api\types.ts#L192-L192), [tradePrice](file://C:\mine\xmine\tradex_front\src\api\types.ts#L191-L191), [payment](file://C:\mine\xmine\tradex_front\src\api\types.ts#L204-L208)

## 4. 积分账户实体 (PointsAccount)

### 4.1 实体属性
- [id](file://C:\mine\xmine\tradex_front\src\api\types.ts#L40-L40): 账户唯一标识
- [userId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L41-L41): 用户ID
- [pointsBalance](file://C:\mine\xmine\tradex_front\src\api\types.ts#L215-L215): 积分余额
- [frozenPoints](file://C:\mine\xmine\tradex_front\src\api\types.ts#L216-L216): 冻结积分

### 4.2 页面功能应用
- **个人中心**: [pointsBalance](file://C:\mine\xmine\tradex_front\src\api\types.ts#L215-L215)
- **积分商城**: [pointsBalance](file://C:\mine\xmine\tradex_front\src\api\types.ts#L215-L215)
- **支付页**: [pointsBalance](file://C:\mine\xmine\tradex_front\src\api\types.ts#L215-L215)

## 5. 积分交易记录实体 (PointsTransaction)

### 5.1 实体属性
- [id](file://C:\mine\xmine\tradex_front\src\api\types.ts#L40-L40): 记录唯一标识
- [bizNo](file://C:\mine\xmine\tradex_front\src\api\types.ts#L222-L222): 业务编号
- [pointsChange](file://C:\mine\xmine\tradex_front\src\api\types.ts#L223-L223): 积分变动
- [transactionType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L224-L224): 交易类型
- [transactionDescription](file://C:\mine\xmine\tradex_front\src\api\types.ts#L225-L225): 交易描述
- [transactionTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L226-L226): 交易时间

### 5.2 页面功能应用
- **积分商城**: [pointsChange](file://C:\mine\xmine\tradex_front\src\api\types.ts#L223-L223), [transactionType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L224-L224), [transactionTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L226-L226)
- **个人中心**: [pointsChange](file://C:\mine\xmine\tradex_front\src\api\types.ts#L223-L223), [transactionType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L224-L224), [transactionTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L226-L226)

## 6. 信用评分记录实体 (TradeScore)

### 6.1 实体属性
- [tradeId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L174-L174): 交易ID
- [userId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L41-L41): 用户ID
- [tradeScore](file://C:\mine\xmine\tradex_front\src\api\stuff.ts#L208-L215): 交易评分
- [tradeRemark](file://C:\mine\xmine\tradex_front\src\api\types.ts#L234-L234): 交易备注
- [scoreTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L235-L235): 评分时间

### 6.2 页面功能应用
- **个人中心**: [tradeScore](file://C:\mine\xmine\tradex_front\src\api\stuff.ts#L208-L215)
- **交易详情**: [tradeScore](file://C:\mine\xmine\tradex_front\src\api\stuff.ts#L208-L215)
- **评价页**: [tradeScore](file://C:\mine\xmine\tradex_front\src\api\stuff.ts#L208-L215)

## 7. 消息通知实体 (Notification)

### 7.1 实体属性
- [id](file://C:\mine\xmine\tradex_front\src\api\types.ts#L40-L40): 通知唯一标识
- [userId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L41-L41): 用户ID
- [notificationType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L242-L242): 通知类型
- [relatedId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L243-L243): 关联ID
- [title](file://C:\mine\xmine\tradex_front\src\api\types.ts#L244-L244): 通知标题
- [content](file://C:\mine\xmine\tradex_front\src\api\types.ts#L245-L245): 通知内容
- [status](file://C:\mine\xmine\tradex_front\src\api\types.ts#L48-L48): 通知状态
- [createTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L202-L202): 创建时间

### 7.2 页面功能应用
- **通知页**: [title](file://C:\mine\xmine\tradex_front\src\api\types.ts#L244-L244), [content](file://C:\mine\xmine\tradex_front\src\api\types.ts#L245-L245), [createTime](file://C:\mine\xmine\tradex_front\src\api\types.ts#L202-L202), [status](file://C:\mine\xmine\tradex_front\src\api\types.ts#L48-L48)
- **个人中心**: [notificationType](file://C:\mine\xmine\tradex_front\src\api\types.ts#L242-L242)

## 8. 服务实体 (Service)

### 8.1 实体属性
- [id](file://C:\mine\xmine\tradex_front\src\api\types.ts#L40-L40): 服务唯一标识
- `serviceType`: 服务类型
- `serviceDuration`: 服务时长
- `serviceProvider`: 服务提供者
- `serviceRecipient`: 服务接受者
- `serviceRating`: 服务评分
- `timeBankBalance`: 时间银行余额

### 8.2 页面功能应用
- **时间银行**: `serviceType`, `serviceDuration`, `serviceProvider`
- **个人中心**: `timeBankBalance`

## 9. 团购实体 (Group)

### 9.1 实体属性
- `groupId`: 团购组ID
- `groupLeader`: 团购团长
- `participants`: 参与者列表
- `targetAmount`: 目标金额
- `currentAmount`: 当前金额
- `minParticipants`: 最少参与者数
- `maxParticipants`: 最大参与者数
- `groupStatus`: 团购状态

### 9.2 页面功能应用
- **团购页**: `groupLeader`, `participants`, `currentAmount`, `groupStatus`
- **个人中心**: `groupLeader`

## 10. 租赁实体 (Rental)

### 10.1 实体属性
- [id](file://C:\mine\xmine\tradex_front\src\api\types.ts#L40-L40): 租赁唯一标识
- `rentalPeriod`: 租赁期限
- `rentalPrice`: 租赁价格
- `depositAmount`: 押金金额
- `rentalStatus`: 租赁状态
- `renterId`: 租赁者ID
- `lenderId`: 出租者ID
- `returnDeadline`: 归还截止时间

### 10.2 页面功能应用
- **租赁页**: `rentalPrice`, `rentalStatus`, `returnDeadline`
- **个人中心**: `rentalStatus`

## 11. 技能实体 (Skill)

### 11.1 实体属性
- [id](file://C:\mine\xmine\tradex_front\src\api\types.ts#L40-L40): 技能唯一标识
- `skillType`: 技能类型
- `skillLevel`: 技能等级
- `teachingMethod`: 教学方式
- `learningRequirements`: 学习要求
- `exchangeRatio`: 交换比例
- `skillRating`: 技能评分

### 11.2 页面功能应用
- **技能页**: `skillType`, `skillLevel`, `skillRating`
- **个人中心**: `skillType`

## 12. 环保积分实体 (EcoPoints)

### 12.1 实体属性
- `ecoPoints`: 环保积分
- `ecoActions`: 环保行为记录
- `ecoRanking`: 环保排名
- `carbonReduction`: 碳减排量
- `ecoRewards`: 环保奖励

### 12.2 页面功能应用
- **环保页**: `ecoPoints`, `ecoRanking`
- **个人中心**: `ecoPoints`

## 13. 信用评级实体 (Credit)

### 13.1 实体属性
- `creditScore`: 信用评分
- `trustLevel`: 信任等级
- `transactionHistory`: 交易历史
- `disputeCount`: 争议次数
- `complianceRate`: 合规率

### 13.2 页面功能应用
- **信用页**: `creditScore`, `trustLevel`
- **个人中心**: `creditScore`

## 14. 互助网络实体 (Help)

### 14.1 实体属性
- `helpType`: 求助类型
- `emergencyLevel`: 紧急程度
- `locationRadius`: 覆盖范围
- `helperId`: 帮助者ID
- `helpStatus`: 求助状态
- `gratitudePoints`: 感谢积分

### 14.2 页面功能应用
- **互助页**: `helpType`, `emergencyLevel`, `helpStatus`
- **个人中心**: `gratitudePoints`

## 15. 物品溯源实体 (ItemHistory)

### 15.1 实体属性
- `ownershipHistory`: 所有权历史
- `transferRecords`: 转移记录
- `authenticity`: 真实性验证
- `blockchainPath`: 区块链路径
- `verificationStatus`: 验证状态

### 15.2 页面功能应用
- **溯源页**: `ownershipHistory`, `verificationStatus`
- **详情页**: `verificationStatus`

## 16. 社交圈子实体 (Circle)

### 16.1 实体属性
- `circleId`: 圈子ID
- `circleName`: 圈子名称
- `circleMembers`: 圈子成员
- `circleType`: 圈子类型
- `circleRules`: 圈子规则
- `circleBenefits`: 圈子权益

### 16.2 页面功能应用
- **圈子页**: `circleName`, `circleMembers`, `circleType`
- **个人中心**: `circleName`

## 17. AI推荐实体 (Recommendation)

### 17.1 实体属性
- `userPreferences`: 用户偏好数据
- `recommendationScore`: 推荐得分
- `matchReason`: 匹配原因
- `interactionHistory`: 交互历史

### 17.2 页面功能应用
- **首页**: `recommendationScore`, `matchReason`
- **广场页**: `recommendationScore`

## 18. 搜索历史实体 (SearchHistory)

### 18.1 实体属性
- `searchKeyword`: 搜索关键词
- `searchTime`: 搜索时间
- `searchCount`: 搜索次数

### 18.2 页面功能应用
- **搜索页**: `searchKeyword`, `searchTime`

## 19. 浏览历史实体 (BrowseHistory)

### 19.1 实体属性
- [itemId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L183-L183): 物品ID
- `browseTime`: 浏览时间
- `viewDuration`: 浏览时长

### 19.2 页面功能应用
- **历史页**: [itemId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L183-L183), `browseTime`
- **详情页**: [viewCount](file://C:\mine\xmine\tradex_front\src\api\types.ts#L59-L59)

## 20. 收藏实体 (Collection)

### 20.1 实体属性
- [itemId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L183-L183): 物品ID
- `collectTime`: 收藏时间
- [isCollected](file://C:\mine\xmine\tradex_front\src\api\types.ts#L135-L135): 是否已收藏

### 20.2 页面功能应用
- **收藏页**: [itemId](file://C:\mine\xmine\tradex_front\src\api\types.ts#L183-L183), `collectTime`
- **详情页**: [isCollected](file://C:\mine\xmine\tradex_front\src\api\types.ts#L135-L135)
- **广场页**: [isCollected](file://C:\mine\xmine\tradex_front\src\api\types.ts#L135-L135)

## 实体关系映射

### 21. 实体关联关系
- **User** 一对多 **Item**: 一个用户可以发布多个物品
- **User** 一对多 **Trade**: 一个用户可以参与多个交易
- **Item** 一对多 **Trade**: 一个物品可以有多个交易记录
- **User** 一对一 **PointsAccount**: 一个用户对应一个积分账户
- **User** 一对多 **Notification**: 一个用户可以收到多个通知
- **User** 一对多 **Collection**: 一个用户可以收藏多个物品

这些实体设计覆盖了换物平台的所有核心功能，为页面开发提供了完整的数据结构支持。