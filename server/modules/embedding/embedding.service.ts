import { Injectable, Inject, Logger } from '@nestjs/common';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { eq, and, sql } from 'drizzle-orm';
import { productEmbeddings } from '@server/database/schema';

export interface SimilarProduct {
  productId: string;
  similarity: number;
}

@Injectable()
export class EmbeddingService {
  private readonly logger = new Logger(EmbeddingService.name);
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly model: string;
  private readonly isConfigured: boolean;

  constructor(@Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase) {
    this.apiKey = process.env.EMBEDDING_API_KEY || '';
    this.baseUrl = process.env.EMBEDDING_BASE_URL || 'https://api.openai.com/v1';
    this.model = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
    this.isConfigured = Boolean(this.apiKey && this.baseUrl);
  }

  isReady(): boolean {
    return this.isConfigured;
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.isConfigured) {
      return null;
    }

    try {
      const response = await fetch(`${this.baseUrl}/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          input: text.slice(0, 8000), // token limit safeguard
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`Embedding API 调用失败: ${response.status} ${errorText}`);
        return null;
      }

      const data = await response.json() as {
        data: Array<{ embedding: number[] }>;
      };

      return data.data?.[0]?.embedding ?? null;
    } catch (error) {
      this.logger.error('生成 embedding 失败', error);
      return null;
    }
  }

  async upsertProductEmbedding(
    productId: string,
    text: string,
    language: string,
  ): Promise<void> {
    if (!this.isConfigured) {
      return;
    }

    const embedding = await this.generateEmbedding(text);
    if (!embedding) {
      return;
    }

    const embeddingStr = `[${embedding.join(',')}]`;

    try {
      const existing = await this.db
        .select({ id: productEmbeddings.id })
        .from(productEmbeddings)
        .where(and(
          eq(productEmbeddings.productId, productId),
          eq(productEmbeddings.language, language),
        ))
        .limit(1);

      if (existing.length > 0) {
        await this.db
          .update(productEmbeddings)
          .set({
            embedding: sql`${embeddingStr}::vector`,
            updatedAt: new Date(),
          })
          .where(eq(productEmbeddings.id, existing[0].id));
      } else {
        await this.db.insert(productEmbeddings).values({
          productId,
          language,
          embedding: sql`${embeddingStr}::vector` as unknown as string,
        });
      }
    } catch (error) {
      this.logger.error('Upsert product embedding 失败', error);
    }
  }

  async searchSimilarProducts(
    query: string,
    language: string,
    limit: number = 5,
  ): Promise<SimilarProduct[]> {
    if (!this.isConfigured) {
      return [];
    }

    const embedding = await this.generateEmbedding(query);
    if (!embedding) {
      return [];
    }

    const embeddingStr = `[${embedding.join(',')}]`;

    try {
      const rows = await this.db.execute(sql<{
        product_id: string;
        similarity: number;
      }>`
        SELECT
          product_id,
          1 - (embedding <=> ${embeddingStr}::vector) AS similarity
        FROM product_embeddings
        WHERE language = ${language}
        ORDER BY embedding <=> ${embeddingStr}::vector
        LIMIT ${limit}
      `);

      const results = rows as unknown as Array<{ product_id: string; similarity: number }>;

      return results.map((row) => ({
        productId: row.product_id,
        similarity: Number(row.similarity),
      }));
    } catch (error) {
      this.logger.error('向量相似性检索失败', error);
      return [];
    }
  }
}
