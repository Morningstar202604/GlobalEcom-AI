import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from '@server/common/guards/roles.guard';
import type { DashboardData } from '@shared/api.interface';

@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @UseGuards(new RolesGuard(['seller', 'admin']))
  @Get('stats')
  async getStats(): Promise<DashboardData> {
    return this.dashboardService.getStats();
  }
}
