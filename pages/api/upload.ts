import { NextApiRequest, NextApiResponse } from 'next'
import multer from 'multer'
import path from 'path'
import { promises as fs } from 'fs'

const upload = multer({
  storage: multer.diskStorage({
    destination: async (req, file, cb) => {
      const uploadDir = path.join(process.cwd(), 'public/uploads')
      await fs.mkdir(uploadDir, { recursive: true })
      cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  }
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const runMiddleware = (req: any, res: any, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    await runMiddleware(req, res, upload.single('image'))
    
    const file = (req as any).file
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const fileUrl = `/uploads/${file.filename}`
    res.status(200).json({ url: fileUrl })
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' })
  }
}