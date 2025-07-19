import request from './request';
import type { ApiResponse, Item, ItemDetail, ListSquareItemsParams, ListSquareItemsResponse, SquareItemDetail, TradeListItem, MyCanTradeItem, TradeOrderForPay, TradeDetail } from './types';

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
}): Promise<ApiResponse<Item[]>> => {
  return request.post('/client/item/list-mine', params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 查询我的可以交换的物品列表
export const getMyCanTradeItems = async (params: {
  pageNo: number;
  pageSize: number;
  itemTitle?: string;
}): Promise<ApiResponse<MyCanTradeItem[]>> => {
  return request.post('/client/item/list-my-can-trade-item', params, {
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

// 查询交易广场物品列表
export const listSquareItems = async (params: ListSquareItemsParams): Promise<ApiResponse> => {
  return request.post('/client/square/list-item', params, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

// 获取交易广场物品详情
export const getSquareItemDetail = async (itemId: string): Promise<ApiResponse<SquareItemDetail>> => {
  return request.post(`/client/square/detail-item/${itemId}`);
};

// 交易广场-发起交换申请
export const applySquareExchange = async (data: {
  itemId: string;
  fromUserId: string;
  swapItemId: string;
  contactInfo: {
    linkman: string;
    phone: string;
    address: string;
  };
}): Promise<ApiResponse> => {
  return request.post('/client/trade/transfer-apply', data, {
    headers: { 'Content-Type': 'application/json' }
  });
};

// 交易广场-创建支付单
export const createOrderForPay = async (data: {
  itemId: string;
  fromUserId: string;
  contactInfo: {
    linkman: string;
    phone: string;
    address: string;
  };
}): Promise<ApiResponse<TradeOrderForPay>> => {
  return request.post('/client/trade/create-pay', data, {
    headers: { 'Content-Type': 'application/json' }
  });
};

// 交易广场-确认支付
export const confirmPay = async (data: {
  itemId: string;
  tradeId: string;
  tradePassword: string;
  tradeMethod: string;
  tradePrice: number|null;
  tradePoints: number|null;
  paymentMethod: string|null;
}): Promise<ApiResponse> => {
  return request.post('/client/trade/confirm-pay', data, {
    headers: { 'Content-Type': 'application/json' }
  });
};

// 交易管理-查询
export const getTradeList = async (params: {
  pageNo: number;
  pageSize: number;
  tradeStatus?: string;
  tradeMethod?: string;
}): Promise<ApiResponse<TradeListItem[]>> => {
  return request.post('/client/trade/list-mine', params, {
    headers: { 'Content-Type': 'application/json' }
  });
};

export const getTradeDetail = async (tradeId: string): Promise<ApiResponse<TradeDetail>> => {
  return request.post(`/client/trade/${tradeId}`);
};

// 以物换物-卖方接受交易
export const acceptTransferApply = async (data: {
  tradeId: string;
}): Promise<ApiResponse> => {
  return request.post('/client/trade/accept-transfer-apply', data, {
    headers: { 'Content-Type': 'application/json' }
  });
};

// 以物换物-卖方拒绝交易
export const rejectTransferApply = async (data: {
  tradeId: string;
  rejectReason: string;
}): Promise<ApiResponse> => {
  return request.post('/client/trade/reject-transfer-apply', data, {
    headers: { 'Content-Type': 'application/json' }
  });
};

// 交易列表-交易完成，买方确认即可
export const completeTrade = async (data: {
  tradeId: string;
}): Promise<ApiResponse> => {
  return request.post('/client/trade/completed', data, {
    headers: { 'Content-Type': 'application/json' }
  });
};

// 交易广场-标记或取消物品的喜爱，查看，收藏
export const socialItem = async (data: {
  itemId: string;
  socialType: 'COLLECTION' | 'LOVE' | 'VIEW';
  socialOperate: 'ADD' | 'CANCEL';
}): Promise<ApiResponse> => {
  const formData = new URLSearchParams();
  formData.append('socialType', data.socialType);
  formData.append('socialOperate', data.socialOperate);
  
  return request.post(`/client/square/social-item/${data.itemId}`, formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });
};
