let pokemons = require('./pokemons.json')
let format = require('pg-format');

let pokemonInsertArray = createPokemonList();

const { Pool, Client } = require('pg')

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'pokedex',
  password: 'password',
  port: 5432,
})
client.connect((err, res) => {
  if (err == null) {
    importPokemon()
  }
})

function importPokemon() {
  let query = format('Insert into pokemon (id, name, type1, type2, favorite, info) values %L', pokemonInsertArray);
  client.query(query, (err, res) => {
    if (err) {
      console.log("ERROR")
      console.log(err)
    }
    else {
      console.log("Success")
      console.log(res)
    }
    client.end();
  })
}

function createPokemonList() {
  let insertArray = [];
  for (let pokemon of pokemons) {
    let singleEntry = [];
    singleEntry.push(pokemon.id);
    singleEntry.push(pokemon.name);
    singleEntry.push(pokemon.types[0]);
    if (pokemon.types[1]) {
      singleEntry.push(pokemon.types[1]);
    }
    else {
      singleEntry.push(null);
    }
    singleEntry.push(false); //for the favorite
    singleEntry.push(pokemon); //for the info field
    insertArray.push(singleEntry);
  }
  return insertArray;
}


