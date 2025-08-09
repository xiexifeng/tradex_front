import request from './request';
import type { ApiResponse, Notification } from './types';

export const notificationApi = {
    // 发送验证码
    listMyNotification(params: { pageNo: number; pageSize: number }) : Promise<ApiResponse<Notification[]>> {
        return request.post('/client/notification/list-mine', params, {
          headers: { 'Content-Type': 'application/json' }
        });
    }
  
}