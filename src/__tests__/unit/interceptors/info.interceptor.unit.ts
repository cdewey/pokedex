import {Context, InvocationContext} from '@loopback/core';
import {expect} from '@loopback/testlab';
import {InfoInterceptor} from '../../../interceptors';

describe('InfoInterceptor (unit)', () => {
  describe('intercept()', () => {
    it('properly adds the success message', async () => {
      const invocationCtx = new InvocationContext(
        new Context('one', 'two'),
        {},
        '',
        [],
      );
      const interceptor = new InfoInterceptor();
      const expectedResult = {
        message: 'Success',
      };

      let func = () => {
        return;
      };

      const results = await interceptor.intercept(invocationCtx, func);

      expect(results).to.eql(expectedResult);
    });
  });
});
