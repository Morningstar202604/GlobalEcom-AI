import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type {
  Coupon,
  CouponListResponse,
  CreateCouponRequest,
  UpdateCouponRequest,
  ValidateCouponRequest,
  ValidateCouponResponse,
} from '@shared/api.interface';

export async function listCoupons(
  page = 1,
  pageSize = 20,
): Promise<CouponListResponse> {
  logger.info('[coupons] list');
  const { data } = await axiosForBackend.get<CouponListResponse>(
    `/api/coupons?page=${page}&pageSize=${pageSize}`,
  );
  return data;
}

export async function createCoupon(body: CreateCouponRequest): Promise<Coupon> {
  logger.info('[coupons] create');
  const { data } = await axiosForBackend.post<Coupon>(
    '/api/coupons',
    body,
  );
  return data;
}

export async function updateCoupon(
  id: string,
  body: UpdateCouponRequest,
): Promise<Coupon> {
  logger.info('[coupons] update', id);
  const { data } = await axiosForBackend.patch<Coupon>(
    `/api/coupons/${id}`,
    body,
  );
  return data;
}

export async function validateCoupon(
  body: ValidateCouponRequest,
): Promise<ValidateCouponResponse> {
  logger.info('[coupons] validate', body.code);
  const { data } = await axiosForBackend.post<ValidateCouponResponse>(
    '/api/coupons/validate',
    body,
  );
  return data;
}
