import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';
import {ValidationError} from '../errors/ValidationError';

const pattern = new RegExp('^[0-9]+$');
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: IdCheckInterceptor.BINDING_KEY}})
export class IdCheckInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${IdCheckInterceptor.name}`;

  /*
  constructor() {}
  */

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this);
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // Add pre-invocation logic here
    let id = invocationCtx.args[0];
    invocationCtx.args[0] = this.validateId(id);

    let result: any = await next();

    return result;
  }

  validateId(id: string) {
    if (id.length > 0 && id.length < 5) {
      if (pattern.test(id)) {
        //PAD for ease
        if (id.length < 2) {
          id = '00' + id;
        } else if (id.length < 3) {
          id = '0' + id;
        }
        return id;
      } else {
        let err = new ValidationError('Id should be numeric');
        err.statusCode = 422;
        throw err;
      }
    } else {
      let err = new ValidationError('Id string to long, max length is 4');
      err.statusCode = 422;
      throw err;
    }
  }
}
