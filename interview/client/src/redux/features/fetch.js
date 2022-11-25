import axios from "axios";

export const fetchPokemon = () => {
    axios.get("https://pokeapi.co/api/v2/pokemon?offset=0&limit=20")
    .then((res)=>console.log(res))
    .catch((err)=> console.log(err))
}