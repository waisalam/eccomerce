import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, code } = await req.json()

  const existingSeller = await prisma.seller.findUnique({
    where: { email },
  })

  if (!existingSeller) {
    return new Response('Seller not found', { status: 404 })
  }

  if (!existingSeller.verificationCode) {
    return new Response('No OTP was sent or OTP expired', { status: 400 })
  }

  if (existingSeller.verificationCode !== code) {
    return new Response('Invalid OTP', { status: 400 })
  }

  // OTP is valid → update user
  await prisma.seller.update({
    where: { email },
    data: { verificationCode: null, isVerified: true },
  })

  return new Response(JSON.stringify({ message: 'OTP verified successfully' }), { status: 200 })
}
