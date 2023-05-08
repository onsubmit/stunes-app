export default class Deferred<T> {
  private _promise: Promise<T>;
  private _resolve: (response: T | PromiseLike<T>) => void = (_) => undefined;
  private _reject: (reason?: unknown) => void = (_) => undefined;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }

  get promise() {
    return this._promise;
  }

  resolve(response: T | PromiseLike<T>) {
    this._resolve(response);
  }

  reject(reason?: unknown) {
    this._reject(reason);
  }
}
