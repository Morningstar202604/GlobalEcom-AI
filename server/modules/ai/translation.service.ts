import { Injectable } from '@nestjs/common';
import { AiGatewayService } from './ai-gateway.service';
import type { AITranslationRequest, AITranslationResponse } from '@shared/api.interface';

@Injectable()
export class TranslationService {
  constructor(private readonly aiGateway: AiGatewayService) {}

  async translate(dto: AITranslationRequest, userId?: string): Promise<AITranslationResponse> {
    const sourceLang = dto.sourceLang ? this.getLangName(dto.sourceLang) : '自动检测';
    const targetLang = this.getLangName(dto.targetLang);

    const systemPrompt = '你是专业的多语言翻译专家，擅长跨境电商场景下的精准翻译。请直接输出翻译结果，不要添加任何解释或标记。';

    const userPrompt = `请将以下文本从${sourceLang}翻译为${targetLang}：

${dto.text}`;

    const { content } = await this.aiGateway.chat(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      { temperature: 0.3, maxTokens: 2000, agent: 'translation', userId },
    );

    return { translatedText: content.trim() };
  }

  private getLangName(code: string): string {
    const map: Record<string, string> = {
      zh: '中文',
      en: '英文',
      ja: '日文',
      ko: '韩文',
      fr: '法文',
      de: '德文',
      es: '西班牙文',
      pt: '葡萄牙文',
      it: '意大利文',
      ru: '俄文',
      ar: '阿拉伯文',
    };
    return map[code] || code;
  }
}
