import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional  } from "class-validator";



export class MarqueInput {
  
  @IsUUID("all",{
    groups:['update', 'delete', "create::simple","update::simple", "create::variable"]
  })
  @IsDefined({
    groups:['update', 'delete', "create::simple","update::simple", "create::variable"]
  })
  id!: string;

  @IsUUID("all",{
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  imageId!: string;

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

  @IsUUID("all",{
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  categoryId!: string;

}
