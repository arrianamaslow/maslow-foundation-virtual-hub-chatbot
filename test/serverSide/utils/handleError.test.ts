import { BadRequest } from '@/lib/errors/BadRequest'
import { ServiceUnavailable } from '@/lib/errors/ServiceUnavailable'
import handleError from '@/serverSide/utils/handleError'

describe('handleError', () => {
  it('returns a 400 status for BadRequest errors', () => {
    const err = handleError(new BadRequest())
    expect(err.status).toBe(400)
  })

  it('returns a 503 status for ServiceUnavailable errors', () => {
    const err = handleError(new ServiceUnavailable())
    expect(err.status).toBe(503)
  })

  it('returns a 500 status for miscellaneous errors', () => {
    const err = handleError(new Error())
    expect(err.status).toBe(500)
  })
})
