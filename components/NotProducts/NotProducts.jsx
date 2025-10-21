export default function NotProducts ({ product }) {
  return (
    <div className='flex flex-col items-start justify-start h-screen px-2'>
      <h1 className='text-2xl font-bold text-center'>No hay productos disponibles {product ? ` para: ${product}` : ''} </h1>
    </div>
  )
}
