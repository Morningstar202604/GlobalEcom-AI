import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type {
  LogisticsTracking,
  CreateLogisticsRequest,
} from '@shared/api.interface';

export async function getLogistics(
  orderId: string,
): Promise<LogisticsTracking> {
  logger.info('[logistics] get', orderId);
  const { data } = await axiosForBackend.get<LogisticsTracking>(
    `/api/logistics/${orderId}`,
  );
  return data;
}

export async function createLogistics(
  payload: CreateLogisticsRequest,
): Promise<LogisticsTracking> {
  logger.info('[logistics] create', payload.orderId, payload.carrier);
  const { data } = await axiosForBackend.post<LogisticsTracking>(
    '/api/logistics',
    payload,
  );
  return data;
}
