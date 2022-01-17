import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional  } from "class-validator";
import { Expose, Transform } from "class-transformer"
import S from "string"

export class CategoryInput {

  @IsUUID(null, {
    groups:['update', "delete", "create::simple","update::simple"]
  })
  id: string;

  @IsString({
    groups:['create','update']
  })
  @MaxLength(255, {
    groups:['create','update']
  })
  @Transform((context:any)=>{
    let value:any;
    if(typeof context==="string"){
      value=context
    }else if(typeof context==="object"){
      value=context?.value
    }
    return value ? S(value).stripTags().s : value
  }, {
    groups:['create', 'update']
  })
  @IsDefined({
    groups:['create']
  })
  @IsOptional({
    groups:['update']
  })
  title: string;

  @IsString({
    groups:['create','update']
  })
  @MaxLength(255,{
    groups:['create','update']
  })
  @Transform((context:any)=>{
    let value:any;
    if(typeof context==="string"){
      value=context
    }else if(typeof context==="object"){
      value=context?.value
    }
    return value ? S(value).stripTags().s : value
  }, {
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  slug: string;
  
  @IsString({
    groups:['create','update']
  })
  @Transform((context:any)=>{
    let value:any;
    if(typeof context==="string"){
      value=context
    }else if(typeof context==="object"){
      value=context?.value
    }
    return value ? S(value).stripTags().s : value
  },{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['update', 'create']
  })
  description?: string | null;

  @IsUUID(null,{
    groups:['create','update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  parentId?: string | null;

  @IsUUID(null,{
    groups:['create','update']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  iconImageId: string;

  @IsUUID(null,{
    groups:['create','update']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  bannerImageId: string;

}
