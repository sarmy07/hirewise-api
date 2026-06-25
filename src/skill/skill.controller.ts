import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  // @Post()
  // @Roles(Role.EMPLOYER)
  // @ApiOperation({ summary: 'Create a skill - employer only' })
  // create(@Body() createSkillDto: CreateSkillDto) {
  //   return this.skillService.create(createSkillDto);
  // }

  @Get()
  @ApiOperation({ summary: 'Get all skills with usage counts' })
  findAll() {
    return this.skillService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single skill with related jobs' })
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSkillDto: UpdateSkillDto) {
  //   return this.skillService.update(+id, updateSkillDto);
  // }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a skill - employer only' })
  remove(@Param('id') id: string) {
    return this.skillService.remove(id);
  }
}
