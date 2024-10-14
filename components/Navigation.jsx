import Link from 'next/link'

const links = [
  { href: '/', label: 'Home' },
  { href: '/Juan-Valdez', label: 'Juan Valdez' }
]

export function Navigation () {
  return (
    <header>
      <nav>
        <ul className='flex gap-4 items-center justify-center'>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
