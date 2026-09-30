import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { getSessionId } from '@/utils/session';
import type { PayRequest, PayResponse, Payment } from '@shared/api.interface';

function buyerHeaders(): Record<string, string> {
  return { 'x-session-id': getSessionId() };
}

export async function payForOrder(body: PayRequest): Promise<PayResponse> {
  logger.info('[payments] pay', body.orderId, body.provider);
  const { data } = await axiosForBackend.post<PayResponse>(
    '/api/payments/pay',
    body,
    { headers: buyerHeaders() },
  );
  return data;
}

export async function getPaymentConfig(): Promise<{
  stripeConfigured: boolean;
  paypalConfigured: boolean;
  demoMode: boolean;
}> {
  logger.info('[payments] config');
  const { data } = await axiosForBackend.get<{
    stripeConfigured: boolean;
    paypalConfigured: boolean;
    demoMode: boolean;
  }>('/api/payments/config');
  return data;
}

export async function getPaymentsByOrder(orderId: string): Promise<Payment[]> {
  logger.info('[payments] by order', orderId);
  const { data } = await axiosForBackend.get<Payment[]>(
    `/api/payments/order/${orderId}`,
    { headers: buyerHeaders() },
  );
  return data;
}
