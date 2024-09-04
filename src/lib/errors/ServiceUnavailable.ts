export class ServiceUnavailable extends Error {
  constructor(message = 'Service unavailable.') {
    super(message)
    this.name = 'ServiceUnavailable'
  }
}
