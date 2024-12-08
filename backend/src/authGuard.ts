import {Injectable, CanActivate, ExecutionContext} from "@nestjs/common"
import {Request} from "express"
import * as jose from "jose"
import prisma from "@src/prisma"
import {User} from "@prisma/client"

export const JWTPUBLICKEY:string=`-----BEGIN PUBLIC KEY-----\n${process.env.JWT_PUBLIC}\n-----END PUBLIC KEY-----`;

export interface AuthRequest extends Request
{
	user:  User
}

@Injectable()
export class AuthGuard implements CanActivate
{
	async authenticateUser(req: Request)
	{
		const cookies = req.cookies;
		if (!cookies || !cookies['id_key'])
			return false;
		const user_jwt  = cookies['id_key'];
		try
		{
			const publicKey = await jose.importSPKI(JWTPUBLICKEY, 'EdDSA');
			const {payload, protectedHeader} = await jose.jwtVerify(user_jwt, publicKey, {'algorithms':['EdDSA']});
			const is_valid_user = await prisma.user.count({where: {id: payload['id']}})
			if (is_valid_user !== 1)
				return false;
			req['user'] = payload['id'];
			return true;
		}
		catch(e)
		{
			console.log(e);
			return false;
		}
	}

	canActivate(context: ExecutionContext): Promise<boolean> {
		let request = context.switchToHttp().getRequest<Request>();
		return  this.authenticateUser(request);
	}
}

