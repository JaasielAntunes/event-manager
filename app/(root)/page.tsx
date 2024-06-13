import Image from 'next/image'
import Link from 'next/link'

import Collection from '@/components/shared/collection'
import { Button } from '@/components/ui/button'
import { getAllEvents } from '@/lib/actions/event.actions'
import { SearchParamProps } from '@/types'

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1
  const searchText = (searchParams?.query as string) || ''
  const category = (searchParams?.category as string) || ''

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  })

  return (
    <main>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Hospede, conecte e comemore seus eventos em nossa plataforma!
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Reserve e aprenda dicas úteis de mais de 3 mil mentores em
              empresas de classe mundial com nossa comunidade global.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explore Agora</Link>
            </Button>
          </div>

          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={800}
            height={800}
            className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Impulsionado por <br /> Milhares de eventos
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          {/* <Search />
        <CategoryFilter /> */}
        </div>

        <Collection
          data={events?.data}
          emptyTitle="Nenhum evento encontrado"
          emptyStateSubtext="Volte mais tarde"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </main>
  )
}
