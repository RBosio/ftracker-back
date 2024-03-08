import { Injectable, UnauthorizedException } from "@nestjs/common"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { LoginDto } from "./dto/login-auth.dto"
import { UserService } from "src/user/user.service"
import { compare } from "bcryptjs"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  signup(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmail(loginDto.email)
    if (!user) throw new UnauthorizedException("email or password wrong")

    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("email or password wrong")
    }

    const payload = { sub: user.id }
    return {
      token: await this.jwtService.signAsync(payload),
    }
  }
}
