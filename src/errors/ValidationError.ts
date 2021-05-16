export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
  }
  statusCode: number;
  messageForUser: string;
}
