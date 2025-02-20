import { auth } from '@clerk/nextjs/server'

import EventForm from '@/components/shared/event-form'
import { getEventById } from '@/lib/actions/event.actions'

type UpdateEventProps = {
  params: {
    id: string
  }
}

export default async function UpdateEvent({
  params: { id },
}: UpdateEventProps) {
  const { sessionClaims } = auth()

  const userId = sessionClaims?.userId as string
  const event = await getEventById(id)

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper text-3xl font-semibold text-center sm:text-left">
          Atualize o Evento
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm
          type="Atualizar"
          event={event}
          eventId={event._id}
          userId={userId}
        />
      </div>
    </>
  )
}
