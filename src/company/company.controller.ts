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
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.auth.guard';
import { RoleGuard } from 'src/auth/guard/roles.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Create a company - employer only' })
  create(@CurrentUser() user: any, @Body() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(user.id, createCompanyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Companies with job counts' })
  findAll() {
    return this.companyService.findAll();
  }

  @Get('my-company')
  @Roles(Role.EMPLOYER)
  @ApiOperation({
    summary: 'Get single Company with job and application counts',
  })
  getMyCompany(@CurrentUser() user: any) {
    return this.companyService.getMyCompany(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a company with open jobs' })
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Update own comany - Employer only' })
  update(
    @Param('companyId') companyId: string,
    @CurrentUser() user: any,
    @Body() updateCompanyDto: UpdateCompanyDto,
  ) {
    return this.companyService.update(companyId, user.id, updateCompanyDto);
  }

  @Delete(':id')
  @Roles(Role.EMPLOYER)
  @ApiOperation({ summary: 'Delete own comany - Employer only' })
  remove(@Param('companyId') companyId: string, @CurrentUser() user: any) {
    return this.companyService.remove(companyId, user.id);
  }
}
