import {faker} from "@faker-js/faker"
import {UserService} from "@src/users/user.service"
import {UserController} from "@src/users/user.controller"
import {UserCreateDto, UserLoginDto} from "@src/users/user.dto"
import {UserSex} from "@prisma/client"
import {ErrorMessage} from "@src/error"
import prisma from "@src/prisma"
import {JWTPUBLICKEY} from "@src/authGuard"
import * as jose from "jose"


describe("Users Suite", ()=>{
	let userController: UserController;
  	let userService: UserService;

 	beforeEach(() => {
    	userService = new UserService();
    	userController = new UserController(userService);
  	});

	afterEach(async () => {
		await prisma.user.deleteMany()
		prisma.$disconnect()
	})

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


	it("Creates Simple Users", async ()=>{
		const randomUserData = generateRandomUser();
		const newUser = await userService.create_user(randomUserData);
		expect(newUser).toMatchObject({
			"id": expect.any(String), 
			"firstname": randomUserData.firstname, 
			"lastname": randomUserData.lastname,
			"sex": "UNKNOWN",
			"email": randomUserData.email,
			"tier": "FREE"
		})
	})

	it("Duplicate Email Fails", async () => {
		const randomUserData = generateRandomUser();
		const newUser1 = await userService.create_user(randomUserData);
		const newUser2 = await userService.create_user(randomUserData);
		expect(newUser1).toMatchObject({
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
		const randomUserData = generateRandomUser()
		const newUser = await userService.create_user(randomUserData);
		const loginData : UserLoginDto = {email: randomUserData.email, password: randomUserData.password};
		const connectedUser = await userService.login_user(loginData);
		console.log(connectedUser)
		expect(connectedUser).not.toBeInstanceOf(ErrorMessage);
		try
		{
			const publicKey = await jose.importSPKI(JWTPUBLICKEY, 'EdDSA');
			const {payload, protectedHeader} = await jose.jwtVerify(connectedUser as string, publicKey, {'algorithms':['EdDSA']});
			expect(payload['id']).toMatch(newUser['id']);
		}
		catch(e)
		{
			fail(e.message)
		}

	})



})