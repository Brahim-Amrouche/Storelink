import {Injectable} from "@nestjs/common"
import {UserCreateDto, UserLoginDto} from "@src/users/user.dto"
import prisma from "@src/prisma"
import * as argon2 from "argon2"
import * as jose from "jose"
import {JWTPRIVATEKEY} from "@src/main"


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

	async login_user(userLoginData: UserLoginDto)
	{
		try
		{
			const fetched_user = await prisma.user.findUnique({where: {email : userLoginData.email}, select: { id: true, password: true } });
			if (fetched_user === null || fetched_user === undefined || ! await argon2.verify(fetched_user.password, userLoginData.password))
				return undefined
			const private_key = await jose.importPKCS8(JWTPRIVATEKEY, 'EdDSA');
			const jwt_key = await new jose.SignJWT({"id": fetched_user.id})
				.setProtectedHeader({ alg: "EdDSA" })
				.setIssuedAt()
				.setExpirationTime("2h")
				.sign(private_key)
			return jwt_key;
		}
		catch (e)
		{
			return undefined
		}
	}

}

