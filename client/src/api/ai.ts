import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import type {
  SupportChatRequest,
  SupportChatResponse,
  AIStatusResponse,
  AICopywriterRequest,
  AICopywriterResponse,
  AITranslationRequest,
  AITranslationResponse,
  AITrendReport,
  AISelectResponse,
  AIUsageStats,
  AIUsageStatsQuery,
} from '@shared/api.interface';

export async function supportChat(
  payload: SupportChatRequest,
): Promise<SupportChatResponse> {
  logger.info('[ai] support chat');
  const { data } = await axiosForBackend.post<SupportChatResponse>(
    '/api/ai/support/chat',
    payload,
  );
  return data;
}

export async function getAIStatus(): Promise<AIStatusResponse> {
  logger.info('[ai] status');
  const { data } =
    await axiosForBackend.get<AIStatusResponse>('/api/ai/status');
  return data;
}

export async function generateCopywriter(
  payload: AICopywriterRequest,
): Promise<AICopywriterResponse> {
  logger.info('[ai] copywriter', payload.productNameZh);
  const { data } = await axiosForBackend.post<AICopywriterResponse>(
    '/api/ai/copywriter',
    payload,
  );
  return data;
}

export async function translateText(
  payload: AITranslationRequest,
): Promise<AITranslationResponse> {
  logger.info('[ai] translate');
  const { data } = await axiosForBackend.post<AITranslationResponse>(
    '/api/ai/translate',
    payload,
  );
  return data;
}

export async function generateTrendReport(): Promise<AITrendReport> {
  logger.info('[ai] trend report');
  const { data } = await axiosForBackend.post<AITrendReport>(
    '/api/ai/trend/generate',
    {},
  );
  return data;
}

export async function generateSelectSuggestion(): Promise<AISelectResponse> {
  logger.info('[ai] select suggestion');
  const { data } = await axiosForBackend.post<AISelectResponse>(
    '/api/ai/select/generate',
    {},
  );
  return data;
}

export async function getUsageStats(
  params?: AIUsageStatsQuery,
): Promise<AIUsageStats> {
  logger.info('[ai] usage stats');
  const query = new URLSearchParams();
  if (params?.agent) query.set('agent', params.agent);
  if (params?.startDate) query.set('startDate', params.startDate);
  if (params?.endDate) query.set('endDate', params.endDate);
  const { data } = await axiosForBackend.get<AIUsageStats>(
    `/api/ai/usage-stats${query.toString() ? `?${query.toString()}` : ''}`,
  );
  return data;
}
