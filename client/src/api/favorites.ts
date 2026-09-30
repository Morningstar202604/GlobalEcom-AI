import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type { FavoriteProduct } from '@shared/api.interface';

export async function getMyFavorites(): Promise<FavoriteProduct[]> {
  logger.info('[favorites] list');
  const { data } = await axiosForBackend.get<FavoriteProduct[]>(
    '/api/favorites',
  );
  return data;
}

export async function toggleFavorite(
  productId: string,
): Promise<{ favorited: boolean; id?: string }> {
  logger.info('[favorites] toggle', productId);
  const { data } = await axiosForBackend.post<{ favorited: boolean; id?: string }>(
    `/api/favorites/${productId}`,
    {},
  );
  return data;
}

export async function checkFavoriteBatch(
  productIds: string[],
): Promise<string[]> {
  logger.info('[favorites] check batch', productIds.length);
  const { data } = await axiosForBackend.get<{ favoritedIds: string[] }>(
    `/api/favorites/check-batch?productIds=${productIds.join(',')}`,
  );
  return data.favoritedIds || [];
}

export async function checkFavorite(productId: string): Promise<{ favorited: boolean }> {
  logger.info('[favorites] check', productId);
  const { data } = await axiosForBackend.get<{ favorited: boolean }>(
    `/api/favorites/check/${productId}`,
  );
  return data;
}
