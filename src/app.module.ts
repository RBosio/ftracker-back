import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from "@nestjs/config"
import { UserModule } from "./user/user.module"
import { ExpensesModule } from "./expenses/expenses.module"
import { AuthModule } from "./auth/auth.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      host: "db",
      type: "mysql",
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      port: 3306,
      entities: [__dirname + "/entities/*.entity{.ts,.js}"],
      synchronize: true,
    }),
    UserModule,
    ExpensesModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
