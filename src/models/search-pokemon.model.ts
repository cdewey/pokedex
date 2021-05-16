import {Model, model, property} from '@loopback/repository';

@model()
export class SearchPokemon extends Model {
  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 30,
      minLength: 1,
    },
  })
  nameFilter?: string;

  @property({
    type: 'boolean',
  })
  favoriteFilter?: boolean;

  @property({
    type: 'string',
    jsonSchema: {
      maxLength: 30,
      minLength: 1,
    },
  })
  typeFilter?: string;

  @property({
    type: 'number',
    jsonSchema: {
      minimum: 0,
    },
  })
  limit?: number;

  @property({
    type: 'number',
    jsonSchema: {
      minimum: 0,
    },
  })
  offset?: number;

  constructor(data?: Partial<SearchPokemon>) {
    super(data);
  }
}

export interface SearchPokemonRelations {
  // describe navigational properties here
}

export type SearchPokemonWithRelations = SearchPokemon & SearchPokemonRelations;
