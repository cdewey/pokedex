import {expect} from '@loopback/testlab';
import {ValidationError} from '../../../errors/ValidationError';
import {IdCheckInterceptor} from '../../../interceptors/id-check.interceptor';

describe('IdCheckInterceptor (unit)', () => {
  describe('validateId()', () => {
    it('returns a valid id unchanged', async () => {
      const interceptor = new IdCheckInterceptor();

      const results = interceptor.validateId('001');

      expect(results).to.eql('001');
    });

    it('pads a 2 digit id with one 0', async () => {
      const interceptor = new IdCheckInterceptor();

      const results = interceptor.validateId('11');

      expect(results).to.eql('011');
    });

    it("pads a 1 digit id with two 0's", async () => {
      const interceptor = new IdCheckInterceptor();

      const results = interceptor.validateId('1');

      expect(results).to.eql('001');
    });

    it('fails if the id is to long', async () => {
      const interceptor = new IdCheckInterceptor();

      try {
        interceptor.validateId('1111111');
      } catch (e) {
        expect(e).to.instanceof(ValidationError);
        expect(e.message).to.eql('Id string to long, max length is 4');
      }
    });

    it('fails if the id is to not numeric', async () => {
      const interceptor = new IdCheckInterceptor();

      try {
        interceptor.validateId('abc');
      } catch (e) {
        expect(e).to.instanceof(ValidationError);
        expect(e.message).to.eql('Id should be numeric');
      }
    });
  });
});
