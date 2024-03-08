import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateExpensesDto } from "./dto/create-expenses.dto"
import { UpdateExpensesDto } from "./dto/update-expenses.dto"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Expenses } from "src/entities/expenses.entity"
import { UserService } from "src/user/user.service"

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expenses) private expensesRepository: Repository<Expenses>,
    private userService: UserService,
  ) {}

  async create(createExpensesDto: CreateExpensesDto): Promise<Expenses> {
    const expenses = this.expensesRepository.create(createExpensesDto)

    const user = await this.userService.findOne(createExpensesDto.userId)
    expenses.user = user

    return this.expensesRepository.save(expenses)
  }

  async findAll(userId: number): Promise<Expenses[]> {
    return this.expensesRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    })
  }

  async findOne(id: number): Promise<Expenses> {
    const expenses = await this.expensesRepository.findOne({
      where: {
        id,
      },
    })
    if (!expenses) throw new NotFoundException("expenses not found")

    return expenses
  }

  async update(id: number, updateExpensesDto: UpdateExpensesDto): Promise<Expenses> {
    const expenses = await this.findOne(id)

    const expensesUpdated = Object.assign(expenses, updateExpensesDto)

    return this.expensesRepository.save(expensesUpdated)
  }

  async remove(id: number): Promise<Expenses> {
    const expenses = await this.findOne(id)
    await this.expensesRepository.softDelete(id)

    return expenses
  }
}
