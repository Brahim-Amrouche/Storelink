import { NestFactory } from '@nestjs/core';
import {ValidationPipe} from "@nestjs/common"
import { AppModule } from './app.module';
import * as cookieParser from "cookie-parser"

export const JWTPRIVATEKEY:string = `-----BEGIN PRIVATE KEY-----\n${process.env.JWT_SECRET}\n-----END PRIVATE KEY-----`;
export const JWTPUBLICKEY:string=`-----BEGIN PUBLIC KEY-----\n${process.env.JWT_PUBLIC}\n-----END PUBLIC KEY-----`;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // Removes properties that are not in the DTO
    // forbidNonWhitelisted: true, // Throws an error for non-whitelisted properties
    // transform: true,  // Automatically transforms the body into the DTO
  }));
  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
