import { MiddlewareConsumer, Module, NestModule, RequestMethod, Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthMiddleware } from '@server/common/middleware/jwt-auth.middleware';

const isProd = process.env.NODE_ENV === 'production';
const DEFAULT_DEV_SECRET = 'globalecom-dev-jwt-secret-change-in-production';

function resolveJwtSecret(): string {
  const envSecret = process.env.JWT_SECRET;
  if (envSecret && envSecret.length >= 32) {
    return envSecret;
  }
  if (isProd) {
    throw new Error(
      'FATAL: JWT_SECRET environment variable is required in production and must be at least 32 characters. Refusing to start.',
    );
  }
  const logger = new Logger('AuthModule');
  if (!envSecret) {
    logger.warn(
      '⚠️  JWT_SECRET not set, using insecure dev default. This is ONLY acceptable in development. Set JWT_SECRET before deploying to production.',
    );
  } else {
    logger.warn(
      '⚠️  JWT_SECRET is too short (less than 32 chars). Using dev default for development only.',
    );
  }
  return DEFAULT_DEV_SECRET;
}

const JWT_SECRET = resolveJwtSecret();

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule implements NestModule {
  constructor() {
    const logger = new Logger('AuthModule');
    if (isProd) {
      logger.log('JWT_SECRET loaded for production.');
    }
  }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(JwtAuthMiddleware)
      .forRoutes(
        { path: 'api/auth/me', method: RequestMethod.ALL },
        { path: 'api/auth/refresh', method: RequestMethod.ALL },
        { path: 'api/auth/merge-cart', method: RequestMethod.ALL },
        { path: 'api/auth/logout', method: RequestMethod.ALL },
        { path: 'api/cart', method: RequestMethod.ALL },
        { path: 'api/cart/items', method: RequestMethod.ALL },
        { path: 'api/cart/items/:id', method: RequestMethod.ALL },
        { path: 'api/cart/export-code', method: RequestMethod.ALL },
        { path: 'api/cart/import-code', method: RequestMethod.ALL },
        { path: 'api/orders', method: RequestMethod.ALL },
        { path: 'api/orders/seller', method: RequestMethod.ALL },
        { path: 'api/orders/seller/:id', method: RequestMethod.ALL },
        { path: 'api/orders/:id', method: RequestMethod.ALL },
        { path: 'api/orders/:id/status', method: RequestMethod.ALL },
        { path: 'api/orders/:id/cancel', method: RequestMethod.ALL },
        { path: 'api/dashboard/stats', method: RequestMethod.ALL },
        { path: 'api/products/manage', method: RequestMethod.ALL },
        { path: 'api/products/import', method: RequestMethod.ALL },
        { path: 'api/products/import-template', method: RequestMethod.ALL },
        { path: 'api/products/featured', method: RequestMethod.ALL },
        { path: 'api/products', method: RequestMethod.POST },
        { path: 'api/products/:id', method: RequestMethod.PATCH },
        { path: 'api/products/:id', method: RequestMethod.DELETE },
        { path: 'api/products/:id/status', method: RequestMethod.ALL },
        { path: 'api/products/:id/reviews', method: RequestMethod.ALL },
        { path: 'api/inquiry/sessions', method: RequestMethod.ALL },
        { path: 'api/inquiry/sessions/:id', method: RequestMethod.ALL },
        { path: 'api/inquiry/sessions/:id/messages', method: RequestMethod.ALL },
        { path: 'api/inquiry/assign', method: RequestMethod.ALL },
        { path: 'api/ai/copywriter', method: RequestMethod.ALL },
        { path: 'api/ai/support', method: RequestMethod.ALL },
        { path: 'api/ai/trend', method: RequestMethod.ALL },
        { path: 'api/ai/select', method: RequestMethod.ALL },
        { path: 'api/ai/translation', method: RequestMethod.ALL },
        { path: 'api/ai/status', method: RequestMethod.ALL },
        { path: 'api/categories', method: RequestMethod.POST },
        { path: 'api/categories/:id', method: RequestMethod.PATCH },
        { path: 'api/categories/:id', method: RequestMethod.DELETE },
        { path: 'api/favorites', method: RequestMethod.ALL },
        { path: 'api/favorites/:productId', method: RequestMethod.ALL },
        { path: 'api/coupons', method: RequestMethod.ALL },
        { path: 'api/coupons/:id', method: RequestMethod.ALL },
        { path: 'api/coupons/validate', method: RequestMethod.ALL },
        { path: 'api/logistics', method: RequestMethod.ALL },
        { path: 'api/logistics/:id', method: RequestMethod.ALL },
        { path: 'api/payments', method: RequestMethod.ALL },
        { path: 'api/payments/pay', method: RequestMethod.ALL },
        { path: 'api/payments/:id', method: RequestMethod.ALL },
        { path: 'api/audit-logs', method: RequestMethod.ALL },
        { path: 'api/audit-logs/:id', method: RequestMethod.ALL },
      );
  }
}
