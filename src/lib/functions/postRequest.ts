import fetch from 'node-fetch'
import { z, ZodSchema } from 'zod'
import { InternalServerError } from '../errors/InternalServerError'

export async function postRequest<S extends ZodSchema>(
  url: string,
  body: any,
  schema: S
): Promise<z.infer<S>> {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body)
  })

  if (!response.ok) {
    throw new InternalServerError(`Request to ${url} returned ${response.status}`)
  }
  const jsonResponse = await response.json()
  const validatedResponse = schema.safeParse(jsonResponse)
  if (!validatedResponse.success) throw new InternalServerError(validatedResponse.error?.message)

  return validatedResponse.data
}
