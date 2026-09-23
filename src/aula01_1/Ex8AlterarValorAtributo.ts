import { Ex3Classe } from "./Ex3Classe";

const objeto = new Ex3Classe("Carlos", 50);

console.log("--- Alterando Valor Dinamicamente ---");
console.log("Antes:", objeto.nome);

const atributoParaAlterar = "nome";
(objeto as any)[atributoParaAlterar] = "Carlos Silva";

console.log("Depois:", objeto.nome);
