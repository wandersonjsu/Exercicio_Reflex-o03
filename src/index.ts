import { Aluno } from './modelo/Aluno'; 
import { Pessoa } from './modelo/Pessoa';

const testeAluno = new Aluno();
const testePessoa = new Pessoa();

console.log("--- RESULTADOS DA REFLEXÃO ---");
console.log("Tabela do Aluno: ", testeAluno.getTableName());
console.log("Tabela da Pessoa: ", testePessoa.getTableName());
console.log("------------------------------");