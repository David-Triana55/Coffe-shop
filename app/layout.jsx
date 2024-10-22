import './globals.css'
import { afacad } from '../components/fonts'
import NavBar from '@/components/Navbar/Navbar'
import Checkout from '@/components/Checkout/Checkout'

export default function RootLayout ({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='icon' href='/logo.svg' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <meta name='description' content='Generated by create next app' />
        <meta name='author' content='Chore' />
        <title>Coffee Shop</title>
      </head>

      <body
        className={` ${afacad.className} relative h-full antialiased`}
      >
        <NavBar />
        <Checkout />

        {children}
      </body>
    </html>
  )
}
