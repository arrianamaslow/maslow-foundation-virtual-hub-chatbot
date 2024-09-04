import { InternalServerError } from '@/lib/errors/InternalServerError'
import { z, ZodSchema } from 'zod'
import { checkData } from './validation'

export function parseAndValidateResponse<S extends ZodSchema>(
  response: string,
  schema: S
): z.infer<S> {
  try {
    const data = JSON.parse(response)
    return checkData(data, schema)
  } catch (error) {
    if (error instanceof Error) {
      throw new InternalServerError(error.message)
    }
    throw new InternalServerError()
  }
}
