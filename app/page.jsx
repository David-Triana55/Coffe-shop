import LayoutCards from '@/components/WrapperCards/WrapperCards'

export default async function PagePrincipal () {
  return (
    <div className=''>
      <main className=''>
        <h1 className='text-5xl font-bold text-center text-balance'>Productos</h1>

        <LayoutCards />

      </main>
    </div>
  )
}
