import request from './request';
import type { ApiResponse, LoginResponse, PointsAccount, PointsTransaction } from './types';

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
  }
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
