export default function Tipos ({ params }) {
  console.log(params)
  return (
    <h1>
      Café en Grano {params.types}
    </h1>
  )
}
