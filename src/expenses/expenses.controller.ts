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
import { ExpensesService } from "./expenses.service"
import { CreateExpensesDto } from "./dto/create-expenses.dto"
import { UpdateExpensesDto } from "./dto/update-expenses.dto"
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"

@ApiTags("expenses")
@Controller("expenses")
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: "create expenses" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "expenses created",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "user not found",
  })
  @ApiBody({ type: CreateExpensesDto })
  create(@Body() createExpensesDto: CreateExpensesDto) {
    return this.expensesService.create(createExpensesDto)
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "get expensess of user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get all expensess of user",
  })
  @ApiParam({
    name: "userId",
    type: "number",
    example: 1
  })
  findAll(@Param("userId") userId: string) {
    return this.expensesService.findAll(+userId)
  }

  @Get(":expensesId")
  @ApiOperation({ summary: "get one expenses" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get one expenses",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "expenses not found",
  })
  @ApiParam({
    name: "expensesId",
    type: "number",
    example: 1,
  })
  findOne(@Param("expensesId") expensesId: string) {
    return this.expensesService.findOne(+expensesId)
  }

  @Patch(":expensesId")
  @ApiOperation({ summary: "update expenses" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "update expenses",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "expenses not found",
  })
  @ApiParam({
    name: "expensesId",
    type: "number",
    example: 1,
  })
  @ApiBody({ type: UpdateExpensesDto })
  update(
    @Param("expensesId") expensesId: string,
    @Body() updateExpensesDto: UpdateExpensesDto,
  ) {
    return this.expensesService.update(+expensesId, updateExpensesDto)
  }

  @Delete(":expensesId")
  @ApiOperation({ summary: "remove expenses" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "remove expenses",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "expenses not found",
  })
  @ApiParam({
    name: "expensesId",
    type: "number",
    example: 1,
  })
  remove(@Param("expensesId") expensesId: string) {
    return this.expensesService.remove(+expensesId)
  }
}
