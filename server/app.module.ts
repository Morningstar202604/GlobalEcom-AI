import { APP_FILTER } from '@nestjs/core';
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PlatformModule } from '@lark-apaas/fullstack-nestjs-core';

import { GlobalExceptionFilter } from './common/filters/exception.filter';
import { CsrfHeaderMiddleware } from './common/middleware/csrf-header.middleware';
import { ViewModule } from './modules/view/view.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartModule } from './modules/cart/cart.module';
import { InquiryModule } from './modules/inquiry/inquiry.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AiModule } from './modules/ai/ai.module';
import { AuthModule } from './modules/auth/auth.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { FavoritesModule } from './modules/favorites/favorites.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { LogisticsModule } from './modules/logistics/logistics.module';
import { EmbeddingModule } from './modules/embedding/embedding.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    // 平台 Module，提供平台能力
    PlatformModule.forRoot(),
    // ====== @route-section: business-modules START ======
    // Place all business modules here.Do NOT add fallback modules here.
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    CartModule,
    InquiryModule,
    DashboardModule,
    AiModule,
    AuthModule,
    PaymentsModule,
    ReviewsModule,
    FavoritesModule,
    CouponsModule,
    LogisticsModule,
    EmbeddingModule,
    AuditModule,
    // ====== @route-section: business-modules END ======

    // ⚠️ @route-order: last
    // ViewModule is the fallback route module, must be registered last.
    ViewModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(CsrfHeaderMiddleware)
      .forRoutes(
        { path: 'api/products', method: RequestMethod.ALL },
        { path: 'api/products/*', method: RequestMethod.ALL },
        { path: 'api/products/manage', method: RequestMethod.ALL },
        { path: 'api/products/manage/*', method: RequestMethod.ALL },
        { path: 'api/products/import-template', method: RequestMethod.ALL },
        { path: 'api/products/batch-import', method: RequestMethod.ALL },
        { path: 'api/products/featured', method: RequestMethod.ALL },
        { path: 'api/products/search', method: RequestMethod.ALL },
        { path: 'api/categories', method: RequestMethod.ALL },
        { path: 'api/categories/*', method: RequestMethod.ALL },
        { path: 'api/orders', method: RequestMethod.ALL },
        { path: 'api/orders/*', method: RequestMethod.ALL },
        { path: 'api/orders/seller', method: RequestMethod.ALL },
        { path: 'api/orders/seller/*', method: RequestMethod.ALL },
        { path: 'api/orders/:id/status', method: RequestMethod.ALL },
        { path: 'api/cart/items', method: RequestMethod.ALL },
        { path: 'api/cart/items/*', method: RequestMethod.ALL },
        { path: 'api/cart/export-code', method: RequestMethod.ALL },
        { path: 'api/cart/import-code', method: RequestMethod.ALL },
        { path: 'api/auth/register', method: RequestMethod.ALL },
        { path: 'api/auth/login', method: RequestMethod.ALL },
        { path: 'api/auth/logout', method: RequestMethod.ALL },
        { path: 'api/auth/me', method: RequestMethod.ALL },
        { path: 'api/auth/google', method: RequestMethod.ALL },
        { path: 'api/auth/google/callback', method: RequestMethod.ALL },
        { path: 'api/payments/*', method: RequestMethod.ALL },
        { path: 'api/payments/*/pay', method: RequestMethod.ALL },
        { path: 'api/payments/stripe/webhook', method: RequestMethod.ALL },
        { path: 'api/payments/paypal/webhook', method: RequestMethod.ALL },
        { path: 'api/reviews', method: RequestMethod.ALL },
        { path: 'api/reviews/*', method: RequestMethod.ALL },
        { path: 'api/favorites', method: RequestMethod.ALL },
        { path: 'api/favorites/*', method: RequestMethod.ALL },
        { path: 'api/coupons', method: RequestMethod.ALL },
        { path: 'api/coupons/*', method: RequestMethod.ALL },
        { path: 'api/coupons/validate', method: RequestMethod.ALL },
        { path: 'api/logistics', method: RequestMethod.ALL },
        { path: 'api/logistics/*', method: RequestMethod.ALL },
        { path: 'api/logistics/track', method: RequestMethod.ALL },
        { path: 'api/dashboard/stats', method: RequestMethod.ALL },
        { path: 'api/dashboard/trends', method: RequestMethod.ALL },
        { path: 'api/ai/status', method: RequestMethod.ALL },
        { path: 'api/ai/generate', method: RequestMethod.ALL },
        { path: 'api/ai/analyze', method: RequestMethod.ALL },
        { path: 'api/ai/translate', method: RequestMethod.ALL },
        { path: 'api/ai/support', method: RequestMethod.ALL },
        { path: 'api/ai/reports', method: RequestMethod.ALL },
        { path: 'api/ai/reports/*', method: RequestMethod.ALL },
        { path: 'api/inquiry/sessions', method: RequestMethod.ALL },
        { path: 'api/inquiry/sessions/*', method: RequestMethod.ALL },
        { path: 'api/inquiry/messages', method: RequestMethod.ALL },
        { path: 'api/inquiry/messages/*', method: RequestMethod.ALL },
        { path: 'api/embedding/generate', method: RequestMethod.ALL },
        { path: 'api/embedding/search', method: RequestMethod.ALL },
        { path: 'api/audit-logs', method: RequestMethod.ALL },
      );
  }
}
