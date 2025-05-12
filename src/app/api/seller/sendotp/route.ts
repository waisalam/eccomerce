import { transporter } from "@/lib/nodemail";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { email } = await req.json();
    const existingSeller = await prisma.seller.findUnique({
        where: { email }
    });

    const generatedCode = Math.floor(100000 * Math.random() + 900000).toString()
    if (existingSeller?.isVerified) {
        return new Response("User already registered. Please login.", { status: 401 });
    }
    
    if (existingSeller && !existingSeller.isVerified) {
        // By this point, existingSeller is NOT verified
        await prisma.seller.update({
            where: { email },
            data: { verificationCode: generatedCode, isVerified: false }
        });
    } else {
        await prisma.seller.create({
            data: { email, verificationCode: generatedCode, isVerified: false }
        });
    }
    
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your verification code for creating an account as seller",
        text: `Your verification code is ${generatedCode}`
    });
    
    return new Response("OTP sent to your email", { status: 201 });
    
}
