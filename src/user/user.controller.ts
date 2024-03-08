import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { UpdateUserDto } from "./dto/update-user.dto"
import { CreateUserDto } from "./dto/create-user.dto"
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"

@ApiTags("user")
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @ApiOperation({ summary: "get users" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get all users",
  })
  findAll() {
    return this.userService.findAll()
  }

  @Get(":userId")
  @ApiOperation({ summary: "get user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get user",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "user not found",
  })
  @ApiParam({
    name: "userId",
    type: "number",
    example: 1,
  })
  findOne(@Param("userId") userId: string) {
    return this.userService.findOne(+userId)
  }

  @Patch(":userId")
  @ApiOperation({ summary: "update user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "update user",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "user not found",
  })
  @ApiParam({
    name: "userId",
    type: "number",
    example: 1,
  })
  @ApiBody({ type: UpdateUserDto })
  update(
    @Param("userId") userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+userId, updateUserDto)
  }
}
