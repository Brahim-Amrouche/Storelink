import {IsString, Length, IsEmail, IsStrongPassword, IsNotEmpty} from "class-validator"

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