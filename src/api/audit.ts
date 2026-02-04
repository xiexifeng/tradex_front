import request from './request';
import type { ApiResponse, SubmitAuditResultReq, AuditItemDetailCO } from './types';

// 提交审核结果
export const submitAuditResult = async (data: SubmitAuditResultReq): Promise<ApiResponse> => {
  return request.post('/client/item-audit', data, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 获取审核任务的物品详情
export const getItemDetailForAudit = async (taskId: string, itemId: string): Promise<ApiResponse<AuditItemDetailCO>> => {
  return request.post(`/client/item-audit/${taskId}/${itemId}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};