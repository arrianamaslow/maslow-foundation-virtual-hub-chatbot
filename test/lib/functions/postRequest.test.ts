jest.mock('node-fetch')

import { postRequest } from '@/lib/functions/postRequest'
import { when } from 'jest-when'
import { InternalServerError } from '@/lib/errors/InternalServerError'
import { z } from 'zod'

const mockFetch = jest.fn()
jest.mock(`node-fetch`, () => {
  return () => mockFetch()
})

describe('fetchData', () => {
  it('returns data when fetch is successful', async () => {
    const response_schema = z.object({ categories: z.array(z.enum(['Other'])) })
    when(mockFetch)
      .calledWith()
      .mockReturnValue({ json: () => ({ categories: ['Other'] }), ok: true })

    expect(postRequest('test url', { message: 'hello' }, response_schema)).resolves.toEqual({
      categories: ['Other']
    })
  })

  it('returns bad request error when post request fails', () => {
    const response_schema = z.object({ categories: z.array(z.enum(['Other'])) })
    when(mockFetch)
      .calledWith()
      .mockReturnValue({ json: () => ({ data: { message: 'MockResp' } }), ok: false })

    expect(postRequest('test url', { message: 'hello' }, response_schema)).rejects.toThrow(
      InternalServerError
    )
  })

  it('returns internal server error in a scenario where zod validation will fail', () => {
    const response_schema = z.object({ categories: z.array(z.enum(['Other'])) })
    when(mockFetch)
      .calledWith()
      .mockReturnValue({ json: () => ({ categorasdasdasdies: ['Otasdasdasdher'] }), ok: true })

    expect(postRequest('test url', { message: 'hello' }, response_schema)).rejects.toThrow(
      InternalServerError
    )
  })
})
