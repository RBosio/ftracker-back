import { Controller, Post, Body, HttpStatus } from "@nestjs/common"
import { AuthService } from "./auth.service"
import { CreateUserDto } from "src/user/dto/create-user.dto"
import { LoginDto } from "./dto/login-auth.dto"
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger"

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  @ApiOperation({ summary: "create user" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "user created",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "email is duplicated",
  })
  @ApiBody({ type: CreateUserDto })
  signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto)
  }

  @Post("login")
  @ApiOperation({ summary: "login user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "user logged",
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: "email or password wrong",
  })
  @ApiBody({ type: LoginDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }
}
