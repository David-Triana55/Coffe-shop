export default function Loading ({ position = 'center' }) {
  return (
    <div className={`flex justify-center items-${position} h-screen `}>
      <div className='animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900' />
    </div>
  )
}
