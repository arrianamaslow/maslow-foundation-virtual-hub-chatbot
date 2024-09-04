import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'

export default function handleError(error: any): Response {
  switch (error.constructor) {
    case BadRequest:
      return Response.json({ message: error.message }, { status: 400 })
    case ServiceUnavailable:
      return Response.json({ message: error.message }, { status: 503 })
    default:
      return Response.json({ message: error.message }, { status: 500 })
  }
}
