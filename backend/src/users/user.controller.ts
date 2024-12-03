import {Controller, Post, Get, Body, Res, Req, BadRequestException, UseGuards} from "@nestjs/common"
import {UserCreateDto, UserLoginDto} from "@src/users/user.dto"
import {UserService} from "@src/users/user.service"
import {Response, Request} from "express"
import {AuthGuard} from "@src/authGuard"

@Controller("/users")
export class UserController
{
	constructor(private userService: UserService)
	{}

	@Post("/login")
	async login_user(@Body() userLoginData:UserLoginDto, @Res() res: Response)
	{
		const userJwt = await this.userService.login_user(userLoginData);
		if (userJwt === undefined)
			return new BadRequestException({"message": "couldn't log in", "error_code": 2})
		res.cookie("id_key", userJwt, {
			"httpOnly": true,
			"maxAge": 3600000,
			"path": "/"
		})
		return res.send({"message": "loged in sucessfully"})
	}

	@Post("/")
	async create_user(@Body() userCreateData: UserCreateDto)
	{
		return await this.userService.create_user(userCreateData)		
	}

	
	@Get("/")
	@UseGuards(AuthGuard)
	ping_user_service(@Req() req: Request)
	{
		return req['user']
	}
}