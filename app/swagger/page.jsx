// app/swagger/page.js
'use client'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function SwaggerPage () {
  return (
      <div className='pt-10 min-h-screen  text-[#3E2723]'>
        <SwaggerUI url='/api/docs' />

      </div>
  )
}
