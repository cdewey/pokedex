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
import {Pokemon, SearchPokemon} from '../models';
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
  @intercept('unwrap')
  async find(
    @requestBody() input: SearchPokemon,
  ): Promise<Pokemon[]> {
    return this.pokemonRepository.findPokemon(input);
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
  @intercept('unwrap')
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
  @intercept('unwrap')
  async findByName(
    @param.path.string('name') name: string,
  ): Promise<Pokemon | null> {
    return this.pokemonRepository.findByName(name);
  }

  @get('/pokemon/types')
  @response(200, {
    description: 'Array of Strings of Pokemon types',
    content: {
      'application/json': {
      },
    },
  })
  @intercept('types')
  async getTypes(
  ): Promise<string[] | null> {
    return this.pokemonRepository.getPokemonTypes();
  }



  @patch('/pokemon/favorite/{id}')
  @response(200, {
    description: 'Pokemon PATCH success',
    content: {
      'application/json': {
        result: "SUCCESS"
      },
    }
  })
  async markAsFavorite(
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.pokemonRepository.markAsFavorite(id);
  }

  @patch('/pokemon/unfavorite/{id}')
  @response(200, {
    description: 'Pokemon PATCH success',
    content: {
      'application/json': {
        result: "SUCCESS"
      },
    }
  })
  async unmarkAsFavorite(
    @param.path.string('id') id: string,
  ): Promise<void> {
    await this.pokemonRepository.unmarkAsFavorite(id);
  }

}
