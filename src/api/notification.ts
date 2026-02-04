import request from './request';
import type { ApiResponse, Notification } from './types';

export const notificationApi = {
    // 获取通知列表
    listMyNotification(params: { pageNo: number; pageSize: number; status?: number }) : Promise<ApiResponse<Notification[]>> {
        return request.post('/client/notification/list-mine', params, {
          headers: { 'Content-Type': 'application/json' }
        });
    },
    
    // 获取通知详情
    getNotificationDetail(notificationId: string) : Promise<ApiResponse<Notification>> {
        return request.get(`/client/notification/read/${notificationId}`, {
          headers: { 'Content-Type': 'application/json' }
        });
    }
  
}