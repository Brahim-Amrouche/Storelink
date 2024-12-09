import {Injectable} from "@nestjs/common"
import {UserCreateDto, UserLoginDto, UserUpdateDto, UserDeleteDto, UserReadDto} from "@src/users/user.dto"
import {ErrorMessage} from "@src/error"
import prisma from "@src/prisma"
import * as argon2 from "argon2"
import * as jose from "jose"
import * as dotenv from "dotenv"

dotenv.config({path:"../.env"})

export const JWTPRIVATEKEY:string = `-----BEGIN PRIVATE KEY-----\n${process.env.JWT_SECRET}\n-----END PRIVATE KEY-----`;

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
			return new ErrorMessage("Error while creating user", 1, error.message)
		}
	}

	async login_user(userLoginData: UserLoginDto)
	{
		try
		{
			const fetched_user = await prisma.user.findUnique({where: {email : userLoginData.email}, select: { id: true, password: true } });
			if (fetched_user === null || fetched_user === undefined || ! await argon2.verify(fetched_user.password, userLoginData.password))
				return new ErrorMessage("Wrong email or password", 2);
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
			return new ErrorMessage("Error while Login user", 4, e.message)
		}
	}
	
	async read_user(userReadData: UserReadDto)
	{
		try
		{
			let readUser = await prisma.user.findUnique({where: {id: userReadData.id}})
			delete readUser.password
			return readUser
		}
		catch(e)
		{
			return new ErrorMessage("Error while reading user", 5, e.message);
		}
	}

	async update_user(userUpdateData: UserUpdateDto)
	{
		try
		{
			let updateObject = Object.fromEntries(Object.entries(userUpdateData).filter(([_, value]) => value !== undefined));
			if (updateObject['password'])
				updateObject['password'] = await argon2.hash(updateObject['password'])
			const updatedUser = await prisma.user.update({where: {id: userUpdateData.id }, data:updateObject})
			delete updatedUser.password
			return updatedUser
		}
		catch (e)
		{
			return new ErrorMessage("Error while updating user", 6, e.message);
		}
	}


	async delete_user(userDeleteData: UserDeleteDto)
	{
		try 
		{
			const deletedUser = await prisma.user.delete({where: {id : userDeleteData.id }});
			return deletedUser
		}
		catch(e)
		{
			return new ErrorMessage("Error while Deleting user", 7, e.message);
		}
	}


}

