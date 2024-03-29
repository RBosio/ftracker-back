import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"
import { Repository } from "typeorm"
import { User } from "src/entities/user.entity"
import { InjectRepository } from "@nestjs/typeorm"
import { hash } from "bcryptjs"

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const userFound = await this.findOneByEmail(createUserDto.email)
    if (userFound) {
      throw new BadRequestException("email is duplicated")
    }

    const user = this.userRepository.create(createUserDto)
    user.password = await hash(user.password, 8)

    return this.userRepository.save(user)
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find()
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    })

    if (!user) {
      throw new HttpException("user not found", HttpStatus.NOT_FOUND)
    }

    return user
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    })

    return user
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id)

    const userUpdated = Object.assign(user, updateUserDto)

    return this.userRepository.save(userUpdated)
  }
}
