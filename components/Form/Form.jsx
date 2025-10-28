'use client'
import './Form.css'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import useStore from '@/store'
import SignForm from './Sign'
import LoginForm from './login'
import { ROLES } from '@/utils/roles'

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

      setLogin(true, data.role)

      const res = await fetch('/api/userInfo', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Error al obtener la informacion del usuario')

      const dataInfo = await res.json()
      setClientInfo(dataInfo.data)

      console.log(data.role !== ROLES.CLIENTE, 'BOOL')

      if (data.role !== ROLES.CLIENTE) {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
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
      const name = form.get('name').trim()
      const lastName = form.get('lastName').trim()
      const number = form.get('number')
      const email = form.get('email').trim()
      const password = form.get('password').trim()
      const role = ROLES[form.get('role')]

      let brandName

      if (role !== ROLES.CLIENTE) {
        brandName = form.get('brandName').trim()
      }

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, lastName, number, password, email, role, brandName })
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
