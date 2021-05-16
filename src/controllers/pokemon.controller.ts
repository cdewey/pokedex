import {intercept} from '@loopback/context';
import {repository} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {InfoInterceptor} from '../interceptors';
import {IdCheckInterceptor} from '../interceptors/id-check.interceptor';
import {NameInterceptor} from '../interceptors/name.interceptor';
import {Pokemon, SearchPokemon} from '../models';
import {PokemonRepository} from '../repositories';

export class PokemonController {
  constructor(
    @repository(PokemonRepository)
    public pokemonRepository: PokemonRepository,
  ) {}

  @post('/pokemon')
  @response(200, {
    description: 'Pokemon Array',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Pokemon, {includeRelations: false}),
        },
      },
    },
  })
  async find(@requestBody() input: SearchPokemon): Promise<Pokemon[]> {
    return this.pokemonRepository.findPokemon(input);
  }

  @get('/pokemon/id/{id}')
  @intercept(IdCheckInterceptor.BINDING_KEY)
  @response(200, {
    description: 'Pokemon',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pokemon, {includeRelations: false}),
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Pokemon> {
    return this.pokemonRepository.findByPokemonId(id);
  }

  @get('/pokemon/name/{name}')
  @intercept(NameInterceptor.BINDING_KEY)
  @response(200, {
    description: 'Pokemon',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Pokemon, {includeRelations: false}),
      },
    },
  })
  async findByName(
    @param.path.string('name') name: string,
  ): Promise<Pokemon | null> {
    return this.pokemonRepository.findByPokemonName(name);
  }

  @get('/pokemon/types')
  @response(200, {
    description: 'String[] of Pokemon types',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Pokemon Types Response',
          properties: {
            types: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  async getTypes(): Promise<string[] | null> {
    return this.pokemonRepository.getPokemonTypes();
  }

  @patch('/pokemon/favorite/{id}')
  @intercept(IdCheckInterceptor.BINDING_KEY)
  @intercept(InfoInterceptor.BINDING_KEY)
  @response(200, {
    description: 'Result',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Mutate Favorite Response',
          properties: {
            message: {type: 'string'},
          },
        },
      },
    },
  })
  async markAsFavorite(@param.path.string('id') id: string): Promise<void> {
    await this.pokemonRepository.markAsFavorite(id);
  }

  @patch('/pokemon/unfavorite/{id}')
  @intercept(IdCheckInterceptor.BINDING_KEY)
  @intercept(InfoInterceptor.BINDING_KEY)
  @response(200, {
    description: 'Result',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          title: 'Mutate Favorite Response',
          properties: {
            message: {type: 'string'},
          },
        },
      },
    },
  })
  async unmarkAsFavorite(@param.path.string('id') id: string): Promise<void> {
    await this.pokemonRepository.unmarkAsFavorite(id);
  }
}
