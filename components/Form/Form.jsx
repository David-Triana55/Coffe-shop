'use client'
import './Form.css'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useStore from '@/store'
import SignForm from './Sign'
import LoginForm from './login'

export default function Form ({ type }) {
  const { setLogin, setClientInfo } = useStore(state => state)

  const router = useRouter()
  const [errorSignUp, setErrorSignUp] = useState(null)
  const [errorLogin, setErrorLogin] = useState(null)
  // funcion para enviar el formulario de login
  const handleSbmitLogin = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData(e.target)
      const email = form.get('email')
      const password = form.get('password')

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      if (!response.ok) {
        throw new Error('Credenciales incorrectas')
      }

      const data = await response.json()
      setLogin(data.token, true, data.type)

      const res = await fetch('/api/getInfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`
        }
      })

      if (!res.ok) throw new Error('fallllllla')

      const dataInfo = await res.json()
      setClientInfo(dataInfo)

      router.push('/')
    } catch (error) {
      setErrorLogin(error)
      console.error(error)
    } finally {
      e.target.reset()
    }
  }

  // funcion para enviar el formulario de registro

  const handleSbmitSignUp = async (e) => {
    e.preventDefault()
    try {
      const form = new FormData(e.target)
      const name = form.get('name')
      const lastName = form.get('lastName')
      const number = form.get('number')
      const email = form.get('email')
      const password = form.get('password')
      const type = form.get('type')

      const response = await fetch('/api/signUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, lastName, number, password, email, type })
      })

      console.log(response)

      if (!response.ok) {
        throw new Error('Usuario ya existente')
      }

      router.push('/Sign-in')
    } catch (error) {
      setErrorSignUp(error)
      console.error(error)
    } finally {
      e.target.reset()
    }
  }

  return (
    <>
      {type === 'signUp' && <SignForm handleSbmitSignUp={handleSbmitSignUp} error={errorSignUp} />}
      {type === 'login' && <LoginForm handleSbmitLogin={handleSbmitLogin} error={errorLogin} />}
    </>
  )
}
