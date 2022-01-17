import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsBoolean, IsObject, ValidateNested, IsIn  } from "class-validator";
import { Expose, Transform, Type } from "class-transformer"
import S from "string"
import { MediaInput } from "../media/input";
import { UserInput } from "../user/input";
import { ShippingZoneInput } from "../shippingZone/input";


export class UserShippingAdressInput {
  @IsUUID("all",{
    groups:['updateUserShipping', 'delete', 'updateCommand']
  })
  @IsDefined({
    groups:['updateUserShipping', 'delete', 'updateCommand','createCommand']
  })
  id!: string;


  @IsIn(["office", "home", "others"],{
    groups:['createUserShipping','updateUserShipping']
  })
  @IsOptional({
    groups:['updateUserShipping']
  })
  @IsDefined({
    groups:['createUserShipping']
  })
  adressType!:string

  @IsString({
    groups:['createUserShipping','updateUserShipping']
  })
  @IsOptional({
    groups:['updateUserShipping', "createUserShipping"]
  })
  alternatePhone!: string;

  @IsString({
    groups:['createUserShipping','updateUserShipping']
  })
  @IsOptional({
    groups:['updateUserShipping']
  })
  @IsDefined({
    groups:['createUserShipping']
  })
  phone!: string;

  @IsString({
    groups:['createUserShipping','updateUserShipping']
  })
  @IsOptional({
    groups:['updateUserShipping']
  })
  @IsDefined({
    groups:['createUserShipping']
  })
  fullName!: string;

  @IsString({
    groups:['createUserShipping','updateUserShipping']
  })
  @IsOptional({
    groups:['updateUserShipping']
  })
  @IsDefined({
    groups:['createUserShipping']
  })
  quatier!: string;

  @IsBoolean({
    groups:['createUserShipping','updateUserShipping']
  })
  @IsOptional({
    groups:['createUserShipping','updateUserShipping']
  })
  hasUserDeleted: boolean=false

  @IsString({
    groups:['createUserShipping','updateUserShipping']
  })
  @IsOptional({
    groups:['updateUserShipping', "createUserShipping"]
  })
  additionalDetails?: string | null;

  @IsOptional({
    groups:['createUserShipping','updateUserShipping']
  })
  @ValidateNested({
    groups:['createUserShipping','updateUserShipping']
  })
  @Type(()=>MediaInput)
  audioFile?:MediaInput;

  @IsOptional({
    groups:['updateUserShipping']
  })
  @IsUUID(null, {
    groups:['updateUserShipping', "createUserShipping"]
  })
  @IsDefined({
    groups:['createUserShipping']
  })
  forUserId!: UserInput;

  @IsOptional({
    groups:['updateUserShipping']
  })
  @ValidateNested({
    groups:['updateUserShipping', "createUserShipping"]
  })
  @IsDefined({
    groups:['createUserShipping']
  })
  @Type(()=>ShippingZoneInput)
  shippingZone!: ShippingZoneInput;

}
