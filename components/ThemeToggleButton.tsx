'use client'
import {useEffect, useState} from 'react'
import {useTheme} from 'next-themes'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSun, faMoon} from '@fortawesome/free-solid-svg-icons'

export function ThemeToggleButton({className=''}:{className?:string}) {
  const {resolvedTheme, setTheme} = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <button
      onClick={() => mounted && setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      className={`flex items-center gap-x-2 rounded-md px-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 ${className}`}
      aria-label="Przełącz motyw"
    >
      <span className="text-sm min-w-[4ch]">
        {mounted ? (resolvedTheme === 'dark' ? 'Jasny' : 'Ciemny') : ''}
      </span>
      {mounted && (
        <FontAwesomeIcon
          icon={resolvedTheme === 'dark' ? faSun : faMoon}
          className="h-4 w-4"
        />
      )}
    </button>
  )
}
