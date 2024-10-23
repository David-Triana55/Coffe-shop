export default function PageMarcas ({ params }) {
  console.log(params)
  return (
    <h1 className='mt-16'>
      marca de cafe {params.brands}
    </h1>
  )
}
