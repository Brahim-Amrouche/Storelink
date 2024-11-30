import {PrismaClient} from "@prisma/client"

let globalPrisma = globalThis as unknown as {prisma: PrismaClient}

const prisma = globalPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalPrisma.prisma = prisma

export default prisma