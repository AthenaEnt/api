import { IsDate, IsNotEmpty, IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsEmail, IsPhoneNumber, IsBoolean, IsNumber, IsDateString, ValidateNested, IsIn, ValidateIf  } from "class-validator";
import { Expose, Transform, Type } from "class-transformer"
import S from "string"
import { UserShippingAdressInput } from "../userShippingAdress/input";
import { ProductAttributeInput, ProductAttributeMetaInput } from "../productAttribute/input";
import { CategoryInput } from "../category/input";
import { ShippingZoneInput } from "../shippingZone/input";
import { TagInput } from "../tag/input";
import { CommandUnitInput, CommandUnitProductInput } from "../commandUnit/input";
import { MediaInput } from "../media/input";
import { DiscountInput } from "../discount/input";
import { MarqueInput } from "../marque/input";


export class ProductInput {
  
  @IsUUID("all", {
    groups:['delete', "update::simple", "update::variable",'updateCommand','createCommand']
  })
  @Expose({
    groups:["create::variable", 'delete', "update::simple", "update::variable",'updateCommand', 'createCommand']
  })
  @IsDefined({
    groups:['delete', "update::simple", "update::variable",'updateCommand', 'createCommand']
  })
  id!: string;

  @IsString({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["update::simple"]
  })
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::simple", "create::variable", "update::variable"]
  })
  name!: string;

  @IsString({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::simple" , "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["update::simple"]
  })
  slug!: string;

  @IsString({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  description?: string | null;

  @IsString({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  shortDescription?: string | null;

  @IsIn(["VARIABLE","SIMPLE"],{
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["update::simple"]
  })
  type!: string;

  @IsBoolean({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::simple","update::simple", "create::variable"]
  })
  isPublished: boolean=true;

  @IsUUID("all", {
    groups:["create::simple","update::simple"]
  })
  @Expose({
    groups:["create::simple","update::simple"]
  })
  @IsDefined({
    groups:["create::simple"]
  })
  @IsOptional({
    groups:["update::simple"]
  })
  sku!: string;

  @Type(()=>MarqueInput)
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @ValidateNested({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:[ "create::simple","update::simple", "create::variable", "update::variable"]
  })
  marque?: MarqueInput | null;

  @IsBoolean({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:[,"update::simple", "update::variable", "create::simple", "create::variable"]
  })
  showProduct: boolean=true;

  @IsBoolean({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["update::simple","update::variable", "create::variable", "create::simple"]
  })
  hasUserDeleted: boolean=false

  /*@Type(()=>ProductAttributeInput)
  @ValidateNested({
    groups:["create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::variable"]
  })
  productAttributes?: ProductAttributeInput[];*/



  @Type(()=>ProductVariantInput)
  @ValidateNested({
    groups:["create::variable", "update::variable"]
  })
  @Expose({
    groups:["create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::variable", "update::variable"]
  })
  variations?: ProductVariantInput[];


  @Type(()=>CategoryInput)
  @ValidateNested({
    groups:["create::simple","update::simple","create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["update::simple",  "update::variable"]
  })
  @IsDefined({
    groups:["create::simple",  "create::variable"]
  })
  categories?: CategoryInput[];

  @Type(()=>ShippingZoneInput)
  @Expose({
    groups:["create::simple","update::simple","create::variable", "update::variable"]
  })
  @ValidateNested({
    groups:["create::simple","update::simple","create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::simple","update::simple","create::variable", "update::variable",]
  })
  shippingZones?: ShippingZoneInput[];

  @Expose({
    groups:["create::simple","update::simple","create::variable", "update::variable"]
  })
  @Type(()=>TagInput)
  @ValidateNested({
    groups:["create::variable", "update::variable", "create::simple","update::simple",]
  })
  @IsOptional({
    groups:["create::variable", "update::variable", "create::simple","update::simple",]
  })
  tags?: TagInput[];

  @Expose({
    groups:["create::simple","update::simple"]
  })
  @Type(()=>CommandUnitProductInput)
  @ValidateNested({
    groups:[ "create::simple","update::simple"]
  })
  @IsOptional({
    groups:[ "update::simple"]
  })
  commandUnitProducts?: CommandUnitProductInput[];

  @Type(()=>MediaInput)
  @Expose({
    groups:["create::simple","update::simple"]
  })
  @IsDefined({
    groups:["create::simple","update::simple"]
  }) 
  @ValidateNested({
    groups:["create::simple","update::simple",]
  })
  medias?: MediaInput[];

  

}


export class ProductVariantInput {
  
  @IsUUID("all", {
    groups:["update::variable", "create::variable"]
  })
  @IsOptional({
    groups:["create::variable"]
  })
  id!: string;

  @IsString({
    groups:["create::variable", "update::variable"]
  })
  name!: string;

  @IsString({
    groups:["create::variable", "update::variable"]
  })
  slug!: string;

  @IsString({
    groups:["create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::variable", "update::variable"]
  })
  description?: string | null;

  @IsString({
    groups:[ "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:[ "create::variable", "update::variable"]
  })
  shortDescription?: string | null;

  @IsIn(["VARIANT"],{
    groups:["create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::variable"]
  })
  type: string="VARIANT"

  @IsBoolean({
    groups:["create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::variable",  "update::variable"]
  })
  isPublished: boolean=true;

  @IsUUID("all", {
    groups:["create::variable", "update::variable"]
  })
  sku!: string;

  @IsBoolean({
    groups:["create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::variable", "update::variable"]
  })
  showProduct: boolean=true;

  @IsBoolean({
    groups:["create::simple","update::simple", "create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["create::variable", "update::variable"]
  })
  hasUserDeleted: boolean=false

  @Type(()=>ProductAttributeMetaInput)
  @ValidateNested({
    groups:["create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::variable"]
  })
  variationMetas?: ProductAttributeMetaInput[];

  @Type(()=>MediaInput)  
  @ValidateNested({
    groups:["create::variable", "update::variable"]
  })
  @IsDefined({
    groups:["create::variable"]
  })
  medias?: MediaInput[];


  @Type(()=>CommandUnitProductInput)
  @ValidateNested({
    groups:["create::variable", "update::variable"]
  })
  @IsOptional({
    groups:["update::variable"]
  })
  commandUnitProducts?: CommandUnitProductInput[];

}
