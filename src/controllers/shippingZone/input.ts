import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsNumber  } from "class-validator";


export class ShippingZoneInput {
  
  @IsUUID(null, {
    groups:['update', 'delete', "create::simple","update::simple", 'updateUserShipping', "createUserShipping"]
  })
  @IsDefined( {
    groups:['update', 'delete', "create::simple","update::simple", "createUserShipping"]
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
  townName!: string;

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })  
  @IsDefined({
    groups:['create']
  })
  townCode!: string;

  @IsNumber(undefined, {
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  baseShippingPrice!: number;
}
