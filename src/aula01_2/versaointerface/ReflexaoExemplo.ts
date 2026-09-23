import { Carro } from "./Carro";
import { isObjectWithColor } from "./ObjectWithColor";

const meuCarro = new Carro("Prata", "Sedan");

console.log("--- Testando Interfaces em TypeScript ---");
// Interfaces em TS não existem no runtime (type erasure).
// Usamos Type Guards (isObjectWithColor) para verificar a aderência estrutural do objeto.

if (isObjectWithColor(meuCarro)) {
    console.log("O objeto implementa a estrutura de ObjectWithColor.");
    console.log(`A cor é: ${meuCarro.cor}`);
}
