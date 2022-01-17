import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsNumber  } from "class-validator";
import { Expose, Transform } from "class-transformer"
import S from "string"

export class MediaInput {

  @IsUUID(null,{
    groups:['update', 'delete', "createUserShipping", "updateUserShipping", "create::simple","update::simple","create::variable", "update::variable", 'update::user', 'create::user']
  })
  @IsOptional({
    groups:['create']
  })
  @IsDefined({
    groups:['update', 'delete', "createUserShipping", "updateUserShipping", "create::simple","update::simple", "create::variable", "update::variable", 'create::user']
  })
  id!: string;
 
  @IsString({
    groups:['create', 'update']
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
  filename!: string;

  @IsString({
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  fileType!: string;

  @IsString({
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  source!: string;

  @IsNumber({
    maxDecimalPlaces:20,
  },{
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  fileDuration!: number;
  

  @IsString({
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
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
  path!: string;

  @IsString({
    groups:['create', 'update']
  })
  @IsOptional({
    groups:['create', 'update']
  })
  userId!: string;

}
