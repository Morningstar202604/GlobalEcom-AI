import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type {
  ProductReview,
  ProductReviewsResponse,
  CreateReviewRequest,
} from '@shared/api.interface';

export async function getProductReviews(
  productId: string,
): Promise<ProductReviewsResponse> {
  logger.info('[reviews] list', productId);
  const { data } = await axiosForBackend.get<ProductReviewsResponse>(
    `/api/products/${productId}/reviews`,
  );
  return data;
}

export async function getMyReview(
  productId: string,
): Promise<{ review: ProductReview | null; hasPurchased: boolean }> {
  logger.info('[reviews] my', productId);
  const { data } = await axiosForBackend.get<{
    review: ProductReview | null;
    hasPurchased: boolean;
  }>(`/api/products/${productId}/reviews/my`);
  return data;
}

export async function createReview(
  productId: string,
  body: CreateReviewRequest,
): Promise<ProductReview> {
  logger.info('[reviews] create', productId);
  const { data } = await axiosForBackend.post<ProductReview>(
    `/api/products/${productId}/reviews`,
    body,
  );
  return data;
}
