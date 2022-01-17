import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsBoolean, IsObject, ValidateNested, IsIn  } from "class-validator";
import { Expose, Transform, Type } from "class-transformer"

export class ProductAttributeMetaInput {

  @IsUUID(null, {
    groups:['update', 'delete', "create::variable", "update::variable"]
  })
  @IsDefined({
    groups:['update', 'delete', "create::variable"]
  })
  id!: string;

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  name!: string;

  
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  value!: any;
}


export class ProductAttributeInput {
  
  @IsUUID(null, {
    groups:['update', 'delete']
  })
  id!: string;

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:[ 'create']
  })
  name!: string;

  @IsIn(["TEXT","NUM","COLOR"],{
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update', "update::variable"]
  })  
  @IsDefined({
    groups:[ 'create',  "create::variable"]
  })
  type!: string;

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update','create']
  })  
  description?: string | null;

  @IsBoolean({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update','create']
  })  
  global: boolean=true;

  @Type(()=>ProductAttributeMetaInput)
  @ValidateNested({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:[ 'update', "update::variable"]
  })
  @IsDefined({
    groups:[ 'create',  "create::variable"]
  })
  metas?: ProductAttributeMetaInput[];



  @IsOptional({
    groups:[ 'update']
  })
  @IsDefined({
    groups:['create']
  })
  @IsString({
    groups:['create', "update"]
  })
  categoryId:string
  

  @IsUUID("all",{
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update', 'create']
  })
  onlyForProduct?: string | null;

}
