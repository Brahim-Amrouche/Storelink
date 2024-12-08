import {IsString, Length, IsEmail, IsStrongPassword, IsNotEmpty, IsEnum} from "class-validator"
import {User, UserSex} from "@prisma/client"

export class UserCreateDto
{
	@IsNotEmpty()
	@IsString()
	@Length(1, 50)
	firstname: string

	@IsNotEmpty()
	@IsString()
	@Length(1, 50)
	lastname: string

	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsStrongPassword()
	password: string

	@IsNotEmpty()
	@IsEnum(UserSex)
	sex: string
}

export class UserLoginDto
{
	@IsNotEmpty()
	@IsEmail()
	email: string

	@IsNotEmpty()
	@IsStrongPassword()
	password: string
}