import { Controller, Post, Body } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { LoginDto } from "./dto/login-auth.dto"

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto)
  }

  @Post("login")
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }
}
