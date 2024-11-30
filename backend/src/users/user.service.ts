import {Injectable} from "@nestjs/common"
import {UserCreateDto} from "@src/users/user.dto"
import prisma from "@src/prisma"
import * as argon2 from "argon2"

@Injectable()
export class UserService
{
	constructor()
	{}

	async create_user(createUserData: UserCreateDto)
	{
		try
		{
			let new_user = await prisma.user.create({
				data: {
					firstname: createUserData.firstname,
					lastname: createUserData.lastname,
					email: createUserData.email,
					password: await argon2.hash(createUserData.password)
				}
			})
			delete new_user.password
			return new_user
		}
		catch (error)
		{
			return {
				"message": "Couldn't create user",
				"reason": error.message,
				"error_code": 1
			}
		}
	}

}

