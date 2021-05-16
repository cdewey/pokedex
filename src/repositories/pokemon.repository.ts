import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PokemonDataSource} from '../datasources';
import {Pokemon, PokemonRow, SearchPokemon} from '../models';

export class PokemonRepository extends DefaultCrudRepository<
  PokemonRow,
  typeof PokemonRow.prototype.id
> {
  constructor(@inject('datasources.pokemon') dataSource: PokemonDataSource) {
    super(PokemonRow, dataSource);
  }

  public findPokemon(input: SearchPokemon) {
    let filter: any = this.constructSearchFilter(input);
    console.log(filter);

    return new Promise<Pokemon[]>((resolve, reject) => {
      this.find(filter)
        .then(result => {
          //console.log(result)
          let pokemonResults: Pokemon[] = [];
          for (let i = 0; i < result.length; i++) {
            //console.log(result[i].info);
            pokemonResults.push(result[i].info);
          }
          //console.log(pokemonResults);
          resolve(pokemonResults);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  public findByPokemonId(id: string) {
    return new Promise<Pokemon>((resolve, reject) => {
      this.findById(id)
        .then(result => {
          let pokemonResult: Pokemon = result.info;
          resolve(pokemonResult);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  public findByPokemonName(pokemonName: string) {
    return new Promise<Pokemon | null>((resolve, reject) => {
      this.findOne({where: {name: pokemonName}})
        .then(result => {
          console.log(result);
          if (result) {
            let pokemonResult: Pokemon = result.info;
            resolve(pokemonResult);
          } else {
            resolve(null);
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  public getPokemonTypes() {
    let query =
      'select type1 as type from pokemon union select type2 from pokemon order by type asc';
    return new Promise<string[] | null>((resolve, reject) => {
      this.dataSource
        .execute(query)
        .then(result => {
          let typesArray: string[] = [];
          for (let i = 0; i < result.length; i++) {
            if (result[i].type) {
              typesArray.push(result[i].type);
            }
          }
          result = {types: typesArray};
          resolve(result);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  public markAsFavorite(id: string) {
    return this.updateById(id, {favorite: true});
  }

  public unmarkAsFavorite(id: string) {
    return this.updateById(id, {favorite: false});
  }

  public constructSearchFilter(input: SearchPokemon) {
    let filter: any = {
      where: {},
    };
    if (input.favoriteFilter) {
      filter.where.favorite = true;
    }
    if (input.nameFilter) {
      filter.where.name = {
        ilike: '%' + input.nameFilter + '%',
      };
    }
    if (input.typeFilter) {
      filter.where.or = [{type1: input.typeFilter}, {type2: input.typeFilter}];
    }
    if (input.offset) {
      filter.offset = input.offset;
      if (!input.limit) {
        filter.limit = 10;
      }
    }
    if (input.limit) {
      filter.limit = input.limit;
    }
    return filter;
  }
}
