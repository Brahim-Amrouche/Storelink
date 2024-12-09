import {importPKCS8, importSPKI} from "jose"
import {JWTPUBLICKEY} from "@src/authGuard"
import {JWTPRIVATEKEY} from "@src/users/user.service"

describe("App Suite", () => {
	it("Loaded JWT PRIVATE KEY", () => {
		expect(process.env.JWT_SECRET).not.toBeUndefined()
	})

	it("JWT PRIVATE IS VALID KEY", async () => {
		try
		{
			await expect(importPKCS8(JWTPRIVATEKEY, 'EdDSA')).resolves.toBeDefined();
		}
		catch(e)
		{
			throw new Error(e.message)
		}
	})

	it("Loaded JWT PUBLIC KEY", () => {
		expect(process.env.JWT_PUBLIC).not.toBeUndefined()
	})

	it("JWT PUBLIC IS VALID", async () => {
		try
		{
			await expect(importSPKI(JWTPUBLICKEY, 'EdDSA')).resolves.toBeDefined()
		}
		catch(e)
		{
			throw new Error(e.message)
		}
	})
})