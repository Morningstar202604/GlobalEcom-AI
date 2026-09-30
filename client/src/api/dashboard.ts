import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type { DashboardData } from '@shared/api.interface';

export const getDashboardStats = async (): Promise<DashboardData> => {
  logger.info('获取看板统计数据');
  const { data } = await axiosForBackend.get<DashboardData>(
    '/api/dashboard/stats',
  );
  return data;
};
