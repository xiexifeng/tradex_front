import request from './request';
import type { ApiResponse, LoginResponse, UserInfo, PointsAccount, PointsTransaction, TradeScoreTransaction } from './types';

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
      `phoneNumbers=${phone}`
    ).then(res => res.data);
  },

  // 注册
  register(data: {
    phone: string;
    password: string;
    gender?: string;
    birthday?: string;
    avatarUrl?: string;
    email?: string;
    inviteUserId?: string;
    inviteTime?: string;
  }): Promise<ApiResponse> {
    const params = new URLSearchParams();
    params.append('phoneNumbers', data.phone);
    params.append('password', data.password);
    if (data.gender) params.append('gender', data.gender);
    if (data.birthday) params.append('birthday', data.birthday);
    if (data.avatarUrl) params.append('avatarUrl', data.avatarUrl);
    if (data.email) params.append('email', data.email);
    if (data.inviteUserId) params.append('inviteUserId', data.inviteUserId);
    if (data.inviteTime) params.append('inviteTime', data.inviteTime);
    
    return request.post('/client/auth/register', params.toString());
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
  avatarUrl: string | null;
  inviteCount: number;
  rank: number;
}

export function getInviteRank(): Promise<ApiResponse<InviteRankItem[]>> {
  return request.get('/client/user/invite-rank');
}
