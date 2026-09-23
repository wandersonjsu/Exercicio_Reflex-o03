import { Ex3Classe } from "./Ex3Classe";

const objeto = new Ex3Classe("Maria", 28);
const nomeMetodo = "falar";

console.log("--- Invocando Método Dinamicamente ---");
if (typeof (objeto as any)[nomeMetodo] === 'function') {
    (objeto as any)[nomeMetodo]();
} else {
    console.log(`Método ${nomeMetodo} não encontrado.`);
}
