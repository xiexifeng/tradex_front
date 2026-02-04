import request from './request';
import type { ApiResponse, LoginResponse, UserInfo, PointsAccount, PointsTransaction, TradeScoreTransaction, LoginRewardDayItem } from './types';

export const userApi = {
  // 发送验证码
  sendSms(phone: string) {
    return request.post<ApiResponse>('/client/auth/send-sms', `phoneNumbers=${phone}`);
  },

  // 验证码登录
  loginByCode(phone: string, code: string) {
    return request.post<ApiResponse<LoginResponse>>(
      '/client/auth/login-or-register',
      `phoneNumbers=${phone}&verifyCode=${code}`
    );
  },

  // 密码登录
  loginByPassword(username: string, password: string) {
    return request.post<ApiResponse<LoginResponse>>(
      '/client/auth/login',
      `username=${username}&password=${password}`
    );
  },

  // 编辑用户资料
  updateUserProfile(data: {
    nickname?: string;
    gender?: string;
    birthday?: string | null;
    avatarUrl?: string | null;
    address?: string | null;
    wechat?: string | null;
    qq?: string | null;
    brief?: string | null;
  }): Promise<ApiResponse> {
    return request.post('/client/user/update', data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // 刷新用户信息
  refreshUserInfo() {
    return request.get<ApiResponse<UserInfo>>(
      '/client/user/get'
    ).then(res => {
      return res.data as unknown as UserInfo;
    }).catch(error => {
      console.error('刷新用户信息失败:', error);
      return Promise.reject(error);
    });
  },

  // 验证手机号是否已注册
  verifyPhone(phone: string) {
    return request.post<ApiResponse<boolean>>(
      '/client/auth/verify-phone',
      `phoneNo=${phone}`
    ).then(res => res.data);
  },

  // 注册
  register(data: {
    phone: string;
    verfiyCode: string;
    nickName?: string;
    password: string;
    gender?: string;
    birthday?: string;
    avatarUrl?: string;
    brief?: string;
    email?: string;
    inviteUserId?: string;
    inviteTime?: number;
  }): Promise<ApiResponse<boolean>> {
    return request.post('/client/auth/register', data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },
};

// 查询积分余额
export function getPointsAccount(): Promise<ApiResponse<PointsAccount>> {
  return request.get('/client/user/points-account');
}

// 查询积分交易记录
export function getPointsTransactions(params: { pageNo: number; pageSize: number }): Promise<ApiResponse<PointsTransaction[]>> {
  return request.post('/client/user/points-account/list-transaction', params, {
    headers: { 'Content-Type': 'application/json' }
  });
}

// 查询信用评分记录
export function getTradeScoreTransactions(params: { pageNo: number; pageSize: number }): Promise<ApiResponse<TradeScoreTransaction[]>> {
  return request.post('/client/trade/list-mine-score', params, {
    headers: { 'Content-Type': 'application/json' }
  });
}

// 拉新排行榜
export interface InviteRankItem {
  userId: string;
  nickname: string;
  inviteCount: number;
  rank: number;
}

export function getInviteRank(): Promise<ApiResponse<InviteRankItem[]>> {
  return request.get('/client/rank/invite-list');
}

// 上一期榜单（上一榜单排名数据）
export interface LatestRankUser {
  userId: string | null;
  nickname: string | null;
  inviteCount: number;
  rank: number;
}

export interface LatestRankData {
  rankId: string;
  rankType: number;
  beginTime: number;
  endTime: number;
  rankUsers: LatestRankUser[];
}

export function getLatestRank(): Promise<ApiResponse<LatestRankData>> {
  return request.get('/client/rank/latest-rank');
}

// 每日登录奖励 - 当月列表
export function getLoginRewardMonthList(userId: string): Promise<ApiResponse<LoginRewardDayItem[]>> {
  return request.get('/client/user/login-reward/month-list', { params: { userId } });
}

// 每日登录奖励 - 领取
export function receiveLoginReward(data: { userId: string; loginDate: string; rewardPoint: number }): Promise<ApiResponse<void>> {
  return request.post('/client/user/login-reward/receive', data, {
    headers: { 'Content-Type': 'application/json' }
  });
}
