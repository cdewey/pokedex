import {Model, model, property} from '@loopback/repository';

@model()
export class SearchPokemon extends Model {
  @property({
    type: 'string',
  })
  nameFilter?: string;

  @property({
    type: 'boolean',
  })
  favoriteFilter?: boolean;

  @property({
    type: 'string',
  })
  typeFilter?: string;

  @property({
    type: 'number',
  })
  limit?: number;

  @property({
    type: 'number',
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
