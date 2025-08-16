import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: 'dvmfporel',
  api_key: '373577861554897',
  api_secret: 'B4btiyChZNMJJaSbfxCvVIhw8hY' // Click 'View API Keys' above to copy your API secret
})

export async function POST (req) {
  const formData = await req.formData()
  console.log('Form Data:', formData)

  const images = formData.getAll('content')
  console.log('Images:', images)

  if (!images || images.length === 0) {
    return new Response('No se ha encontrado el formulario de subida', {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  for (const image of images) {
    const file = await image.arrayBuffer()
    const buffer = Buffer.from(file)

    const response = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({}, (err, result) => {
          if (err) {
            reject(err)
          } else {
            resolve(result)
          }
        })
        .end(buffer)
    })

    console.log('Response:', response.url)
  }

  return new Response(
    JSON.stringify({ message: 'This is the upload route' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
}
