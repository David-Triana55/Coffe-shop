export default function PendingPage () {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen text-center'>
      <h1 className='text-3xl font-bold text-yellow-500'>Pago pendiente ⏳</h1>
      <p className='mt-4 text-lg'>
        Tu pago está siendo procesado. Te notificaremos cuando se confirme.
      </p>
      <a
        href='/'
        className='mt-6 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600'
      >
        Volver al inicio
      </a>
    </main>
  )
}
