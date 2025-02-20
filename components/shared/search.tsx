'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'

import { Input } from '../ui/input'

export default function Search({
  placeholder = 'Busque um titulo...',
}: {
  placeholder?: string
}) {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = ''

      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: query,
        })
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ['query'],
        })
      }

      router.push(newUrl, { scroll: false })
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query, searchParams, router])

  const clearQuery = () => {
    setQuery('')
    const newUrl = removeKeysFromQuery({
      params: searchParams.toString(),
      keysToRemove: ['query'],
    })
    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
      <Image
        src="/assets/icons/search.svg"
        alt="search"
        width={24}
        height={24}
      />
      <Input
        type="text"
        value={query}
        placeholder={placeholder}
        maxLength={15}
        onChange={(e) => setQuery(e.target.value)}
        className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {query && (
        <X onClick={clearQuery} className="cursor-pointer text-primary-500" />
      )}
    </div>
  )
}
