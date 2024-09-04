import { ZodSchema } from 'zod'

export function checkData<S extends ZodSchema>(data: any, schema: S): any {
  const checkedData = schema.safeParse(data)
  if (!checkedData.success) throw new Error(checkedData.error?.message)
  return checkedData.data
}
