import 'reflect-metadata';
import * as http from 'http';
import * as path from 'path';
import { Aluno } from './modelo/Aluno';
import { Pessoa } from './modelo/Pessoa';
import { Curso } from './modelo/Curso';
import { Roteador } from './nucleo/Roteador';
import { registrarCrud } from './nucleo/CrudController';

// Resultado do exercício 02, mantido para conferência
console.log("--- RESULTADOS DA REFLEXÃO ---");
console.log("Tabela do Aluno: ", new Aluno().getTableName());   // tb_alunos
console.log("Tabela da Pessoa: ", new Pessoa().getTableName()); // Pessoa
console.log("Tabela do Curso: ", new Curso().getTableName());   // tb_cursos
console.log("------------------------------");

// __dirname/../public funciona tanto com ts-node (src) quanto com build (dist)
const roteador = new Roteador(path.resolve(__dirname, '..', 'public'));

// Um CRUD completo por linha:
registrarCrud(roteador, 'alunos', Aluno);
registrarCrud(roteador, 'pessoas', Pessoa);
registrarCrud(roteador, 'cursos', Curso);

const porta = Number(process.env.PORT) || 3000;
http.createServer((req, res) => { roteador.atender(req, res); })
    .listen(porta, () => console.log(`Servidor rodando em http://localhost:${porta}`));
