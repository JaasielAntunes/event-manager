import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import React from 'react'

import Collection from '@/components/shared/collection'
import { Button } from '@/components/ui/button'
import { getEventsByUser } from '@/lib/actions/event.actions'
import { getOrdersByUser } from '@/lib/actions/order.actions'
import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'

export default async function Profile({ searchParams }: SearchParamProps) {
  const { sessionClaims } = auth()
  const userId = sessionClaims?.userId as string

  const ordersPage = Number(searchParams?.ordersPage) || 1
  const eventsPage = Number(searchParams?.eventsPage) || 1

  const orders = await getOrdersByUser({ userId, page: ordersPage })

  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || []
  const organizedEvents = await getEventsByUser({ userId, page: eventsPage })

  return (
    <div>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="text-3xl font-semibold text-center sm:text-left">
            Meus Ingressos
          </h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Explore Mais Eventos</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="Nenhum ingresso para evento comprado ainda"
          emptyStateSubtext="Não se preocupe, são muitos eventos emocionantes para explorar!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>

      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="text-3xl font-semibold text-center sm:text-left">
            Eventos Organizados
          </h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create">Criar Um Novo Evento</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="Nenhum evento organizado ainda"
          emptyStateSubtext="Crie algum evento agora"
          collectionType="Events_Organized"
          limit={3}
          page={eventsPage}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>
    </div>
  )
}
