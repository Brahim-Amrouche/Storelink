import {Module} from "@nestjs/common"
import {UserController} from "@src/users/user.controller"
import {UserService} from "@src/users/user.service"

@Module({
	controllers:[UserController],
	providers: [UserService]
})
export class UserModule
{}