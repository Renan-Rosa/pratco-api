import { products, restaurants } from '@/db/schema'
import { db } from '@/db/connection'
import Elysia, { t } from 'elysia'
import { eq } from 'drizzle-orm'

export const registerProduct = new Elysia().post(
  '/products',
  async ({ body, set }) => {
    const { name, description, priceInCents, restaurantId } = body

    // Verifica se o restaurante existe
    const restaurant = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
  

    if (!restaurant) {
      set.status = 404
      return { error: 'Restaurant not found' }
    }

    // Insere o novo produto
    await db.insert(products).values({
      name,
      description,
      priceInCents,
      restaurantId,
    })

    set.status = 204
  },
  {
    body: t.Object({
      name: t.String(),
      description: t.Optional(t.String()), // descrição é opcional
      priceInCents: t.Number(), // preço deve ser fornecido em centavos
      restaurantId: t.String(), // ID do restaurante ao qual o produto pertence
    }),
  },
)
