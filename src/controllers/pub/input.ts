import { IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsDateString, IsDate  } from "class-validator";
import { Expose, Transform } from "class-transformer"
import S from "string"


export class PubInput {

  @IsUUID("all", {
    groups:['update','delete']
  })
  id!: string;

  @IsString( {
    groups:['update', 'create']
  })
  @IsOptional( {
    groups:['update']
  })
  @IsDefined( {
    groups:['create']
  })
  name!: string;

  @IsUUID("all", {
    groups:['update', 'create']
  })
  @IsOptional( {
    groups:['update']
  })
  @IsDefined( {
    groups:['create']
  })
  bannerImageId!: string;

  @IsUUID("all", {
    groups:['update', 'create']
  })
  @IsOptional( {
    groups:['update', 'create']
  })
  forDiscountId

  @IsString( {
    groups:['update', 'create']
  })
  @IsOptional( {
    groups:['update']
  })
  @IsDefined( {
    groups:['create']
  })
  link?: string | null;

  @IsString( {
    groups:['update', 'create']
  })
  @IsOptional( {
    groups:['update',"create"]
  })
  description?: string | null;

  @IsDate( {
    groups:['update', 'create']
  })
  @IsOptional( {
    groups:['update']
  })
  @IsDefined( {
    groups:['create']
  })
  @Transform((value)=>new Date(value))
  startAt!: Date;

  @IsDate( {
    groups:['update', 'create']
  })
  @IsOptional( {
    groups:['update']
  })
  @IsDefined( {
    groups:['create']
  })
  @Transform((value)=>new Date(value))
  endAt!: Date;
}