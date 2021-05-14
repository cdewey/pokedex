import {Entity, model, property} from '@loopback/repository';

@model()
export class Pokemon extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
    postgresql: {
      columnName: 'id',
      dataType: 'text',
      nullable: 'NO',
    }
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'name',
      dataType: 'text',
      nullable: 'NO',
    }
  })
  name: string;

  @property({
    type: 'string',
    required: true,
    postgresql: {
      columnName: 'type1',
      dataType: 'text',
      nullable: 'NO',
    }
  })
  type1: string;

  @property({
    type: 'string',
    postgresql: {
      columnName: 'type2',
      dataType: 'text',
      nullable: 'YES',
    }
  })
  type2?: string;

  @property({
    type: 'boolean',
    required: true,
    postgresql: {
      columnName: 'favorite',
      dataType: 'boolean',
      nullable: 'NO',
    }
  })
  favorite: boolean;

  @property({
    type: 'any',
    required: true,
    postgresql: {
      columnName: 'info',
      dataType: 'JSON',
      nullable: 'NO',
    }
  })
  info: any;


  constructor(data?: Partial<Pokemon>) {
    super(data);
  }
}

export interface PokemonRelations {
  // describe navigational properties here
}

export type PokemonWithRelations = Pokemon & PokemonRelations;
