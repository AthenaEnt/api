import { IsDefined, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";


export class CommandUnitInput {
    @IsUUID(null, {
        groups:['delete', "update", "create::simple","update::simple", 'updateCommand','createCommand']
    })
    @IsDefined({
        groups:['delete', "update", "create::simple","update::simple", 'updateCommand','createCommand']
    })
    id!: string;

    @IsString({
        groups:['create', 'update']
    })
    @IsOptional({
        groups:['update']
    })
    @IsDefined({
        groups:['create']
    })
    title!: string;

    @IsString({
        groups:['create', 'update']
    })
    @IsOptional({
        groups:['update']
    })
    @IsDefined({
        groups:['create']
    })
    shortCode!: string;
}


export class CommandUnitProductInput{
    @IsString({
        groups:["update::simple","update::variable", 'updateCommand','createCommand']
    })
    @IsDefined({
        groups:["update::simple", "update::variable",'updateCommand','createCommand']
    })
    id!: string;

    @IsString({
        groups:["create::simple","create::variable", "update::simple","update::variable"]
    })
    @IsOptional({
        groups:["create::simple","create::variable", "update::simple","update::variable"]
    })
    @IsDefined({
        groups:["create::simple","create::variable"]
    })
    defaultValue!: string;

    @IsNumber(undefined,{
        groups:["create::simple","create::variable", "update::simple","update::variable"]
    })
    @IsOptional({
        groups:["create::simple","create::variable","update::simple","update::variable"]
    })
    @IsDefined({
        groups:["create::simple","create::variable"]
    })
    unitPrice!: string;

    @ValidateNested({
        groups:["create::simple","create::variable", "update::simple","update::variable"]
    })
    @IsOptional({
        groups:["update::simple","update::variable"]
    })
    @IsDefined({
        groups:["create::simple","create::variable"]
    })
    commandUnit!: CommandUnitInput;

}