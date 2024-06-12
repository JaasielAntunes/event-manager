'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { headerLinks } from '@/constants'

export default function NavItems() {
  const pathname = usePathname()

  return (
    <ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
      {headerLinks.map((link) => {
        const isActive = pathname === link.route

        return (
          <li
            key={link.route}
            className={`${
              isActive &&
              'text-primary-500 transition duration-300 hover:text-violet-800'
            } flex-center p-medium-16 whitespace-nowrap`}
          >
            <Link href={link.route}>{link.label}</Link>
          </li>
        )
      })}
    </ul>
  )
}
