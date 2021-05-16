import {expect} from '@loopback/testlab';
import {NameInterceptor} from '../../../interceptors/name.interceptor';

describe('NameInterceptor (unit)', () => {
  describe('convertFirstLettertoUpperCase()', () => {
    it('properly converts a lowercase letter to upper case', async () => {
      const interceptor = new NameInterceptor();

      const results = interceptor.convertFirstLettertoUpperCase('bulb');

      expect(results).to.eql('Bulb');
    });

    it('ignores chars that are not letters', async () => {
      const interceptor = new NameInterceptor();

      const results = interceptor.convertFirstLettertoUpperCase('5bulb');

      expect(results).to.eql('5bulb');
    });
  });
});
