import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type {
  Product,
  ProductListParams,
  ProductListResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ImportProductsResponse,
} from '@shared/api.interface';

export async function listProducts(
  params: ProductListParams,
): Promise<ProductListResponse> {
  logger.info('[products] list', params);
  const { data } = await axiosForBackend.get<ProductListResponse>(
    '/api/products',
    { params },
  );
  return data;
}

export async function getProduct(id: string): Promise<Product> {
  logger.info('[products] detail', id);
  const { data } = await axiosForBackend.get<Product>(`/api/products/${id}`);
  return data;
}

export async function getFeaturedProducts(
  limit: number = 8,
): Promise<Product[]> {
  logger.info('[products] featured', limit);
  const { data } = await axiosForBackend.get<Product[]>(
    '/api/products/featured',
    { params: { limit } },
  );
  return data;
}

export async function createProduct(
  payload: CreateProductRequest,
): Promise<Product> {
  logger.info('[products] create', payload.sku);
  const { data } = await axiosForBackend.post<Product>(
    '/api/products',
    payload,
  );
  return data;
}

export async function updateProduct(
  id: string,
  payload: UpdateProductRequest,
): Promise<Product> {
  logger.info('[products] update', id);
  const { data } = await axiosForBackend.patch<Product>(
    `/api/products/${id}`,
    payload,
  );
  return data;
}

export async function deleteProduct(id: string): Promise<void> {
  logger.info('[products] delete', id);
  await axiosForBackend.delete(`/api/products/${id}`);
}

export async function updateProductStatus(
  id: string,
  status: 'draft' | 'active' | 'inactive',
): Promise<Product> {
  logger.info('[products] update status', id, status);
  return updateProduct(id, { status });
}

export async function importProducts(
  file: File,
): Promise<ImportProductsResponse> {
  logger.info('[products] import', file.name);
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await axiosForBackend.post<ImportProductsResponse>(
    '/api/products/import',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return data;
}

export function downloadImportTemplate(): string {
  return '/api/products/import-template';
}
