import {intercept} from '@loopback/context';
import {

  repository
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param,


  patch,



  post,



  requestBody,



  response
} from '@loopback/rest';
import {Pokemon} from '../models';
import {PokemonRepository} from '../repositories';

export class PokemonController {
  constructor(
    @repository(PokemonRepository)
    public pokemonRepository: PokemonRepository,
  ) { }

  @post('/pokemon')
  @response(200, {
    description: 'Array of Pokemon model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pokemon, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @requestBody() input: any,
  ): Promise<Pokemon[]> {
    return this.pokemonRepository.findPokemon(input.filterFavorite);
  }


  @get('/pokemon/id/{id}')
  @response(200, {
    description: 'Pokemon model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pokemon, {includeRelations: true}),
      },
    },
  })
  @intercept('fields')
  async findById(
    @param.path.string('id') id: string,
    //@param.filter(Pokemon, {exclude: ['where', 'fields']}) filter?: FilterExcludingWhere<Pokemon>
  ): Promise<Pokemon> {
    return this.pokemonRepository.findById(id);
  }

  @get('/pokemon/name/{name}')
  @response(200, {
    description: 'Pokemon model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pokemon, {includeRelations: true}),
      },
    },
  })
  @intercept('fields')
  async findByName(
    @param.path.string('name') name: string,
  ): Promise<Pokemon | null> {
    return this.pokemonRepository.findByName(name);
  }




  @patch('/pokemon/favorite/{id}')
  @response(204, {
    description: 'Pokemon PATCH success',
  })
  async markAsFavorite(
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.pokemonRepository.markAsFavorite(id);
  }

  @patch('/pokemon/unfavorite/{id}')
  @response(204, {
    description: 'Pokemon PATCH success',
  })
  async unmarkAsFavorite(
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.pokemonRepository.unmarkAsFavorite(id);
  }

}
