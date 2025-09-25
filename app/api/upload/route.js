import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dvmfporel',
  api_key: process.env.CLOUDINARY_API_KEY || '373577861554897',
  api_secret: process.env.CLOUDINARY_API_KEY_SECRET || 'B4btiyChZNMJJaSbfxCvVIhw8hY'
})

export async function POST (req) {
  const formData = await req.formData()
  const images = formData.getAll('file')

  if (!images || images.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No se han enviado imágenes' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const urls = []

  for (const image of images) {
    const file = await image.arrayBuffer()
    const buffer = Buffer.from(file)

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, result) => {
          if (err) reject(err)
          else resolve(result)
        })
        .end(buffer)
    })

    urls.push(response.secure_url)
  }

  console.log(urls)

  return new Response(
    JSON.stringify({ urls }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
}
