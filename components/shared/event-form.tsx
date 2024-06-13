'use client'

import 'react-datepicker/dist/react-datepicker.css'

import { zodResolver } from '@hookform/resolvers/zod'
import { ptBR } from 'date-fns/locale/pt-BR'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { eventDefaultValues } from '@/constants'
import { createEvent, updateEvent } from '@/lib/actions/event.actions'
import { IEvent } from '@/lib/database/models/event.model'
import { useUploadThing } from '@/lib/uploadthing'
import { eventFormSchema } from '@/lib/validator'

import { Button } from '../ui/button'
import { Checkbox } from '../ui/checkbox'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import Dropdown from './dropdown'
import FileUploader from './file-uploader'

type EventFormProps = {
  userId: string
  type: 'Cadastrar' | 'Atualizar'
  event?: IEvent
  eventId?: string
}

export default function EventForm({
  userId,
  type,
  event,
  eventId,
}: EventFormProps) {
  const [files, setFiles] = useState<File[]>([])
  const initialValues =
    event && type === 'Atualizar'
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues
  const router = useRouter()

  const { startUpload } = useUploadThing('imageUploader')

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  })

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {
    let uploadedImageUrl = values.imageUrl

    if (files.length > 0) {
      const uploadedImages = await startUpload(files)

      if (!uploadedImages) {
        return
      }

      uploadedImageUrl = uploadedImages[0].url
    }

    if (type === 'Cadastrar') {
      try {
        const newEvent = await createEvent({
          event: { ...values, imageUrl: uploadedImageUrl },
          userId,
          path: '/profile',
        })

        if (newEvent) {
          form.reset()
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }

    if (type === 'Atualizar') {
      if (!eventId) {
        router.back()
        return
      }

      try {
        const updatedEvent = await updateEvent({
          userId,
          event: { ...values, imageUrl: uploadedImageUrl, _id: eventId },
          path: `/events/${eventId}`,
        })

        if (updatedEvent) {
          form.reset()
          router.push(`/events/${updatedEvent._id}`)
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  registerLocale('pt-BR', ptBR)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Titulo do evento *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Será o titulo público do evento"
                    {...field}
                    className="input-field"
                    minLength={3}
                    maxLength={50}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Categoria do evento *</FormLabel>
                <FormControl>
                  <Dropdown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Descrição do evento *</FormLabel>
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Forneça informações sobre o evento"
                    {...field}
                    className="textarea rounded-2xl"
                    minLength={3}
                    maxLength={400}
                    required
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Imagem do evento</FormLabel>
                <FormControl className="h-72">
                  <FileUploader
                    onFieldChange={field.onChange}
                    imageUrl={field.value}
                    setFiles={setFiles}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Localização do evento *</FormLabel>
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/location-grey.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                    />

                    <Input
                      placeholder="Informe a localização"
                      {...field}
                      className="input-field"
                      minLength={3}
                      maxLength={50}
                      required
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Data e hora de início *</FormLabel>
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Escolher:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                      locale="pt-BR"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Data e hora de término *</FormLabel>
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/calendar.svg"
                      alt="calendar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <p className="ml-3 whitespace-nowrap text-grey-600">
                      Escolher:
                    </p>
                    <DatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat="dd/MM/yyyy h:mm aa"
                      wrapperClassName="datePicker"
                      locale="pt-BR"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/real-brl.svg"
                      alt="dollar"
                      width={20}
                      height={20}
                      className="filter-grey"
                    />
                    <Input
                      type="number"
                      placeholder="Valor para participar"
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 4) {
                          field.onChange(e)
                        }
                      }}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="isFree"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Gratuito
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Link do evento *</FormLabel>
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/link.svg"
                      alt="link"
                      width={24}
                      height={24}
                    />

                    <Input
                      placeholder="URL"
                      {...field}
                      className="input-field"
                      minLength={7}
                      maxLength={40}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="button"
        >
          {form.formState.isSubmitting
            ? type === 'Atualizar'
              ? 'Atualizando evento...'
              : 'Cadastrando...'
            : `${type} Evento`}
        </Button>
      </form>
    </Form>
  )
}
