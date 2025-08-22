import { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'
import { prisma } from '../../../lib/prisma'
import { getClientKeyFromRequestHeaders, isRateLimited } from '../../../lib/rateLimiter'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, password } = req.body

  // Basic validation
  if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'Invalid request payload' })
  }

  if (!name.trim() || !email.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email' })
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Password must be at least 8 characters' })
  }

  // Rate limit: 5 signups per 10 minutes per IP
  const clientKey = getClientKeyFromRequestHeaders(req.headers as any)
  const { limited } = isRateLimited(clientKey + ':signup', 10 * 60 * 1000, 5)
  if (limited) {
    return res.status(429).json({ message: 'Too many requests' })
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    res.status(201).json({ message: 'User created successfully', userId: user.id })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' })
  }
}