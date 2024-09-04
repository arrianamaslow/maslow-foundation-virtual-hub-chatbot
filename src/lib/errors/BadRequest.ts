export class BadRequest extends Error {
  constructor(message = 'Bad request.') {
    super(message)
    this.name = 'BadRequest'
  }
}
