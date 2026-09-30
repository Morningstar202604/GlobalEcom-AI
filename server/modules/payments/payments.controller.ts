import {
  Controller,
  Post,
  Get,
  Body,
  Req,
  Param,
  BadRequestException,
  Logger,
  Headers,
} from '@nestjs/common';
import type { Request } from 'express';

import { PaymentsService } from './payments.service';
import { ForbiddenException } from '@nestjs/common';
import type { PayRequest, PayResponse, Payment } from '@shared/api.interface';

@Controller('api/payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(private readonly paymentsService: PaymentsService) {}

  private getSessionId(req: Request): string | undefined {
    const raw = req.headers['x-session-id'];
    const sessionId = Array.isArray(raw) ? raw[0] : raw;
    if (sessionId && typeof sessionId === 'string' && sessionId.trim().length > 0) {
      return sessionId.trim();
    }
    return undefined;
  }

  private getClientIp(req: Request): string {
    const xff = req.headers['x-forwarded-for'];
    if (typeof xff === 'string' && xff) {
      return xff.split(',')[0].trim();
    }
    const ip = req.socket?.remoteAddress;
    return ip || 'unknown';
  }

  @Post('pay')
  async pay(@Req() req: Request, @Body() body: PayRequest): Promise<PayResponse> {
    if (!body.orderId) {
      throw new BadRequestException('缺少订单ID');
    }
    if (!body.provider) {
      throw new BadRequestException('缺少支付方式');
    }
    const userId = req.user?.id;
    const sessionId = this.getSessionId(req);
    const ip = this.getClientIp(req);
    if (!userId && !sessionId) {
      throw new ForbiddenException('请先登录或初始化会话');
    }
    return this.paymentsService.pay(body.orderId, body.provider, userId, sessionId, { ip });
  }

  @Get('config')
  async getConfig(): Promise<{
    stripeConfigured: boolean;
    paypalConfigured: boolean;
    demoMode: boolean;
  }> {
    return this.paymentsService.getPaymentConfig();
  }

  @Post('paypal-webhook')
  async handlePayPalWebhook(
    @Req() req: Request,
    @Headers() headers: Record<string, string>,
    @Body() body: any,
  ): Promise<{ received: boolean }> {
    const result = await this.paymentsService.handlePayPalWebhook(headers, body);
    if (!result) {
      throw new BadRequestException('无效的 PayPal webhook 请求');
    }
    return { received: true };
  }

  @Get('order/:orderId')
  async getPaymentsByOrder(
    @Req() req: Request,
    @Param('orderId') orderId: string,
  ): Promise<Payment[]> {
    const userId = req.user?.id;
    const sessionId = this.getSessionId(req);
    const isSeller = !!req.user && ['seller', 'admin'].includes(req.user.role);
    return this.paymentsService.getPaymentsByOrder(orderId, userId, sessionId, isSeller);
  }
}
