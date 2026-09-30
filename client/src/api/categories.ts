import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type { Category } from '@shared/api.interface';

export async function listCategories(): Promise<Category[]> {
  logger.info('[categories] list');
  const { data } = await axiosForBackend.get<Category[]>('/api/categories');
  return data;
}

export async function createCategory(
  payload: Omit<Category, 'id' | 'sortOrder'> & { sortOrder?: number },
): Promise<Category> {
  logger.info('[categories] create', payload.nameZh);
  const { data } = await axiosForBackend.post<Category>(
    '/api/categories',
    payload,
  );
  return data;
}

export async function updateCategory(
  id: string,
  payload: Partial<Category>,
): Promise<Category> {
  logger.info('[categories] update', id);
  const { data } = await axiosForBackend.patch<Category>(
    `/api/categories/${id}`,
    payload,
  );
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  logger.info('[categories] delete', id);
  await axiosForBackend.delete(`/api/categories/${id}`);
}
