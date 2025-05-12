'use client'

import { PRODUCT_CATEGORIES } from '@/config'
import { useOnClickOutside } from '@/hooks/useOnOutsideClick'
import { useEffect, useRef, useState } from 'react'
import NavItem from './NavItem'

const NavItems = () => {
  const [activeIndex, setActiveIndex] = useState<null | number>(null)
  const navRef = useRef<HTMLUListElement | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveIndex(null)
      }
    }

    document.addEventListener('keydown', handler)

    return () => {
      document.removeEventListener('keydown', handler)
    }
  }, [])

  const isAnyOpen = activeIndex !== null

  useOnClickOutside(navRef, () => setActiveIndex(null))

  return (
    <ul className="flex gap-4 h-full" ref={navRef}>
      {PRODUCT_CATEGORIES.map((category, index) => {
        const handleOpen = () => {
          if (activeIndex === index) {
            setActiveIndex(null)
          } else {
            setActiveIndex(index)
          }
        }

        const isOpen = index === activeIndex

        return (
          <NavItem
            key={category.value}
            category={category}
            handleOpen={handleOpen}
            isOpen={isOpen}
            isAnyOpen={isAnyOpen}
          />
        )
      })}
    </ul>
  )
}

export default NavItems
