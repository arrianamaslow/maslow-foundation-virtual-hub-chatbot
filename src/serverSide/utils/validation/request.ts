import { BadRequest } from '@/lib/errors/BadRequest'
import { NextRequest } from 'next/server'
import { z, ZodSchema } from 'zod'
import { checkData } from './validation'

export async function parseAndValidateRequest<S extends ZodSchema>(
  reqBody: NextRequest,
  schema: S
): Promise<z.infer<S>> {
  const data = await reqBody.json()
  return validateJson(data, schema)
}

export async function validateJson<S extends ZodSchema>(
  reqBody: any,
  schema: S
): Promise<z.infer<S>> {
  try {
    return checkData(reqBody, schema)
  } catch (error) {
    if (error instanceof Error) {
      throw new BadRequest(error.message)
    }
    throw new BadRequest()
  }
}
