import { IsString, IsUUID, MaxLength, IsDefined, IsOptional, IsDateString, IsDate, IsBoolean  } from "class-validator";
import { Expose, Transform } from "class-transformer"
import S from "string"


export class NotificationInput {

  @IsUUID("all", {
    groups:['updateNotification','deleteNotification']
  })
  id!: string;

  @IsString( {
    groups:['updateNotification', /*'createNotification'*/]
  })
  @IsOptional( {
    groups:['updateNotification']
  })
  @IsDefined( {
    groups:[/*'createNotification'*/]
  })
  title!: string;

  @IsBoolean( {
    groups:['updateNotification', /*'createNotification'*/]
  })
  @IsOptional( {
    groups:['updateNotification']
  })
  @IsDefined( {
    groups:[/*'createNotification'*/]
  })
  hasUserRead: boolean=false

  @IsBoolean( {
    groups:['updateNotification', /*'createNotification'*/]
  })
  @IsOptional( {
    groups:['updateNotification']
  })
  @IsDefined( {
    groups:[/*'createNotification'*/]
  })
  canLockScreen: boolean=false

  @IsString( {
    groups:['updateNotification', /*'createNotification'*/]
  })
  @IsOptional( {
    groups:['updateNotification']
  })
  @IsDefined( {
    groups:[/*'createNotification'*/]
  })
  content!: string;

  @IsString( {
    groups:['updateNotification', /*'createNotification'*/]
  })
  @IsOptional( {
    groups:['updateNotification']
  })
  @IsDefined( {
    groups:[/*'createNotification'*/]
  })
  context!: string;

}