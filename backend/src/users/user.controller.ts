import {Controller, Post, Get, Body} from "@nestjs/common"
import {UserCreateDto, UserLoginDto} from "@src/users/user.dto"
import {UserService} from "@src/users/user.service"

@Controller("/users")
export class UserController
{
	constructor(private userService: UserService)
	{}

	@Post("")
	async create_user(@Body() userCreateData: UserCreateDto)
	{
		// console.log(userCreateData)
		return await this.userService.create_user(userCreateData)		
	}

	@Post("login")
	login_user(@Body() userLoginData:UserLoginDto)
	{}
	
	@Get("/")
	ping_user_service()
	{
		return "Hello Brother"
	}
}