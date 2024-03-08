import { Injectable, NotFoundException } from "@nestjs/common"
import { CreateSpentDto } from "./dto/create-spent.dto"
import { UpdateSpentDto } from "./dto/update-spent.dto"
import { Repository } from "typeorm"
import { Spent } from "src/entities/spent.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { UserService } from "src/user/user.service"

@Injectable()
export class SpentService {
  constructor(
    @InjectRepository(Spent) private spentRepository: Repository<Spent>,
    private userService: UserService,
  ) {}

  async create(createSpentDto: CreateSpentDto): Promise<Spent> {
    const spent = this.spentRepository.create(createSpentDto)

    const user = await this.userService.findOne(createSpentDto.userId)
    spent.user = user

    return this.spentRepository.save(spent)
  }

  async findAll(userId: number): Promise<Spent[]> {
    return this.spentRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    })
  }

  async findOne(id: number): Promise<Spent> {
    const spent = await this.spentRepository.findOne({
      where: {
        id,
      },
    })
    if (!spent) throw new NotFoundException("spent not found")

    return spent
  }

  async update(id: number, updateSpentDto: UpdateSpentDto): Promise<Spent> {
    const spent = await this.findOne(id)

    const spentUpdated = Object.assign(spent, updateSpentDto)

    return this.spentRepository.save(spentUpdated)
  }

  async remove(id: number): Promise<Spent> {
    const spent = await this.findOne(id)
    await this.spentRepository.softDelete(id)

    return spent
  }
}
