import LayoutCards from '@/components/shared/LayoutCards'

export default async function Home () {
  return (
    <div className=''>
      <main className=''>
        <h1 className='text-5xl font-bold text-center text-balance'>Productos</h1>

        <LayoutCards />

      </main>
    </div>
  )
}
