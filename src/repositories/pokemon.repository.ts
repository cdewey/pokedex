import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PokemonDataSource} from '../datasources';
import {Pokemon, PokemonRelations} from '../models';

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

  public findPokemon(filterFavorite: boolean) {
    let filter: any = {};
    if (filterFavorite) {
      filter.where = {favorite: true}
    }
    return this.find(filter);
  }

  public findByName(pokemonName: string) {
    return this.findOne({where: {name: pokemonName}});
  }

  public markAsFavorite(id: string) {
    return this.updateById(id, {favorite: true});
  }

  public unmarkAsFavorite(id: string) {
    return this.updateById(id, {favorite: false});
  }

}
