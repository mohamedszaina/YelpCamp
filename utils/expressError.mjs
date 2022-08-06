export class expressError extends Error {
  constructor(message, statuscode) {
    super();
    this.message = message;
    this.statuscode = statuscode;
  }
}
