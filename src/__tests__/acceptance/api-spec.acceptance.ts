import {Client, createRestAppClient, expect} from '@loopback/testlab';
import {PokedexApplication} from '../../application';
import {SearchPokemon} from '../../models';
import {testdb} from '../datasources/testdb.datasource';
import {givenEmptyDatabase, givenPokemonRow} from '../helpers/database.helper';

describe('Pokedex (acceptance)', () => {
  let app: PokedexApplication;
  let client: Client;

  beforeEach(givenEmptyDatabase);
  before(givenRunningApp);
  after(async () => {
    await app.stop();
  });

  it('retrieves pokemon by ID', async () => {
    // arrange
    const id = '001';
    const pokemonRow1 = await givenPokemonRow({id: id});
    // act
    const response = await client.get('/pokemon/id/' + id);
    // assert
    expect(response.body).to.eql(pokemonRow1.info);
  });

  it('adds 1 padded 0 and retrieves pokemon by ID', async () => {
    // arrange
    const pokemonRow1 = await givenPokemonRow({id: '001'});
    // act
    const response = await client.get('/pokemon/id/01');
    // assert
    expect(response.body).to.eql(pokemonRow1.info);
  });

  it("adds 2 padded 0's and retrieves pokemon by ID", async () => {
    // arrange
    const pokemonRow1 = await givenPokemonRow({id: '001'});
    // act
    const response = await client.get('/pokemon/id/1');
    // assert
    expect(response.body).to.eql(pokemonRow1.info);
  });

  it('retrieves pokemon by name', async () => {
    // arrange
    const name = 'Bulbasaur';
    const pokemonRow1 = await givenPokemonRow({id: '001', name: name});
    // act
    const response = await client.get('/pokemon/name/' + name);
    // assert
    expect(response.body).to.eql(pokemonRow1.info);
  });

  it('retrieves pokemon by name with a lowercase letter', async () => {
    // arrange
    const pokemonRow1 = await givenPokemonRow({id: '001', name: 'Bulbasaur'});
    // act
    const response = await client.get('/pokemon/name/bulbasaur');
    // assert
    expect(response.body).to.eql(pokemonRow1.info);
  });

  it('favorites a pokemon', async () => {
    // arrange
    await givenPokemonRow({id: '001', favorite: false});
    // act
    const response = await client.patch('/pokemon/favorite/001');
    // assert
    expect(response.body).to.eql({message: 'Success'});
  });

  it('unfavorites a pokemon', async () => {
    // arrange
    await givenPokemonRow({id: '001', favorite: true});
    // act
    const response = await client.patch('/pokemon/unfavorite/001');
    // assert
    expect(response.body).to.eql({message: 'Success'});
  });

  it('searches for pokemon by name', async () => {
    // arrange
    const pokemonRow1 = await givenPokemonRow({id: '001', name: 'Bulbasaur'});
    const pokemonRow2 = await givenPokemonRow({id: '002', name: 'Bullus'});
    await givenPokemonRow({id: '003', name: 'Canivor'});
    const pokemonRow4 = await givenPokemonRow({id: '004', name: 'CarniBul'});
    const pokemonRow5 = await givenPokemonRow({id: '005', name: 'Carnibul'});

    const searchTerms: SearchPokemon = new SearchPokemon({
      nameFilter: 'bul',
    });

    // act
    const response = await client.post('/pokemon/').send(searchTerms);
    // assert
    expect(response.body).to.eql([
      pokemonRow1.info,
      pokemonRow2.info,
      pokemonRow4.info,
      pokemonRow5.info,
    ]);
  });

  it('searches for favorite pokemon', async () => {
    // arrange
    const pokemonRow1 = await givenPokemonRow({id: '001', favorite: true});
    await givenPokemonRow({id: '002', name: 'Bullus'});
    const pokemonRow2 = await givenPokemonRow({id: '003', favorite: true});
    const pokemonRow3 = await givenPokemonRow({id: '004', favorite: true});
    await givenPokemonRow({id: '005', name: 'Carnibul'});

    const searchTerms: SearchPokemon = new SearchPokemon({
      favoriteFilter: true,
    });

    // act
    const response = await client.post('/pokemon/').send(searchTerms);
    // assert
    expect(response.body).to.eql([
      pokemonRow1.info,
      pokemonRow2.info,
      pokemonRow3.info,
    ]);
  });

  it('searches for pokemon by type', async () => {
    // arrange
    const pokemonRow1 = await givenPokemonRow({
      id: '001',
      type1: 'Grass',
      type2: 'Monster',
    });
    const pokemonRow2 = await givenPokemonRow({
      id: '002',
      type1: 'Bug',
      type2: 'Grass',
    });
    await givenPokemonRow({id: '003', type1: 'Water', type2: 'Fire'});
    const pokemonRow4 = await givenPokemonRow({id: '004', type1: 'Grass'});
    await givenPokemonRow({id: '005', type1: 'Electric', type2: 'Monster'});

    const searchTerms: SearchPokemon = new SearchPokemon({
      typeFilter: 'Grass',
    });

    // act
    const response = await client.post('/pokemon/').send(searchTerms);
    // assert
    expect(response.body).to.eql([
      pokemonRow1.info,
      pokemonRow2.info,
      pokemonRow4.info,
    ]);
  });

  it('searches for and limits the results to 5', async () => {
    // arrange
    const pokemonRow1 = await givenPokemonRow({id: '001'});
    const pokemonRow2 = await givenPokemonRow({id: '002'});
    const pokemonRow3 = await givenPokemonRow({id: '003'});
    const pokemonRow4 = await givenPokemonRow({id: '004'});
    const pokemonRow5 = await givenPokemonRow({id: '005'});
    await givenPokemonRow({id: '006'});

    const searchTerms: SearchPokemon = new SearchPokemon({
      limit: 5,
    });

    // act
    const response = await client.post('/pokemon/').send(searchTerms);
    // assert
    expect(response.body).to.eql([
      pokemonRow1.info,
      pokemonRow2.info,
      pokemonRow3.info,
      pokemonRow4.info,
      pokemonRow5.info,
    ]);
  });

  it('correctly paginates', async () => {
    // arrange
    await givenPokemonRow({id: '001'});
    await givenPokemonRow({id: '002'});
    await givenPokemonRow({id: '003'});
    await givenPokemonRow({id: '004'});
    await givenPokemonRow({id: '005'});
    const pokemonRow6 = await givenPokemonRow({id: '006'});
    const pokemonRow7 = await givenPokemonRow({id: '007'});
    const pokemonRow8 = await givenPokemonRow({id: '008'});
    const pokemonRow9 = await givenPokemonRow({id: '009'});
    const pokemonRow10 = await givenPokemonRow({id: '010'});
    await givenPokemonRow({id: '011'});

    const searchTerms: SearchPokemon = new SearchPokemon({
      limit: 5,
      offset: 5,
    });

    // act
    const response = await client.post('/pokemon/').send(searchTerms);
    // assert
    expect(response.body).to.eql([
      pokemonRow6.info,
      pokemonRow7.info,
      pokemonRow8.info,
      pokemonRow9.info,
      pokemonRow10.info,
    ]);
  });

  it('uses all the filters at once', async () => {
    // arrange
    const pokemonRow1 = await givenPokemonRow({
      id: '001',
      name: 'Bulb',
      type1: 'Grass',
      type2: 'Monster',
      favorite: true,
    });
    await givenPokemonRow({
      id: '002',
      name: 'Squ',
      type1: 'Water',
      type2: 'Frog',
      favorite: false,
    });
    await givenPokemonRow({
      id: '003',
      name: 'Char',
      type1: 'Fire',
      type2: 'Lizard',
      favorite: true,
    });
    await givenPokemonRow({
      id: '004',
      name: 'Hitman',
      type1: 'Fighting',
      type2: 'Flight',
      favorite: false,
    });
    const pokemonRow5 = await givenPokemonRow({
      id: '005',
      name: 'LightBulb',
      type1: 'Grass',
      type2: 'Fairy',
      favorite: true,
    });

    const searchTerms: SearchPokemon = new SearchPokemon({
      favoriteFilter: true,
      typeFilter: 'Grass',
      nameFilter: 'bul',
    });

    // act
    const response = await client.post('/pokemon/').send(searchTerms);
    // assert
    expect(response.body).to.eql([pokemonRow1.info, pokemonRow5.info]);
  });

  async function givenRunningApp() {
    app = new PokedexApplication({
      rest: {
        port: 0,
      },
    });
    await app.boot();

    // change to use the test datasource after the app has been booted so that
    // it is not overriden
    app.dataSource(testdb);
    await app.start();

    client = createRestAppClient(app);
  }
});
