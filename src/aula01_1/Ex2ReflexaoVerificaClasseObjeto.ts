import { Ex3Classe } from "./Ex3Classe";

const objeto = new Ex3Classe("Teste", 30);

console.log("--- Verificação de Classe ---");
console.log("O objeto é instância de Ex3Classe?", objeto instanceof Ex3Classe);
console.log("Nome da classe do construtor:", objeto.constructor.name);
