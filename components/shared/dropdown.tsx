import { X } from 'lucide-react'
import { startTransition, useEffect, useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  createCategory,
  deleteCategory,
  getAllCategories,
} from '@/lib/actions/category.actions'
import { ICategory } from '@/lib/database/models/category.model'

import { Input } from '../ui/input'

type DropdownProps = {
  value?: string
  onChangeHandler?: () => void
}

export default function Dropdown({ value, onChangeHandler }: DropdownProps) {
  const [categories, setCategories] = useState<ICategory[]>([])
  const [newCategory, setNewCategory] = useState('')

  const handleAddCategory = () => {
    createCategory({
      categoryName: newCategory.trim(),
    }).then((category) => {
      setCategories((prevState) => [...prevState, category])
    })
  }

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId)
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category._id !== categoryId),
      )
      toast.success('Categoria excluída com sucesso!')
    } catch (error) {
      toast.error('Erro ao excluir categoria!')
    }
  }

  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategories()

      categoryList && setCategories(categoryList as ICategory[])
    }

    getCategories()
  }, [])

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Selecionar" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <div key={category._id} className="relative">
              <SelectItem
                key={category._id}
                value={category._id}
                className="select-item p-regular-14"
              >
                {category.name}
              </SelectItem>

              <X
                onClick={() => handleDeleteCategory(category._id)}
                className="absolute top-1/2 -translate-y-1/2 right-1.5 
                cursor-pointer hover:text-red-500 transition-all duration-300"
              />
            </div>
          ))}

        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Adicione uma nova categoria
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Nova Categoria *</AlertDialogTitle>
              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Nome da categoria"
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                  maxLength={20}
                  required
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startTransition(handleAddCategory)}
                disabled={!newCategory.trim()}
                className={!newCategory.trim() ? 'cursor-not-allowed' : ''}
              >
                Adicionar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  )
}
