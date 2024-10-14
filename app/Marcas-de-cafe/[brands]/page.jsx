export default function Marcas ({ params }) {
  console.log(params)
  return (
    <h1>
      marca de cafe {params.brands}
    </h1>
  )
}
