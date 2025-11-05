import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { AuthModule } from "../auth/auth.module";
import { OrdersService } from "./orders.service";

@Module({
  imports: [AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
