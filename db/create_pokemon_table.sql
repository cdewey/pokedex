create database Pokedex;

CREATE TABLE IF NOT EXISTS pokemon (
   id text primary key,
   name text not null,
   type1 text not null,
   type2 text,
   favorite boolean,
   info JSON not null
);
