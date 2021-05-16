import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {PokemonController} from '../../../controllers';
import {Pokemon} from '../../../models';
import {PokemonRepository} from '../../../repositories';
import {givenPokemon, givenTypes} from '../../helpers/database.helper';

describe('PokemonController (unit)', () => {
  let repository: StubbedInstanceWithSinonAccessor<PokemonRepository>;
  const bulbasaur: Pokemon = givenPokemon('001');

  beforeEach(givenStubbedRepository);

  describe('findById()', () => {
    it('retrieves a pokemon by name', async () => {
      const controller = new PokemonController(repository);
      repository.stubs.findByPokemonId.resolves(bulbasaur);

      const pokemon = await controller.findById('001');

      expect(pokemon).to.containEql(bulbasaur);
      sinon.assert.calledWithMatch(repository.stubs.findByPokemonId, '001');
    });
  });

  describe('findByName()', () => {
    it('retrieves a pokemon by name', async () => {
      const controller = new PokemonController(repository);
      repository.stubs.findByPokemonName.resolves(bulbasaur);

      const pokemon = await controller.findByName('Bulbasaur');

      expect(pokemon).to.containEql(bulbasaur);
      sinon.assert.calledWithMatch(
        repository.stubs.findByPokemonName,
        'Bulbasaur',
      );
    });
  });

  describe('getTypes()', () => {
    const types: string[] = givenTypes();
    it('retrieves a list of pokemon types', async () => {
      const controller = new PokemonController(repository);
      repository.stubs.getPokemonTypes.resolves(types);

      const result = await controller.getTypes();

      expect(result).to.equal(types);
      sinon.assert.calledOnce(repository.stubs.getPokemonTypes);
    });
  });

  describe('markAsFavorite()', () => {
    it('marks a pokemon as a favorite', async () => {
      const controller = new PokemonController(repository);
      repository.stubs.markAsFavorite.resolves();

      const result = await controller.markAsFavorite('001');

      expect(result).to.undefined();
      sinon.assert.calledWithMatch(repository.stubs.markAsFavorite, '001');
    });
  });

  describe('unmarkAsFavorite()', () => {
    it('unmarks a pokemon as a favorite', async () => {
      const controller = new PokemonController(repository);
      repository.stubs.unmarkAsFavorite.resolves();

      const result = await controller.unmarkAsFavorite('001');

      expect(result).to.undefined();
      sinon.assert.calledWithMatch(repository.stubs.unmarkAsFavorite, '001');
    });
  });

  function givenStubbedRepository() {
    repository = createStubInstance(PokemonRepository);
  }
});
