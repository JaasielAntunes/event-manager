import { LinkIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import CheckoutButton from '@/components/shared/checkout-button'
import Collection from '@/components/shared/collection'
import {
  getEventById,
  getRelatedEventsByCategory,
} from '@/lib/actions/event.actions'
import { formatDateTime, formatPrice } from '@/lib/utils'
import { SearchParamProps } from '@/types'
export default async function EventDetails({
  params: { id },
  searchParams,
}: SearchParamProps) {
  const event = await getEventById(id)

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: searchParams.page as string,
  })

  return (
    <div>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt={event.title}
            width={900}
            height={900}
            className="h-full min-h-[300px]"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-5">
              <h2 className="text-2xl font-semibold">{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-16 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? 'Gratuito' : formatPrice(event.price)}
                  </p>
                  <p className="p-medium-16 rounded-full bg-grey-500/10 px-4 py-2.5 text-grey-500">
                    {event.category.name}
                  </p>
                </div>
                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  por{' '}
                  <span className="text-primary-500">
                    {event.organizer.firstName} {event.organizer.lastName}
                  </span>
                </p>
              </div>
            </div>

            <CheckoutButton event={event} />

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  width={32}
                  height={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  <p className="font-semibold">
                    {formatDateTime(event.startDateTime).dateOnly} -{' '}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p className="font-semibold">
                    {formatDateTime(event.endDateTime).dateOnly} -{' '}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="p-regular-20 flex items-center gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  width={32}
                  height={32}
                />
                <p className="p-medium-16 lg:p-regular-20 text-primary-500">
                  {event.location}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-grey-600">Sobre o evento:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <Link href={event.url} target="_blank">
                <p className="flex gap-2 p-medium-16 cursor-pointer lg:p-regular-18 truncate text-primary-500 underline">
                  <LinkIcon /> {event.url}
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="text-2xl font-semibold">Eventos Relacionados</h2>

        <Collection
          data={relatedEvents?.data}
          emptyTitle="Nenhum evento encontrado!"
          emptyStateSubtext="Volte mais tarde!"
          collectionType="All_Events"
          limit={3}
          page={searchParams.page as string}
          totalPages={relatedEvents?.totalPages}
        />
      </section>
    </div>
  )
}
