import request from './request';
import type { ApiResponse, Item, ItemDetail } from './types';

// 上传文件到 OSS
export const uploadFile = async (file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/basic/oss/uploadFile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// 发布物品
export const publishItem = async (data: {
  itemTitle: string;
  itemType: string;
  itemImageList: string[];
  itemDescription: string;
  depreciation: number;
}): Promise<ApiResponse> => {
  return request.post('/client/item/publish', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 查询我的物品列表
export const getMyItems = async (params: {
  pageNo: number;
  pageSize: number;
  status?: string;
  itemTitle?: string;
}): Promise<ApiResponse<Item[]>> => {
  return request.post('/client/item/list-mine', params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 获取物品详情
export const getItemDetail = async (itemId: string): Promise<ApiResponse<ItemDetail>> => {
  return request.post(`/client/item/detail/${itemId}`);
};

// 发起物品转让
export const transferItem = async (data: {
  itemId: string;
  tradeMethod: string;
  transferPrice: number;
  transferPoints: number;
  expectItem: string;
  contactInfo: string;
  deliveryMethod: string;
}): Promise<ApiResponse> => {
  return request.post('/client/item/transfer', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 取消物品转让
export const cancelTransfer = async (data: {
  itemId: string;
  cancelReason: string;
}): Promise<ApiResponse> => {
  return request.post('/client/item/cancel-transfer', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
