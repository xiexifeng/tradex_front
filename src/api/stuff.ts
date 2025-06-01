import request from './request';
import type { ApiResponse } from './types';

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
