import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth/[...nextauth]'
import { prisma } from '../../lib/prisma'
import { getClientKeyFromRequestHeaders, isRateLimited } from '../../lib/rateLimiter'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const session = await getServerSession(req, res, authOptions)
      if (!session?.user?.id) {
        return res.status(401).json({ message: 'Unauthorized' })
      }

      const clientKey = getClientKeyFromRequestHeaders(req.headers as any)
      const { limited } = isRateLimited(clientKey + ':createPost', 5 * 60 * 1000, 30)
      if (limited) {
        return res.status(429).json({ message: 'Too many requests' })
      }

      const { title, content, excerpt, category, image } = req.body as Record<string, string>

      if (!title || !content) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const post = await prisma.post.create({
        data: {
          title,
          content,
          excerpt,
          category,
          image,
          authorId: session.user.id,
          published: true,
        },
      })

      return res.status(201).json({ post })
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  if (req.method === 'GET') {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      })
      return res.status(200).json({ posts })
    } catch (e) {
      return res.status(500).json({ message: 'Internal server error' })
    }
  }

  return res.status(405).json({ message: 'Method not allowed' })
}




