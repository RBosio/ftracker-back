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
import { SpentService } from "./spent.service"
import { CreateSpentDto } from "./dto/create-spent.dto"
import { UpdateSpentDto } from "./dto/update-spent.dto"
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger"

@ApiTags("spent")
@Controller("spent")
export class SpentController {
  constructor(private readonly spentService: SpentService) {}

  @Post()
  @ApiOperation({ summary: "create spent" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "spent created",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "user not found",
  })
  @ApiBody({ type: CreateSpentDto })
  create(@Body() createSpentDto: CreateSpentDto) {
    return this.spentService.create(createSpentDto)
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "get spents of user" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get all spents of user",
  })
  @ApiParam({
    name: "userId",
    type: "number",
    example: 1
  })
  findAll(@Param("userId") userId: string) {
    return this.spentService.findAll(+userId)
  }

  @Get(":spentId")
  @ApiOperation({ summary: "get one spent" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "get one spent",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "spent not found",
  })
  @ApiParam({
    name: "spentId",
    type: "number",
    example: 1,
  })
  findOne(@Param("spentId") spentId: string) {
    return this.spentService.findOne(+spentId)
  }

  @Patch(":spentId")
  @ApiOperation({ summary: "update spent" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "update spent",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "spent not found",
  })
  @ApiParam({
    name: "spentId",
    type: "number",
    example: 1,
  })
  @ApiBody({ type: UpdateSpentDto })
  update(
    @Param("spentId") spentId: string,
    @Body() updateSpentDto: UpdateSpentDto,
  ) {
    return this.spentService.update(+spentId, updateSpentDto)
  }

  @Delete(":spentId")
  @ApiOperation({ summary: "remove spent" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "remove spent",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "spent not found",
  })
  @ApiParam({
    name: "spentId",
    type: "number",
    example: 1,
  })
  remove(@Param("spentId") spentId: string) {
    return this.spentService.remove(+spentId)
  }
}
