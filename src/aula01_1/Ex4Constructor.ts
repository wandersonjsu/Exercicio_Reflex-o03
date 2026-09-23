import { Ex3Classe } from "./Ex3Classe";

console.log("--- Construtores em TypeScript ---");
// Em JS/TS, as classes são funções construtoras ("first-class citizens")
const construtorReferencia = Ex3Classe;

// Instanciando dinamicamente
const novaInstancia = new construtorReferencia("Instância Dinâmica", 25);
console.log("Nome:", novaInstancia.nome);
