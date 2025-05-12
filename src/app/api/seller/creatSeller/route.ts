import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export async function POST(req: Request) {
    const { name, password, email } = await req.json()

    const existingSeller = await prisma.seller.findUnique({
        where: { email }
    });

    if (!existingSeller) {
        return new Response('Seller not found. Please verify your email first.', { status: 404 })
    }

    if (existingSeller.name && existingSeller.password) {
        return new Response('Seller already registered. Please login.', { status: 409 })
    }

    if (!existingSeller.isVerified) {
        return new Response('Seller email not verified.', { status: 401 })
    }
      

    const hashedPassword = await bcrypt.hash(password, 10)

    const seller= await prisma.seller.update({
        where: { email },
        data: { name, password: hashedPassword }
    })
    const secretjwt = process.env.JWT_SECRET || "afd4s4g987a65fgaugughew8943&*&*Y3"
    const token = jwt.sign({email, id: seller.id} , secretjwt)

    return new Response(JSON.stringify({ message: 'Seller registered successfully.', seller , token}), {
        status: 201
    })
}
