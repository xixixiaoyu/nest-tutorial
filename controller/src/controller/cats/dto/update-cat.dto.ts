import { PartialType } from '@nestjs/mapped-types'; // 需要安装 @nestjs/mapped-types
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
