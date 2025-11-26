import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropiService } from './dropi.service';
import { DropiController } from './dropi.controller';
import { Provider } from '@/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Provider])],
  controllers: [DropiController],
  providers: [DropiService],
  exports: [DropiService],
})
export class DropiModule {}
