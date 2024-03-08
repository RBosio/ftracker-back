import { Module } from "@nestjs/common"
import { ExpensesService } from "./expenses.service"
import { ExpensesController } from "./expenses.controller"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Expenses } from "src/entities/expenses.entity"
import { UserModule } from "src/user/user.module"

@Module({
  imports: [TypeOrmModule.forFeature([Expenses]), UserModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
