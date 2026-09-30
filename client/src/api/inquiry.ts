import { axiosForBackend } from '@lark-apaas/client-toolkit/utils/getAxiosForBackend';
import { logger } from '@lark-apaas/client-toolkit/logger';
import { getSessionId } from '@/utils/session';
import type {
  InquiryMessage,
  InquirySession,
  SendMessageRequest,
} from '@shared/api.interface';

export async function createInquirySession(): Promise<InquirySession> {
  logger.info('[inquiry] create session');
  const { data } = await axiosForBackend.post<InquirySession>(
    '/api/inquiry/sessions',
    { sessionId: getSessionId() },
  );
  return data;
}

export async function getInquiryMessages(
  sessionId: string,
): Promise<InquiryMessage[]> {
  logger.info('[inquiry] messages', sessionId);
  const { data } = await axiosForBackend.get<InquiryMessage[]>(
    `/api/inquiry/sessions/${sessionId}/messages`,
  );
  return data;
}

export async function sendInquiryMessage(
  sessionId: string,
  content: string,
): Promise<InquiryMessage> {
  logger.info('[inquiry] send', sessionId);
  const body: SendMessageRequest = { sessionId, content, role: 'user' };
  const { data } = await axiosForBackend.post<InquiryMessage>(
    `/api/inquiry/sessions/${sessionId}/messages`,
    body,
  );
  return data;
}

export async function getSellerSessionList(): Promise<InquirySession[]> {
  logger.info('[inquiry] seller sessions');
  const { data } = await axiosForBackend.get<InquirySession[]>(
    '/api/inquiry/sessions',
  );
  return data;
}

export async function getSellerMessageList(
  sessionId: string,
): Promise<InquiryMessage[]> {
  logger.info('[inquiry] seller messages', sessionId);
  const { data } = await axiosForBackend.get<InquiryMessage[]>(
    `/api/inquiry/sessions/${sessionId}/messages`,
  );
  return data;
}

export async function sendSellerMessage(
  sessionId: string,
  content: string,
): Promise<InquiryMessage> {
  logger.info('[inquiry] seller send', sessionId);
  const { data } = await axiosForBackend.post<InquiryMessage>(
    '/api/inquiry/messages',
    { sessionId, content, role: 'seller' },
  );
  return data;
}
