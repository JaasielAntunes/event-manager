'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getAllCategories } from '@/lib/actions/category.actions'
import { ICategory } from '@/lib/database/models/category.model'
import { formUrlQuery, removeKeysFromQuery } from '@/lib/utils'

export default function CategoryFilter() {
  const [categories, setCategories] = useState<ICategory[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories()

      categoryList && setCategories(categoryList as ICategory[])
    }

    getCategories()
  }, [])

  const onSelectCategory = (category: string) => {
    let newUrl = ''

    if (category && category !== 'Todas') {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'category',
        value: category,
      })
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ['category'],
      })
    }

    router.push(newUrl, { scroll: false })
  }

  return (
    <Select onValueChange={(value: string) => onSelectCategory(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Selecionar categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Todas" className="select-item p-regular-14">
          Todas
        </SelectItem>

        {categories.map((category) => (
          <SelectItem
            value={category.name}
            key={category._id}
            className="select-item p-regular-14"
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
