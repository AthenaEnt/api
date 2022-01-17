import { Prisma } from "../../database/generated/client";;
import { IsDefined, IsObject, IsOptional, IsString, IsUUID } from "class-validator";


export class GeneralMetaInput {

    @IsUUID(null, {
        groups:['update', "delete"]
    })
    @IsDefined( {
        groups:['update', "delete"]
    })
    id!: string;

    @IsString({
        groups:['create', "update"]
    })
    @IsOptional({
        groups:["update"]
    })
    @IsDefined({
        groups:["create"]
    })
    name!: string;

    @IsString({
        groups:['create', "update"]
    })
    @IsOptional({
        groups:["update"]
    })
    @IsDefined({
        groups:["create"]
    })
    key!: string;

    @IsObject({
        groups:['create', "update"]
    })
    @IsOptional({
        groups:["update"]
    })
    @IsDefined({
        groups:["create"]
    })
    value!: any;
}
