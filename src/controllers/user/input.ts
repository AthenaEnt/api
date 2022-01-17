import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsEmail, IsPhoneNumber, IsBoolean, ValidateNested, IsIn  } from "class-validator";
import { Expose, Transform, Type } from "class-transformer"
import S from "string"
import { UserShippingAdressInput } from "../userShippingAdress/input";
import { MediaInput } from "../media/input";


export class UserInput {
  
  @IsUUID(null, {
    groups:['update', 'delete',, 'updateCommand','createCommand']
  })
  @IsDefined({
    groups:['update', 'delete', , 'updateCommand','createCommand']
  })
  @Expose({
    groups:['update', 'delete', , 'updateCommand','createCommand']
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
  @Expose({
    groups:['update', 'create']
  })
  firstName!: string;

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  @Expose({
    groups:['update', 'create']
  })
  lastName!: string;

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  @Expose({
    groups:['update', 'create']
  })
  password!: string;

  @IsEmail(undefined,{
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  @Expose({
    groups:['update', 'create']
  })
  email!: string;

  @IsPhoneNumber("BJ",{
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update']
  })
  @IsDefined({
    groups:['create']
  })
  @Expose({
    groups:['update', 'create']
  })
  phone!: string;

  @IsUUID("all",{
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update', 'create']
  })
  @Expose({
    groups:['update', 'create']
  })
  profileImageId?: string | null;

  @IsBoolean({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update', 'create']
  })
  @Expose({
    groups:['update', 'create']
  })
  accoundActivated: boolean=false;

  @IsIn(["ADMIN","CUSTOMER"],{
    groups:['create']
  })
  @IsOptional({
    groups:['create']
  })
  @Expose({
    groups:['create']
  })
  role: string="CUSTOMER";

  @IsString({
    groups:['update', 'create']
  })
  @IsOptional({
    groups:['update', 'create']
  })
  @Expose({
    groups:['update', 'create']
  })
  @Transform((value, obj)=>obj.role ?? value)
  currentRole: string="CUSTOMER";

}
