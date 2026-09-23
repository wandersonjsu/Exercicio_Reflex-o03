import { Ex3Classe } from "./Ex3Classe";

const objeto = new Ex3Classe("João", 40);

console.log("--- Listando Atributos (Propriedades) ---");
// Propriedades privadas em TS (compiladas para JS) ainda são visíveis via Object.keys se inicializadas.
// Para ocultação real no runtime, usa-se o prefixo '#' (ex: #idade).
const atributos = Object.keys(objeto);
atributos.forEach(attr => console.log(attr));
