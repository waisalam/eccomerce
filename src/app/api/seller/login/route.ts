import {prisma} from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export async function POST(req:Request) {
    const {email, password} = await req.json()

    const existingSeller = await prisma.seller.findUnique({where: {email}})
    if(!existingSeller){
        return new Response('seller not registered ', {status:401})
    }

    if(!existingSeller.password){
        return new Response('no password found',{status:400})
    }
const isMatch = await bcrypt.compare(password, existingSeller.password)

if(!isMatch){
    return new Response('please enter correct password', {status:400})
}
const secretJwt= process.env.JWT_SECRET || "fds4a7f7998#fdsasdf"
const token = jwt.sign({email, id: existingSeller.id}, secretJwt)

return new Response(JSON.stringify({message:'user logged in Successfully', token}), {status:201
    
})
}