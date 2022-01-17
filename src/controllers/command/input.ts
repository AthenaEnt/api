import { IsString, IsUUID,IsNumber, MaxLength, IsDefined, IsOptional, IsDateString, IsBoolean, ValidateNested, IsObject, ValidateIf  } from "class-validator";
import { Expose, Transform, Type } from "class-transformer"
import S from "string"
import { UserInput } from "../user/input";
import { UserShippingAdressInput } from "../userShippingAdress/input";
import { DiscountInput } from "../discount/input";
import { CommandUnitInput, CommandUnitProductInput } from "../commandUnit/input";
import { ProductInput } from "../product/input";

export class ReceiptInput{
  @IsUUID("all", {
    groups:['updateCommand']
  })
  @IsDefined({
    groups:['updateCommand']
  })
  @Expose({
    groups:['updateCommand']
  })
  id!: string;

  @IsBoolean({
    groups:['updateCommand']
  })
  @IsOptional({
    groups:['updateCommand']
  })
  @Expose({
    groups:['updateCommand']
  })
  isPaid!: boolean;

  @IsString({
    groups:['updateCommand']
  })
  @Expose({
    groups:['updateCommand']
  })
  outPaymentId!: string;

  @IsBoolean({
    groups:['updateCommand']
  })
  @IsOptional({
    groups:['updateCommand']
  })
  @Expose({
    groups:['updateCommand']
  })
  hasUserDeleted!: string;


  @IsObject({
    groups:['updateCommand']
  })
  @IsOptional({
    groups:['updateCommand']
  })
  @Expose({
    groups:['updateCommand']
  })
  outPaymentDetails!: any;

}

export class CommandProductInput {
  @IsUUID("all",{
    groups:['updateCommand','delete']
  })
  @IsDefined({
    groups:['updateCommand','delete']
  })
  @Expose({
    groups:['updateCommand','delete']
  })
  id!: string;

  @Type(()=>ProductInput)
  @ValidateNested({
    groups:['createCommand', 'updateCommand']
  })
  @IsOptional({
    groups:['updateCommand']
  })
  @IsDefined({
    groups:['createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  product!: ProductInput;

  @Type(()=>CommandUnitProductInput)
  @ValidateNested({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand','createCommand']
  })
  @Expose({
    groups:['updateCommand','createCommand']
  })
  commandUnitProduct?:CommandUnitProductInput
  
  @IsBoolean({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand','createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  hasUserDeleted: boolean=false;

  @IsNumber(undefined,{
    groups:['createCommand', 'updateCommand']
  })
  @IsOptional({
    groups:['updateCommand']
  })
  @IsDefined( {
    groups:['createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  quantite!: number;

  @IsBoolean({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand','createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  hasCustomerConfirmShipping: boolean=false;

  @IsBoolean({
    groups:['updateCommand','createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  @IsOptional({
    groups:['updateCommand','createCommand']
  })
  hasAgentConfirmShipping: boolean=false;
}


export class CommandInput {

  @IsUUID("all", {
    groups:['updateCommand','delete']
  })
  @IsDefined({
    groups:['updateCommand','delete']
  })
  @Expose({
    groups:['createCommand', 'delete', "updateCommand"]
  })
  id!: string;

  @IsBoolean({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand', "createCommand"]
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  delivered!: boolean;

  @IsBoolean({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand', "createCommand"]
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  hasUserCanceled!: boolean;

  @Type(()=>UserInput)
  @ValidateNested({
    groups:['createCommand']
  })
  @IsDefined({
    groups:['createCommand']
  })
  @Expose({
    groups:['createCommand']
  })
  orderedBy!: UserInput;

  @IsBoolean({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand', 'createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  hasUserDeleted: boolean=false

  @IsBoolean({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand', 'createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  archived: boolean=false

  @Type(()=>UserShippingAdressInput)
  @ValidateNested({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand']
  })
  @IsDefined({
    groups:['createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  shippingAdress?: UserShippingAdressInput;


  @Type(()=>CommandProductInput)
  @ValidateNested({
    groups:['createCommand', 'updateCommand']
  })
  @IsOptional({
    groups:["updateCommand"]
  })
  @IsDefined({
    groups:['createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  commandProducts?: CommandProductInput[];

  @Type(()=>DiscountInput)
  @ValidateNested({
    groups:['updateCommand','createCommand']
  })
  @IsOptional({
    groups:['updateCommand','createCommand']
  })
  @Expose({
    groups:['createCommand', 'updateCommand']
  })
  appliedDiscount?: DiscountInput | null;

  @Type(()=>ReceiptInput)
  @ValidateNested({
    groups:['updateCommand']
  })
  @IsOptional({
    groups:['updateCommand']
  })
  @Expose({
    groups:['updateCommand']
  })
  receipt?: ReceiptInput | null;
}

