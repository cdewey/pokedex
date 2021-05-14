import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise
} from '@loopback/core';

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: TypesInterceptor.BINDING_KEY}})
export class TypesInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${TypesInterceptor.name}`;

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
    try {
      // Add pre-invocation logic here
      let result = await next();
      let types = []
      if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].type) {
            types.push(result[i].type);
          }
        }
        result = types;
      }
      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
