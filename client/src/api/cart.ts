import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { getSessionId } from '@/utils/session';
import type {
  CartResponse,
  AddCartRequest,
  UpdateCartRequest,
  CartRecoveryCodeResponse,
  CartImportCodeRequest,
} from '@shared/api.interface';

function cartHeaders(): Record<string, string> {
  return { 'x-session-id': getSessionId() };
}

export async function getCart(): Promise<CartResponse> {
  logger.info('[cart] get');
  const { data } = await axiosForBackend.get<CartResponse>('/api/cart', {
    headers: cartHeaders(),
  });
  return data;
}

export async function addToCart(
  productId: string,
  quantity: number,
): Promise<CartResponse> {
  logger.info('[cart] add', { productId, quantity });
  const body: AddCartRequest = { productId, quantity };
  const { data } = await axiosForBackend.post<CartResponse>(
    '/api/cart/items',
    body,
    { headers: cartHeaders() },
  );
  return data;
}

export async function updateCartItem(
  itemId: string,
  quantity: number,
): Promise<CartResponse> {
  logger.info('[cart] update', { itemId, quantity });
  const body: UpdateCartRequest = { quantity };
  const { data } = await axiosForBackend.patch<CartResponse>(
    `/api/cart/items/${itemId}`,
    body,
    { headers: cartHeaders() },
  );
  return data;
}

export async function removeCartItem(itemId: string): Promise<CartResponse> {
  logger.info('[cart] remove', itemId);
  const { data } = await axiosForBackend.delete<CartResponse>(
    `/api/cart/items/${itemId}`,
    { headers: cartHeaders() },
  );
  return data;
}

export async function exportRecoveryCode(): Promise<{ code: string }> {
  logger.info('[cart] export recovery code');
  const { data } = await axiosForBackend.get<CartRecoveryCodeResponse>(
    '/api/cart/export-code',
    { headers: cartHeaders() },
  );
  return data;
}

export async function importRecoveryCode(
  code: string,
): Promise<CartResponse> {
  logger.info('[cart] import recovery code', { code });
  const body: CartImportCodeRequest = { code };
  const { data } = await axiosForBackend.post<CartResponse>(
    '/api/cart/import-code',
    body,
    { headers: cartHeaders() },
  );
  return data;
}
