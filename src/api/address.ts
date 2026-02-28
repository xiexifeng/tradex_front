import request from './request';
import type { ApiResponse, ReceiveAddress } from './types';

export const addressApi = {
  // 地址列表
  listReceiveAddress() {
    return request.get<ApiResponse<ReceiveAddress[]>>(
      '/client/user/receive-address/list'
    );
  },

  // 新增地址
  addReceiveAddress(data: {
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    isDefault: boolean;
  }): Promise<ApiResponse> {
    return request.post('/client/user/receive-address/add', data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // 更新地址
  updateReceiveAddress(data: {
    id: string;
    recipientName: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    address: string;
    isDefault: boolean;
  }): Promise<ApiResponse> {
    return request.post('/client/user/receive-address/update', data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },

  // 删除地址
  deleteReceiveAddress(id: string): Promise<ApiResponse> {
    return request.post(`/client/user/receive-address/delete/${id}`);
  }
};

