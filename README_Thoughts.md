# Starting Out

## Requirements and Data

### Thoughts

- The requirements are not to demanding but I have never used loopback or a postgreSQL/mongoDB before.
- I noticed that each Pokemon object has a lot more fields than must be indexed (from an SQL perspective) to fulfill the challenge requirements.
- After reading about loopback I realize it is essentially another express.js tool. I notice it has a certain design methodology around its Model/Controller/Repository/DataSource classes.

### Decision

- Since I only need to index a few fields my Pokemon database table will look like this
  column name | id | name | type1 | type2 | favorite | info
  --- | --- | --- | --- |--- |--- |---
  data type | string | string | string | string | boolean | JSON

The info field will be a JSON object of the whole Pokemon. This design allows me to index all the fields I need without having to go through the hassle of de-json-ifing Pokemon to store them and then re-json-ifiyng them out of a bunch of SQL tables. This also greatly simplifies my DB by only having one table.

- I will be using a Postgres DB as I am much more familiar with SQL and I could see an easy way to implement this.

## Setting up the data base

### Decision

- I setup a local instance of a Postgres to get up an running quickly
- I use the default DB username/password
- I create a pokedex database using psql
- I use an sql script to generate my table (/db/create_pokemon_table.sql)
- I populate my database using a quick script (/db/import_pokemon.js)

## Setting up loop back

### Thoughts

- I follow the todo-list tutorial loopback provides to get a general feel of their components.
- Controllers just handle the different routes
- Models just seem like a way to self document the code
- Repositories just seem to act as services to retrieve data
- DataSources are just classes to handle connecting to Postgres
- I am use to executing my own SQL queries, loopback seems to have the weird way of doing CRUD operations

### Decision

- I create a Pokemon Controller, Model, Repository and DataSource
- Working with the weird provided repository getById() function I get a working path to retrieve a pokemon by ID from my database
- I followed the same idea and am able to favorite/unfavorite a pokemon using the updateById() function

## More advance features

### Thoughts

- I will want to create a simpler interface for the user to search for pokemon
- I will need to use a custom query to get a list of pokemon type
  - I could create a static list but what if new pokemon/types get added

## Decision

- I create a custom query to address the pokemon type issue
- I create a model called SearchPokemon that exposes 5 fields to handle the search requirements from the challenge. I map them to the standard loopback filter model to execute the search with the provided find() function.

## A Few Problems

So I have a minimal working version but it feels a bit out of wack.

### Thoughts

- It appears my choice of database table does not jive perfectly with loopback's Model framework.
  - My pokemon model is really modeling a row of my pokemon table and not an actual pokemon object
  - Because my types are a custom query they are coming back with each type string wrapped into object and set as a type proerty
- I later found out that had I described the pokemon with loopback Models and Relationships that I could have used that description to import tables to Postgres. Which would of solved my problem of de/un json-ification. But since I am new to loopback I didn't have that foresight. And more or less already had a working application.

### Decision

- I rename my Pokemon model to PokemonRow which will represent data coming from postgres
- I create a new Pokemon model to represent the actual pokemon objects that will be returned to the user.
- Since my DataSource is returning PokemonRows and my Controller is expecting Pokemon, I simply up-wrap the PokemonRow in my Repository layer.
  - Which is easily done because the info property returned with each PokemonRow contains the JSON for a Pokemon object.
- I also solve my Pokemon types issue by reorganizing them into a string array.

## A Few More Things

### Decision

- Added an interceptor in front of the /pokemon/name/{name} route to capitalize the first letter of a request
- Similarly added an interceptor in front of the /pokemon/id/{id} route to pad any strings without zeros since I made my id column of type string
- Added an interceptor to the back end of the favorite routes to add a success message since one isn't provided by default from loopback after an update.

## Testing

### Decision

- Unit test for Controller/Interceptor classes
- Integration test for Repository classes
- Acceptance test for the API
- I was unable to test the /pokemon/types route since it used a custom query which complicated things.
