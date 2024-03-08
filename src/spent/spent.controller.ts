import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SpentService } from './spent.service';
import { CreateSpentDto } from './dto/create-spent.dto';
import { UpdateSpentDto } from './dto/update-spent.dto';

@Controller('spent')
export class SpentController {
  constructor(private readonly spentService: SpentService) {}

  @Post()
  create(@Body() createSpentDto: CreateSpentDto) {
    return this.spentService.create(createSpentDto);
  }

  @Get()
  findAll() {
    return this.spentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSpentDto: UpdateSpentDto) {
    return this.spentService.update(+id, updateSpentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spentService.remove(+id);
  }
}
