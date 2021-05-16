import {InvocationContext} from '@loopback/context';
import {Pokemon, PokemonRow, SearchPokemon} from '../../models';
import {PokemonRepository} from '../../repositories';
import {testdb} from '../datasources/testdb.datasource';

export async function givenPokemonRow(data?: Partial<PokemonRow>) {
  return new PokemonRepository(testdb).create(givenPokemonRowData(data));
}

export function givenPokemonRowData(data?: Partial<PokemonRow>) {
  return Object.assign(
    {
      name: 'generic pokemon name',
      type1: 'Normal',
      type2: 'Bug',
      favorite: false,
      info: givenPokemon(data?.id),
    },
    data,
  );
}

export function givenSearchPokemonData(data?: Partial<SearchPokemon>) {
  return Object.assign(
    {
      nameFilter: null,
      typeFilter: null,
      favoriteFilter: false,
      offset: 0,
      limit: 0,
    },
    data,
  );
}

export function givenInvocationContext(data?: Partial<InvocationContext>) {
  return Object.assign(
    {
      args: [],
    },
    data,
  );
}

export async function givenEmptyDatabase() {
  await new PokemonRepository(testdb).deleteAll();
}

export function givenTypes() {
  return [
    'Bug',
    'Dragon',
    'Electric',
    'Fairy',
    'Fighting',
    'Fire',
    'Flying',
    'Ghost',
    'Grass',
    'Ground',
    'Ice',
    'Normal',
    'Poison',
    'Psychic',
    'Rock',
    'Steel',
    'Water',
  ];
}

export function givenPokemon(id: string | undefined) {
  const bulbasuar: Pokemon = new Pokemon({
    id: id ? id : '001',
    name: 'Bulbasaur',
    classification: 'Seed Pokémon',
    types: ['Grass', 'Poison'],
    resistant: ['Water', 'Electric', 'Grass', 'Fighting', 'Fairy'],
    weaknesses: ['Fire', 'Ice', 'Flying', 'Psychic'],
    weight: {
      minimum: '6.04kg',
      maximum: '7.76kg',
    },
    height: {
      minimum: '0.61m',
      maximum: '0.79m',
    },
    fleeRate: 0.1,
    evolutionRequirements: {
      amount: 25,
      name: 'Bulbasaur candies',
    },
    evolutions: [
      {
        id: 2,
        name: 'Ivysaur',
      },
      {
        id: 3,
        name: 'Venusaur',
      },
    ],
    maxCP: 951,
    maxHP: 1071,
    attacks: {
      fast: [
        {
          name: 'Tackle',
          type: 'Normal',
          damage: 12,
        },
        {
          name: 'Vine Whip',
          type: 'Grass',
          damage: 7,
        },
      ],
      special: [
        {
          name: 'Power Whip',
          type: 'Grass',
          damage: 70,
        },
        {
          name: 'Seed Bomb',
          type: 'Grass',
          damage: 40,
        },
        {
          name: 'Sludge Bomb',
          type: 'Poison',
          damage: 55,
        },
      ],
    },
  });
  return bulbasuar;
}
