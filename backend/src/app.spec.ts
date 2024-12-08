import * as dotenv from "dotenv" 
dotenv.config({path: "../.env"});

describe("App Suite", () => {
	it("Loaded JWT PRIVATE KEY", () => {
		expect(process.env.JWT_SECRET).not.toBeUndefined()
	})
})