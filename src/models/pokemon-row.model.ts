import {Entity, model, property} from '@loopback/repository';
import {Pokemon} from './pokemon.model';

@model({
  settings: {
    postgresql: {
      table: 'pokemon',
    },
  },
})
export class PokemonRow extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    postgresql: {
      columnName: 'id',
      dataType: 'text',
      nullable: 'NO',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'name',
      dataType: 'text',
      nullable: 'NO',
    },
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'type1',
      dataType: 'text',
      nullable: 'NO',
    },
  })
  type1: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'type2',
      dataType: 'text',
      nullable: 'YES',
    },
  })
  type2?: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {
      columnName: 'favorite',
      dataType: 'boolean',
      nullable: 'NO',
    },
  })
  favorite: boolean;

  @property({
    type: 'object',
    required: true,
    postgresql: {
      columnName: 'info',
      dataType: 'JSON',
      nullable: 'NO',
    },
  })
  info: Pokemon;

  constructor(data?: Partial<PokemonRow>) {
    super(data);
  }
}
