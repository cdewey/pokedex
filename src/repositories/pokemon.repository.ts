import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PokemonDataSource} from '../datasources';
import {Pokemon, PokemonRelations, SearchPokemon} from '../models';

export class PokemonRepository extends DefaultCrudRepository<
  Pokemon,
  typeof Pokemon.prototype.id,
  PokemonRelations
> {
  constructor(
    @inject('datasources.pokemon') dataSource: PokemonDataSource,
  ) {
    super(Pokemon, dataSource);
  }

  public findPokemon(input: SearchPokemon) {
    let filter: any = {
      where: {}
    };
    if (input.favoriteFilter) {
      filter.where.favorite = true;
    }
    if (input.nameFilter) {
      const pattern = new RegExp(input.nameFilter);
      filter.where.name = {
        ilike: "%" + input.nameFilter + "%"
      };
    }
    if (input.typeFilter) {
      filter.where.or = [{type1: input.typeFilter}, {type2: input.typeFilter}]
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
    console.log(filter);
    return this.find(filter);
  }

  public findByName(pokemonName: string) {
    return this.findOne({where: {name: pokemonName}});
  }

  public getPokemonTypes() {
    let query = "select type1 as type from pokemon union select type2 from pokemon order by type asc";
    return this.dataSource.execute(query)
  }

  public markAsFavorite(id: string) {
    return this.updateById(id, {favorite: true});
  }

  public unmarkAsFavorite(id: string) {
    return this.updateById(id, {favorite: false});
  }

}
