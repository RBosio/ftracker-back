import { Module } from "@nestjs/common"
import { SpentService } from "./spent.service"
import { SpentController } from "./spent.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Spent } from "src/entities/spent.entity"
import { UserModule } from "src/user/user.module"

@Module({
  imports: [TypeOrmModule.forFeature([Spent]), UserModule],
  controllers: [SpentController],
  providers: [SpentService],
})
export class SpentModule {}
