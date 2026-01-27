V1：
先简单实现邀请新用户注册、分享功能，对应积分奖励机制增加用户粘性

一、邀请新用户
1、邀请码直接用userId，使用userId、不生成专门的邀请码具有天然优势，更适合推广场景：
1）没有时效，目的就是为了推广不设时效
2）不限制邀请次数，注册的人越多越好
邀请链接里带着userId和时间戳

2、安全处理：
1）为防止预测userId、预测用户数，userId不用自增数字生成，而且分享链接里userId可以做base64编码隐藏处理
2）新用户得用未注册过的手机号才能注册，不会存在刷奖励的情况

3、奖励机制
每邀请一个人奖励5积分（可配置），累计邀请人数额外奖励积分（可配置）：
邀请5人：50积分
邀请10人：100积分
邀请20人：200积分
邀请30人：300积分

4、表结构
用户表增加：invite_user_id 邀请人userId、 can_invite 是否能邀请

5、前端页面
用户注册页面，分享链接就是链接到用户注册页面，该页面url接收参数userId和邀请时间时间戳
用户注册完成后发放奖励，注册按钮在原来接口基础上添加邀请userId和邀请时间的传参

6、后台注册接口添加发放奖励逻辑：
为防止发送积分奖励后注册失败，积分奖励逻辑可以发消息异步执行
添加邀请记录表的插入操作，跟用户表插入是一个事务，注册完成后发用户注册消息

7、订阅用户注册消息
invite_user_id 增加5积分，统计累计邀请人数，发放额外奖励，
插入积分变更记录

二、分享物品到社交网站
分享物品链接点开肯定到的是商品详情页，商品详情页也要接收userId参数，并且向注册登录页面跳转时要带着
分享链接怎么算有效点击，点击暂时不设置奖励，分享链接带来用户注册获得拉新的奖励积分

三、每周拉新排行榜
1、统计上周一0点到周日23点59分的拉新数量（从邀请记录表统计），从大到小排列; 页面不需要定时刷新，用户进入时查最新的，一直停留在这想看最新的就手动刷新
排行榜只展示前10名

2、新增邀请记录表、排行榜主表、排行榜明细表：
CREATE TABLE invite_record (
	id BIGINT PRIMARY KEY AUTO_INCREMENT comment '自增主键id',
    invite_user_id VARCHAR(32) NOT NULL comment '邀请人用户id',
	invited_user_id VARCHAR(32) NOT NULL comment '被邀请人用户id',
	invite_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '邀请时间',
	reg_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '注册时间',
	reg_ip varchar(32) comment '注册ip',
	channel VARCHAR(50) COMMENT '来源渠道',
	create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '修改时间',
	INDEX idx_invite (invite_user_id)
) comment '邀请记录表';

CREATE TABLE user_rank (
    id BIGINT PRIMARY KEY AUTO_INCREMENT comment '自增主键id',
	rank_id varchar(30) comment '排行榜id',
	rank_type tinyint comment '榜单类型(1-拉新 2-点赞 3-物品成交)',
    begin_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '开始时间',
	end_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '结束时间',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '修改时间',
	INDEX idx_rank_id (rank_id)
) comment '排行榜表';

CREATE TABLE rank_detail (
    id BIGINT PRIMARY KEY AUTO_INCREMENT comment '自增主键id',
    rank_id varchar(30) comment '排行榜id',
	user_id VARCHAR(32) NOT NULL comment '用户id',
	rank_level tinyint comment '排名(1,2,3...)',
	score_num int default 0 comment '得分数量(拉新数量/点赞数量/成交数量)',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP comment '修改时间',
	INDEX idx_rank_user (rank_id, user_id)
) comment '排行榜明细表';

3、定时任务2：每周日0点执行
获取最新排行榜，插入排行榜主表和排行榜明细表
发放积分奖励，记录积分变更明细

前三名获得额外积分奖励-阶梯奖励机制:
* 邀请5人: 额外500积分（可配置）
* 邀请20人: 额外2000积分（可配置）
* 邀请50人: 额外10000积分（可配置）