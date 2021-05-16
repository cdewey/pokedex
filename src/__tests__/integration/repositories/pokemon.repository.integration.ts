import {expect} from '@loopback/testlab';
import {SearchPokemon} from '../../../models';
import {PokemonRepository} from '../../../repositories';
import {testdb} from '../../datasources/testdb.datasource';
import {
  givenEmptyDatabase,
  givenPokemonRow,
  givenSearchPokemonData,
} from '../../helpers/database.helper';

describe('ProductController (unit)', () => {
  //let stubbedDb: StubbedInstanceWithSinonAccessor<PokemonDataSource>;

  beforeEach(givenEmptyDatabase);

  describe('constructSearchFilter()', () => {
    it('properly creates a name filter', async () => {
      const nameFilterInput = 'Bulb';
      const searchTerms = givenSearchPokemonData({nameFilter: nameFilterInput});
      const repository = new PokemonRepository(testdb);

      const expectedFilter = {
        where: {
          name: {
            ilike: '%' + nameFilterInput + '%',
          },
        },
      };
      const results = repository.constructSearchFilter(searchTerms);

      expect(results).to.eql(expectedFilter);
    });

    it('properly creates a type filter', async () => {
      const typeFilterInput = 'Grass';
      const searchTerms = givenSearchPokemonData({typeFilter: typeFilterInput});
      const repository = new PokemonRepository(testdb);

      const expectedFilter = {
        where: {
          or: [{type1: typeFilterInput}, {type2: typeFilterInput}],
        },
      };
      const results = repository.constructSearchFilter(searchTerms);

      expect(results).to.eql(expectedFilter);
    });

    it('properly creates a favorite filter', async () => {
      const favoriteFilterInput = true;
      const searchTerms = givenSearchPokemonData({
        favoriteFilter: favoriteFilterInput,
      });
      const repository = new PokemonRepository(testdb);

      const expectedFilter = {
        where: {
          favorite: favoriteFilterInput,
        },
      };
      const results = repository.constructSearchFilter(searchTerms);

      expect(results).to.eql(expectedFilter);
    });

    it('properly creates a limit filter', async () => {
      const limitInput = 12;
      const searchTerms = givenSearchPokemonData({limit: limitInput});
      const repository = new PokemonRepository(testdb);

      const expectedFilter = {
        where: {},
        limit: limitInput,
      };
      const results = repository.constructSearchFilter(searchTerms);

      expect(results).to.eql(expectedFilter);
    });

    it('properly creates an offset filter', async () => {
      const offsetInput = 24;
      const searchTerms = givenSearchPokemonData({offset: offsetInput});
      const repository = new PokemonRepository(testdb);

      const expectedFilter = {
        where: {},
        offset: offsetInput,
        limit: 10,
      };
      const results = repository.constructSearchFilter(searchTerms);

      expect(results).to.eql(expectedFilter);
    });

    it('properly creates an complex filter', async () => {
      const nameFilterInput = 'Bulb';
      const typeFilterInput = 'Grass';
      const favoriteFilterInput = true;
      const limitInput = 12;
      const offsetInput = 24;
      const searchTerms = givenSearchPokemonData({
        nameFilter: nameFilterInput,
        favoriteFilter: favoriteFilterInput,
        typeFilter: typeFilterInput,
        limit: limitInput,
        offset: offsetInput,
      });
      const repository = new PokemonRepository(testdb);

      const expectedFilter = {
        where: {
          name: {
            ilike: '%' + nameFilterInput + '%',
          },
          favorite: favoriteFilterInput,
          or: [{type1: typeFilterInput}, {type2: typeFilterInput}],
        },
        limit: limitInput,
        offset: offsetInput,
      };
      const results = repository.constructSearchFilter(searchTerms);
      console.log(results);
      expect(results).to.eql(expectedFilter);
    });
  });

  describe('findPokemon()', () => {
    it('properly finds and upwraps mutiple pokemonRows and returns', async () => {
      const pokemonRow1 = await givenPokemonRow({id: '001', favorite: true});
      await givenPokemonRow({id: '002', favorite: false});
      const pokemonRow3 = await givenPokemonRow({id: '003', favorite: true});

      const searchTerms: SearchPokemon = new SearchPokemon({
        favoriteFilter: true,
      });

      const repository = new PokemonRepository(testdb);

      const results = await repository.findPokemon(searchTerms);

      expect(results).to.containDeep([pokemonRow1.info, pokemonRow3.info]);
    });

    it('properly finds and upwraps a single pokemonRows and returns', async () => {
      await givenPokemonRow({id: '001', favorite: false});
      await givenPokemonRow({id: '002', favorite: false});
      const pokemonRow3 = await givenPokemonRow({id: '003', favorite: true});

      const searchTerms: SearchPokemon = new SearchPokemon({
        favoriteFilter: true,
      });

      const repository = new PokemonRepository(testdb);

      const results = await repository.findPokemon(searchTerms);

      expect(results).to.containDeep([pokemonRow3.info]);
    });
  });

  describe('findByPokemonId()', () => {
    it('find the pokemon with the corresponding id', async () => {
      const pokemonRow = await givenPokemonRow({id: '001'});
      const repository = new PokemonRepository(testdb);

      const results = await repository.findByPokemonId('001');

      expect(results).to.containEql(pokemonRow.info);
    });
  });

  describe('findByPokemonName()', () => {
    it('find the pokemon with the corresponding name', async () => {
      const pokemonRow = await givenPokemonRow({id: '001', name: 'BulbaZard'});
      const repository = new PokemonRepository(testdb);

      const results = await repository.findByPokemonName('BulbaZard');

      expect(results).to.containEql(pokemonRow.info);
    });
  });

  // describe('getPokemonTypes()', () => {
  //   beforeEach(givenStubbedDatabase);

  //   it('gets all possible pokemon types by looking over the data', async () => {
  //     let types = [ { type: 'Bug' },
  //     { type: 'Dragon' },
  //     { type: 'Electric' },
  //     { type: 'Fairy' },
  //     { type: 'Fighting' },
  //     { type: 'Fire' },
  //     { type: 'Flying' },
  //     { type: 'Ghost' },
  //     { type: 'Grass' },
  //     { type: 'Ground' },
  //     { type: 'Ice' },
  //     { type: 'Normal' },
  //     { type: 'Poison' },
  //     { type: 'Psychic' },
  //     { type: 'Rock' },
  //     { type: 'Steel' },
  //     { type: 'Water' },
  //     { type: null } ]

  //     const repository =  new PokemonRepository(stubbedDb);
  //     stubbedDb.stubs.execute.resolves(types);

  //     const results = await repository.getPokemonTypes();

  //     expect(results).to.containEql(types);
  //     sinon.assert.calledOnce(stubbedDb.stubs.execute);
  //   });
  // });

  describe('markAsFavorite()', () => {
    it('marks a pokemon as a favorite by using updateById', async () => {
      await givenPokemonRow({id: '001'});
      const repository = new PokemonRepository(testdb);

      const results = await repository.markAsFavorite('001');

      expect(results).to.undefined();
    });
  });

  describe('unmarkAsFavorite()', () => {
    it('unmarks a pokemon as a favorite by using updateById', async () => {
      await givenPokemonRow({id: '002'});
      const repository = new PokemonRepository(testdb);

      const results = await repository.unmarkAsFavorite('002');

      expect(results).to.undefined();
    });
  });

  // function givenStubbedDatabase() {
  //   stubbedDb = createStubInstance(PokemonDataSource);
  // }
});
