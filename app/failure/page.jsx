export default function FailurePage () {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen text-center'>
      <h1 className='text-3xl font-bold text-red-600'>Pago rechazado ❌</h1>
      <p className='mt-4 text-lg'>
        Hubo un problema al procesar tu pago. Intenta nuevamente o usa otro método.
      </p>
      <a
        href='/'
        className='mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'
      >
        Volver al inicio
      </a>
    </main>
  )
}
