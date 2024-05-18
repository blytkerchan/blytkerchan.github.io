export class RemoteError extends Error {
  constructor({ name, message }) {
    super(message);
    this.name = name;
  }
}
