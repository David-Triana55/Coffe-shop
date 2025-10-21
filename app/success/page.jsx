export default function SuccessPage () {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen text-center px-6'>
      <div className='max-w-md bg-white shadow-lg rounded-2xl p-8 border '>
        <h1 className='text-4xl font-extrabold text-[#4A3728] mb-4'>
          ¡Pago aprobado!
        </h1>
        <p className='text-gray-700 text-lg leading-relaxed'>
          Tu compra se ha procesado <span className='font-semibold'>exitosamente</span>.

        </p>

        <div className='mt-6 text-gray-600'>
          <p>
            Puedes consultar los detalles de tu factura en la sección{' '}
            <span className='font-semibold text-gray-800'>Perfil</span>, dentro del apartado{' '}
            <span className='font-semibold text-gray-800'>Historial de facturas</span>.
          </p>
        </div>

        <a
          href='/'
          className='mt-8 inline-block px-6 py-3  text-white bg-[#4A3728] hover:bg-[#5D4037] rounded-lg font-semibold text-base transition-colors'
        >
          Volver al inicio
        </a>
      </div>
    </main>
  )
}
