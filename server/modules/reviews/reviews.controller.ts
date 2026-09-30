import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Param,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import type { Request } from 'express';

import { RolesGuard } from '@server/common/guards/roles.guard';
import { ReviewsService } from './reviews.service';
import type {
  ProductReview,
  ProductReviewsResponse,
  CreateReviewRequest,
} from '@shared/api.interface';

@Controller('api/products')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':id/reviews')
  async getReviews(@Param('id') productId: string): Promise<ProductReviewsResponse> {
    return this.reviewsService.getProductReviews(productId);
  }

  @Get(':id/reviews/my')
  async getMyReview(
    @Req() req: Request,
    @Param('id') productId: string,
  ): Promise<{ review: ProductReview | null; hasPurchased: boolean }> {
    const userId = req.user?.id;
    const review = await this.reviewsService.getUserReviewForProduct(productId, userId);
    const hasPurchased = await this.reviewsService.hasPurchased(productId, userId);
    return { review, hasPurchased };
  }

  @Post(':id/reviews')
  @UseGuards(new RolesGuard(['buyer']))
  async createReview(
    @Req() req: Request,
    @Param('id') productId: string,
    @Body() body: CreateReviewRequest,
  ): Promise<ProductReview> {
    const userId = req.user?.id;
    if (!userId) throw new BadRequestException('请先登录后评价');
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      throw new BadRequestException('评分必须在 1-5 之间');
    }
    return this.reviewsService.createReview(productId, userId, body);
  }
}
