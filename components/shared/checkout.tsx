import { loadStripe } from '@stripe/stripe-js'
import { useEffect } from 'react'

import { checkoutOrder } from '@/lib/actions/order.actions'
import { IEvent } from '@/lib/database/models/event.model'

import { Button } from '../ui/button'

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function Checkout({
  event,
  userId,
}: {
  event: IEvent
  userId: string
}) {
  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    if (query.get('success')) {
      console.log('Pedido realizado! Você receberá um email de confirmação.')
    }

    if (query.get('canceled')) {
      console.log(
        'Pedido cancelado – continue comprando e finalizando a compra quando estiver pronto.',
      )
    }
  }, [])

  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: event.price,
      isFree: event.isFree,
      buyerId: userId,
    }

    await checkoutOrder(order)
  }

  return (
    <form action={onCheckout} method="post">
      <Button type="submit" role="link" size="lg" className="button sm:w-fit">
        {event.isFree ? 'Obter Ingresso' : 'Comprar Ingresso'}
      </Button>
    </form>
  )
}
