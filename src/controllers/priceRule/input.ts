import { IsNumber, IsOptional, IsUUID, IsDefined } from "class-validator";
import {Transform} from "class-transformer"
export class PriceRuleInput {
    @IsUUID(null,{
        groups:['update', "delete", "create::simple","create::variable", "update::simple","update::variable"]
    })
    @IsDefined({
        groups:['update', "delete", "create::simple","create::variable", "update::simple","update::variable"]
    })
    id!: string;
  
    @IsNumber(undefined,{
        groups:['create', 'update']
    })
    @IsOptional({
        groups:["update"]
    })
    @IsDefined({
        groups:['create']
    })
    minPrice!: number;
  
    @IsNumber(undefined,{
        groups:['create', 'update']
    })
    @IsOptional({
        groups:["create", 'update']
    })
    maxPrice!: number;
  
    @IsNumber(undefined,{
        groups:['create', 'update']
    })
    @IsDefined({
        groups:['create']
    })
    @IsOptional({
        groups:["update"]
    })
    @Transform((value)=>value>100 ? 100: value)
    amountPercent!: number;
  }
  