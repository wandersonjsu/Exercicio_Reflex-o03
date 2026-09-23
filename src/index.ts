import { Aluno } from './modelo/Aluno'; 
import { Pessoa } from './modelo/Pessoa';

const testeAluno = new Aluno();
const testePessoa = new Pessoa();

console.log("--- RESULTADOS DA REFLEXÃO ---");
console.log("Tabela do Aluno: ", testeAluno.getTableName()); // Deve imprimir: tb_alunos
console.log("Tabela da Pessoa: ", testePessoa.getTableName()); // Deve imprimir: Pessoa
console.log("------------------------------");