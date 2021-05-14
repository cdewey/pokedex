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
@injectable({tags: {key: InfoInterceptor.BINDING_KEY}})
export class InfoInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${InfoInterceptor.name}`;

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
    console.log(invocationCtx.args)
    try {
      // Add pre-invocation logic here
      let result: any = await next();
      // Add post-invocation logic here
      //console.log(result);
      let pokemon = []
      if (Array.isArray(result)) {
        for (let i = 0; i < result.length; i++) {
          pokemon.push(result[i].info);
        }
        result = pokemon;
      }
      else {
        result = result.info;
      }

      return result;
    } catch (err) {
      // Add error handling logic here
      throw err;
    }
  }
}
