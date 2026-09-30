import { Injectable, Inject, Logger } from '@nestjs/common';
import { DRIZZLE_DATABASE, type PostgresJsDatabase } from '@lark-apaas/fullstack-nestjs-core';
import { eq, and, desc, count, gte, lt } from 'drizzle-orm';

import { auditLogs } from '@server/database/schema';
import type { AuditLog, AuditLogListResponse, AuditLogQuery } from '@shared/api.interface';

export interface AuditLogParams {
  action: string;
  targetType?: string;
  targetId?: string;
  beforeValue?: Record<string, unknown>;
  afterValue?: Record<string, unknown>;
  actorUserId?: string;
  actorRole?: string;
  ip?: string;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(@Inject(DRIZZLE_DATABASE) private readonly db: PostgresJsDatabase) {}

  private mapRow(row: typeof auditLogs.$inferSelect): AuditLog {
    return {
      id: row.id,
      actorUserId: row.actorUserId ?? undefined,
      actorRole: row.actorRole ?? undefined,
      action: row.action,
      targetType: row.targetType ?? undefined,
      targetId: row.targetId ?? undefined,
      beforeValue: (row.beforeValue as Record<string, unknown> | null) ?? undefined,
      afterValue: (row.afterValue as Record<string, unknown> | null) ?? undefined,
      ip: row.ip ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async log(params: AuditLogParams): Promise<void> {
    try {
      await this.db.insert(auditLogs).values({
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        beforeValue: params.beforeValue as Record<string, unknown> | undefined,
        afterValue: params.afterValue as Record<string, unknown> | undefined,
        actorUserId: params.actorUserId,
        actorRole: params.actorRole,
        ip: params.ip,
      });
    } catch (error) {
      this.logger.error(
        `Failed to write audit log: action=${params.action} target=${params.targetType}/${params.targetId}`,
        error instanceof Error ? error.stack : String(error),
      );
    }
  }

  async getAuditLogs(params: AuditLogQuery & { actorUserId?: string }): Promise<AuditLogListResponse> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const safePage = Math.max(1, page);
    const safePageSize = Math.min(100, Math.max(1, pageSize));
    const offset = (safePage - 1) * safePageSize;

    const conditions = [];
    if (params.action) {
      conditions.push(eq(auditLogs.action, params.action));
    }
    if (params.startDate) {
      conditions.push(gte(auditLogs.createdAt, new Date(params.startDate)));
    }
    if (params.endDate) {
      conditions.push(lt(auditLogs.createdAt, new Date(params.endDate)));
    }
    if (params.actorUserId) {
      conditions.push(eq(auditLogs.actorUserId, params.actorUserId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [countResult, rows] = await Promise.all([
      this.db.select({ count: count() }).from(auditLogs).where(whereClause),
      this.db
        .select()
        .from(auditLogs)
        .where(whereClause)
        .orderBy(desc(auditLogs.createdAt))
        .limit(safePageSize)
        .offset(offset),
    ]);

    const total = Number(countResult[0]?.count ?? 0);
    const items = rows.map((row: typeof auditLogs.$inferSelect) => this.mapRow(row));

    return { items, total, page: safePage, pageSize: safePageSize };
  }
}
