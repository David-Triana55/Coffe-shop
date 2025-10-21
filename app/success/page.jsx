export default function SuccessPage () {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen text-center'>
      <h1 className='text-3xl font-bold text-green-600'>¡Pago aprobado! ✅</h1>
      <p className='mt-4 text-lg'>
        Tu compra fue procesada exitosamente. Gracias por confiar en nosotros.
      </p>
      <a
        href='/'
        className='mt-6 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700'
      >
        Volver al inicio
      </a>
    </main>
  )
}
