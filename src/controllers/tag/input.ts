import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional  } from "class-validator";
import { Expose, Transform } from "class-transformer"
import S from "string"


export class TagInput {
  
  @IsUUID(null, {
    groups:['update', 'delete', "create::simple","update::simple"]
  })
  @IsDefined( {
    groups:['update', 'delete', "create::simple","update::simple"]
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

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })  
  @IsDefined({
    groups:['create']
  })
  slug!: string;

}
