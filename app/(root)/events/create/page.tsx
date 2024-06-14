import { auth } from '@clerk/nextjs/server'

import EventForm from '@/components/shared/event-form'

export default function CreateEvent() {
  const { sessionClaims } = auth()

  const userId = sessionClaims?.userId as string

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper text-3xl font-semibold text-center sm:text-left">
          Cadastre um evento
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} type="Cadastrar" />
      </div>
    </>
  )
}
