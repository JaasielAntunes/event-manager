'use client'

import { SignedIn, SignedOut, useUser } from '@clerk/nextjs'
import Link from 'next/link'

import { IEvent } from '@/lib/database/models/event.model'

import { Button } from '../ui/button'
import Checkout from './checkout'

export default function CheckoutButton({ event }: { event: IEvent }) {
  const { user } = useUser()
  const userId = user?.publicMetadata.userId as string
  const hasEventFinished = new Date(event.endDateTime) < new Date()

  return (
    <div className="flex items-center gap-3">
      {hasEventFinished ? (
        <p className="p-2 text-red-400">
          Desculpe, os ingressos não estão mais disponíveis.
        </p>
      ) : (
        <>
          <SignedOut>
            <Button asChild className="button rounded-full" size="lg">
              <Link href="/sign-in">Obter Ingresso</Link>
            </Button>
          </SignedOut>

          <SignedIn>
            <Checkout event={event} userId={userId} />
          </SignedIn>
        </>
      )}
    </div>
  )
}
