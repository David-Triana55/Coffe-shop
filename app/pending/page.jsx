export default function PendingPage () {
  return (
    <main className='flex flex-col items-center justify-center min-h-screen text-center px-6'>
      <div className='max-w-md bg-white shadow-lg rounded-2xl p-8 border'>
        <h1 className='text-4xl font-extrabold text-[#4A3728] mb-4'>
          Pago pendiente
        </h1>
        <p className='text-gray-700 text-lg leading-relaxed'>
          Tu pago está siendo <span className='font-semibold'>procesado</span>.
          <br />
          Te notificaremos una vez sea confirmado.
        </p>

        <a
          href='/'
          className='mt-8 inline-block px-6 py-3 text-white bg-[#4A3728] hover:bg-[#5D4037] rounded-lg font-semibold text-base transition-colors'
        >
          Volver al inicio
        </a>
      </div>
    </main>
  )
}
