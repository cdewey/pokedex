import {
  injectable,
  Interceptor,
  InvocationContext,
  InvocationResult,
  Provider,
  ValueOrPromise,
} from '@loopback/core';

const pattern = new RegExp('^[a-z]{1}');

/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@injectable({tags: {key: NameInterceptor.BINDING_KEY}})
export class NameInterceptor implements Provider<Interceptor> {
  static readonly BINDING_KEY = `interceptors.${NameInterceptor.name}`;

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
    let name = invocationCtx.args[0];
    console.log(name);
    //capitalise the first letter for ease
    name = this.convertFirstLettertoUpperCase(name);
    console.log(name);
    invocationCtx.args[0] = name;
    // Add pre-invocation logic here
    let result: any = await next();

    return result;
  }

  convertFirstLettertoUpperCase(name: string) {
    if (pattern.test(name)) {
      let firstLetter = name.charAt(0);
      firstLetter = firstLetter.toUpperCase();
      name = firstLetter + name.slice(1);
    }
    return name;
  }
}
