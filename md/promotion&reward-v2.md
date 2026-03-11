V2：每日登录奖励和每日任务奖励

一、每日登录奖励
1、登录日历：日历上显示奖励积分数，每连续10天额外赠送5积分，每月满勤额外赠送10积分
为增强用户参与感，引导用户进入任务中心，使用手动领取登录奖励方式，登录但不领取算连续登录但是当天积分就没了
界面设计：
首页和个人中心都有每日登录奖励和每日任务入口（分别满足不同操作习惯的用户，增加便利性），每日登录和每日任务在一个页面

2、登录奖励处理逻辑
a、登录成功后：插入user_login_reward，先获取昨天的登录奖励记录，取不到的话连续登录天数=1，取到的话连续登录天数=昨天的连续天数+1；奖励状态初始为0
    移动端免登录怎么办？
    页面首次加载完的时候调用登录奖励接口，将首次登录标识存储到客户端缓存里，下次加载进来后不需要再次发起请求
b、用户点击领取积分：调用登录奖励接口做幂等校验，先判断是否存在当天的user_login_reward记录，如果已经存在且奖励状态=0，则更新奖励状态=1；奖励状态=1，忽略；不存在则插入记录，奖励状态=1
c、每日0点将奖励状态=0的更新为2
d、登录日历显示逻辑：按用户id查出当月用户所有user_login_reward记录
    1）不存在的日期是未登录状态
    2）存在但奖励状态未领取：一般是当天，显示未领取，可以点击领取
    3）存在但奖励状态已领取：显示领取，不可点击领取
    4）存在但奖励状态已过期：显示过期

3、后续功能扩展：
增加登录奖励积分未领取通知提醒
增加节假日登录奖励机制，比如节假日双倍

4、表结构
-- 用户登录奖励记录表
CREATE TABLE user_login_reward (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    user_id VARCHAR(50) NOT NULL COMMENT '用户ID',
    login_date VARCHAR(10) NOT NULL COMMENT '登录日期（yyyymmdd）',
    continuous_days INT NOT NULL COMMENT '连续登录天数',
    reward_point INT NOT NULL COMMENT '奖励积分',
    reward_status TINYINT NOT NULL DEFAULT 0 COMMENT '奖励状态：0未领取，1已领取，2已过期',
    received_time DATETIME COMMENT '领取时间',
    ip VARCHAR(50) COMMENT '领取IP',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    UNIQUE KEY uk_user_date(user_id, login_date),
    INDEX idx_user_status(user_id, reward_status, login_date)
) comment '用户登录奖励记录表';


二、每日任务
1、每日完成当日任务可领取对应积分，任务有每日、每周等类型
每完成一次记录一条用户任务记录表user_task_record，未完成不记录，比如一个任务需要点赞3次，点赞第一次的时候生成记录，后面每赞一次更新进度，完成次数/目标次数即任务完成进度
任务状态及奖励触发时机：
用户完成后实时触发，比如点赞、发布物品后触发任务判定及奖励逻辑，目前单机环境只能放在各个业务逻辑里，以后应该独立出消息来异步处理

2、任务判定逻辑
任务完成后判断用户当前任务记录表的完成情况：
1）查到记录且已完成：退出
2）查到记录但是未完成：更新任务，判断完成次数，如果达到目标次数则更新完成次数+1、发放积分奖励；如果未达到次数，仅更新完成次数+1
3）未查到记录：插入记录，判断完成次数，如果达到目标次数则更新完成次数+1、发放积分奖励；如果未达到次数，仅更新完成次数+1

3、任务配置
前期任务规则不需要太复杂，也不要太难，只要用户花时间精力就可以完成；
任务也不需要频繁变更，暂时不需要专门的管理后台来配置，通过直接更改task_config表记录的方式进行配置

4、表结构
CREATE TABLE task_config (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    task_code VARCHAR(50) UNIQUE NOT NULL COMMENT '任务编码',
    task_name VARCHAR(100) NOT NULL COMMENT '任务名称',
    task_desc VARCHAR(255) COMMENT '任务描述',
    task_period TINYINT NOT NULL DEFAULT 1 COMMENT '任务周期：1-每日，2-每周，3-节假日',
	task_type TINYINT NOT NULL DEFAULT 1 COMMENT '任务类型：1-点赞，2-发布物品，3-评价，4-分享',
    priority INT DEFAULT 0 COMMENT '显示优先级',
    target_num INT DEFAULT 1 COMMENT '目标次数',
    effect_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '生效时间',
	end_time TIMESTAMP COMMENT '截止时间',
    reward_point INT NOT NULL DEFAULT 0 COMMENT '奖励积分',
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
	UNIQUE KEY uk_task_code (task_code),
    INDEX idx_period_type (task_period, task_type, priority),
    INDEX idx_active_time (effect_time, end_time)
) COMMENT = '任务配置表';


CREATE TABLE user_task_record (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    task_code VARCHAR(50) NOT NULL COMMENT '任务编码',
    finish_num INT DEFAULT 0 COMMENT '完成次数',
    target_num INT DEFAULT 1 COMMENT '目标次数',
    task_state TINYINT NOT NULL DEFAULT 1 COMMENT '任务状态：1-进行中，2-已完成，3-过期',
    is_received TINYINT DEFAULT 0 COMMENT '奖励是否领取：0-未领取，1-已领取',
    complete_time DATETIME COMMENT '完成时间',
    task_data VARCHAR(500) COMMENT '任务完成数据',
    UNIQUE KEY uk_user_task_date (user_id, task_code, DATE(complete_time)),
    INDEX idx_user_status (user_id, task_state)
) COMMENT = '用户任务记录表';

