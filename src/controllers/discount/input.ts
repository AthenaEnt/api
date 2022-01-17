import { IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsDate, IsNumber, IsIn, ValidateIf  } from "class-validator";
import { Expose, Transform } from "class-transformer"
import S from "string"


export class DiscountInput {

  @IsUUID("all", {
    groups:['update','delete', "create::simple","update::simple", 'updateCommand','createCommand']
  })
  @IsDefined({
    groups:['update','delete', "create::simple","update::simple", 'updateCommand','createCommand']
  })
  id!: string;

  @IsString({
    groups:['create', 'update']
  })
  @IsOptional({
    groups:[ 'update']
  })
  @IsDefined({
    groups:[ 'create']
  })
  name!: string;

  @IsUUID("all",{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:[ 'update']
  })
  @IsDefined({
    groups:[ 'create']
  })
  bannerImageId!: string;

  @IsIn(["FIXED","PERCENT"],{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:[ 'update']
  })
  @IsDefined({
    groups:[ 'create']
  })
  discountType!: string;

  @IsIn(["PRICE","VOLUMNE"],{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:[ 'update']
  })
  @IsDefined({
    groups:[ 'create']
  })
  discountNature!: string;

  @IsString({
    groups:['create', 'update']
  })
  @IsOptional({
    groups:[ 'update']
  })
  @IsDefined({
    groups:[ 'create']
  })
  discountCode!: string;

  @IsNumber(undefined,{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:[ 'update']
  })
  @IsDefined({
    groups:[ 'create']
  })
  @Transform((value, obj)=>obj.discountType==="PERCENT" && value > 100 ? 100 : value)
  discount!: number;


  @Transform((value)=>(value ? new Date(value): value))
  startAt!: Date;

  @Transform((value)=>(value ? new Date(value): value))
  endAt!: Date;

  @IsNumber(undefined,{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  inCartProductMin?: number | null;

  @IsNumber(undefined,{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  inCartProductMax?: number | null;

  @IsNumber(undefined,{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  commandAmountMin?: number | null;

  @IsNumber(undefined,{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  commandAmountMax?: number | null;

  @IsString({
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  description?: string | null;
}