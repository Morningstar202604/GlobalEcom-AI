import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { getSessionId } from '@/utils/session';
import type {
  Order,
  OrderListResponse,
  OrderListParams,
  CreateOrderRequest,
  OrderStatusUpdateRequest,
} from '@shared/api.interface';

function buyerHeaders(): Record<string, string> {
  return { 'x-session-id': getSessionId() };
}

export async function createOrder(
  payload: CreateOrderRequest,
): Promise<Order> {
  logger.info('[orders] create');
  const { data } = await axiosForBackend.post<Order>('/api/orders', payload, {
    headers: buyerHeaders(),
  });
  return data;
}

export async function getBuyerOrders(
  params: OrderListParams = {},
): Promise<OrderListResponse> {
  logger.info('[orders] list', params);
  const { data } = await axiosForBackend.get<OrderListResponse>(
    '/api/orders/buyer',
    { params, headers: buyerHeaders() },
  );
  return data;
}

export async function getOrderDetail(id: string): Promise<Order> {
  logger.info('[orders] detail', id);
  const { data } = await axiosForBackend.get<Order>(`/api/orders/${id}`, {
    headers: buyerHeaders(),
  });
  return data;
}

export async function getSellerOrders(
  params: OrderListParams = {},
): Promise<OrderListResponse> {
  logger.info('[orders] seller list', params);
  const { data } = await axiosForBackend.get<OrderListResponse>(
    '/api/orders',
    { params },
  );
  return data;
}

export async function getSellerOrderDetail(id: string): Promise<Order> {
  logger.info('[orders] seller detail', id);
  const { data } = await axiosForBackend.get<Order>(
    `/api/orders/${id}`,
  );
  return data;
}

export async function updateOrderStatus(
  id: string,
  payload: OrderStatusUpdateRequest,
): Promise<Order> {
  logger.info('[orders] update status', id, payload.status);
  const { data } = await axiosForBackend.patch<Order>(
    `/api/orders/${id}/status`,
    payload,
  );
  return data;
}
