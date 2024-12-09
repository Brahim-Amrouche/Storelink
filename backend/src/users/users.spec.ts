import {faker} from "@faker-js/faker"
import {User, UserSex} from "@prisma/client"
import {UserService} from "@src/users/user.service"
import {UserController} from "@src/users/user.controller"
import {UserCreateDto, UserDeleteDto, UserLoginDto, UserUpdateDto, UserReadDto} from "@src/users/user.dto"
import {JWTPUBLICKEY} from "@src/authGuard"
import {ErrorMessage} from "@src/error"
import prisma from "@src/prisma"
import * as jose from "jose"
import {randomUUID} from "crypto"

describe("Users Suite", ()=>{
	let userController: UserController;
	let userService: UserService;
	let randomUserData: UserCreateDto;
	let randomUser: User;
	
	function generateRandomUser()
	{
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const email = faker.internet.email({firstName, lastName});
		const password = "Adm@1234!";
		const sex = UserSex.UNKNOWN
		const newUserData : UserCreateDto = {"firstname": firstName, "lastname": lastName, email, password, sex}
		return newUserData
	}

 	beforeEach( async () => {
    	userService = new UserService();
    	userController = new UserController(userService);
		randomUserData = generateRandomUser();
		const createdUser = await userService.create_user(randomUserData);
		if (createdUser instanceof ErrorMessage)
			return expect(createdUser).not.toBeInstanceOf(ErrorMessage);
		randomUser = createdUser;
  	});

	afterEach(async () => {
		try
		{
			await prisma.user.delete({where: {id: randomUser.id }})
		}
		catch(e)
		{}
		prisma.$disconnect()
	})

	it("Creates Simple Users", async ()=>{
		expect(randomUser).toMatchObject({
			"id": expect.any(String), 
			"firstname": randomUserData.firstname, 
			"lastname": randomUserData.lastname,
			"sex": "UNKNOWN",
			"email": randomUserData.email,
			"tier": "FREE"
		})
		expect(randomUser).not.toHaveProperty('password')
	})

	it("Duplicate Email Fails", async () => {
		const newUser2 = await userService.create_user(randomUserData);
		expect(randomUser).toMatchObject({
			"id": expect.any(String), 
			"firstname": randomUserData.firstname, 
			"lastname": randomUserData.lastname,
			"sex": "UNKNOWN",
			"email": randomUserData.email,
			"tier": "FREE"
		})
		expect(newUser2).toBeInstanceOf(ErrorMessage);
	})

	it("Connects User Successfully", async () => {
		const loginData : UserLoginDto = {email: randomUserData.email, password: randomUserData.password};
		const connectedUser = await userService.login_user(loginData);
		expect(connectedUser).not.toBeInstanceOf(ErrorMessage);
		const publicKey = await jose.importSPKI(JWTPUBLICKEY, 'EdDSA');
		const {payload, protectedHeader} = await jose.jwtVerify(connectedUser as string, publicKey, {'algorithms':['EdDSA']});
		expect(payload['id']).toMatch(randomUser.id);
	})

	it("User Should Fail Connecting", async () => {
		let loginData: UserLoginDto = {email: randomUser.email, password: "test1234"}
		const connectedUser = await userService.login_user(loginData)
		expect(connectedUser).toBeInstanceOf(ErrorMessage)
	})

	it("Read User Sucessfully", async () => {
		const userReadData: UserReadDto = {id: randomUser.id}
		const readUser = await userService.read_user(userReadData)
		expect(readUser).not.toBeInstanceOf(ErrorMessage)
		expect(readUser).toMatchObject({
			id: randomUser.id,
			firstname: randomUser.firstname,
			lastname: randomUser.lastname,
			sex: randomUser.sex,
			email: randomUser.email,
			tier: randomUser.tier
		})
	})

	it("Updated User Successfully", async () => {
		const updateUserData : UserUpdateDto = {
			id: randomUser.id, 
			firstname: faker.person.firstName(), 
			lastname: faker.person.lastName(), 
			sex: "MALE", 
			password: "NewPass!1337!"
		};
		const updatedUser = await userService.update_user(updateUserData)
		expect(updatedUser).not.toBeInstanceOf(ErrorMessage)
		expect(updatedUser).toMatchObject({
			"id": randomUser.id,
			"firstname": updateUserData.firstname,
			"lastname": updateUserData.lastname,
			"sex": updateUserData.sex,
		})
		expect(updatedUser).not.toHaveProperty('password')
	})

	it("Update User Should Fail", async () => {
		const updateUserData : UserUpdateDto = {
			id: randomUUID(),
		};
		const updatedUser = await userService.update_user(updateUserData);
		expect(updatedUser).toBeInstanceOf(ErrorMessage);
	})

	it("Delete User Sucessfully", async () => {
		const deleteUserData : UserDeleteDto = {id : randomUser.id}
		let deletedUser = await userService.delete_user(deleteUserData)
		expect(deletedUser).not.toBeInstanceOf(ErrorMessage)
		expect(deletedUser).toMatchObject({
			"id": expect.any(String), 
			"firstname": randomUserData.firstname, 
			"lastname": randomUserData.lastname,
			"sex": "UNKNOWN",
			"email": randomUserData.email,
			"tier": "FREE"
		})
		deletedUser = await prisma.user.findUnique({ where: { id: randomUser.id } })
		expect(deletedUser).toBeNull()
	})

	it("Delete User Should Fail", async () => {
		const deleteUserData: UserDeleteDto = {id: randomUUID()};
		const deletedUser = await userService.delete_user(deleteUserData);
		expect(deletedUser).toBeInstanceOf(ErrorMessage)
	})

})