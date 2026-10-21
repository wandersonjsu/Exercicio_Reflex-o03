import { IncomingMessage, ServerResponse } from 'http';
import * as fs from 'fs';
import * as path from 'path';

export interface Resposta { status: number; corpo?: unknown }
export interface Contexto { params: Record<string, string>; corpo: any }
type Handler = (ctx: Contexto) => Resposta | Promise<Resposta>;

export class ErroHttp extends Error {
    constructor(public status: number, mensagem: string) { super(mensagem); }
}

const TIPOS: Record<string, string> = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
};

// Mini-roteador feito com o módulo http do Node, para o projeto não depender
// de nada além do reflect-metadata. A lógica de CRUD fica em CrudController.
export class Roteador {
    private rotas: { metodo: string; regex: RegExp; nomes: string[]; handler: Handler }[] = [];
    private entidades: { rota: string; tabela: string }[] = [];

    constructor(private pastaPublica: string) {
        // o frontend usa isto para saber quais CRUDs existem
        this.adicionar('GET', '/api/entidades', () => ({ status: 200, corpo: this.entidades }));
    }

    registrarEntidade(entidade: { rota: string; tabela: string }) {
        this.entidades.push(entidade);
    }

    adicionar(metodo: string, caminho: string, handler: Handler) {
        const nomes: string[] = [];
        const padrao = caminho.replace(/:(\w+)/g, (_, nome) => { nomes.push(nome); return '([^/]+)'; });
        this.rotas.push({ metodo, regex: new RegExp(`^${padrao}$`), nomes, handler });
    }

    async atender(req: IncomingMessage, res: ServerResponse) {
        const url = new URL(req.url ?? '/', 'http://localhost');
        const metodo = req.method ?? 'GET';

        for (const rota of this.rotas) {
            const m = rota.metodo === metodo ? rota.regex.exec(url.pathname) : null;
            if (!m) continue;
            try {
                const params = Object.fromEntries(rota.nomes.map((n, i) => [n, decodeURIComponent(m[i + 1])]));
                const corpo = await this.lerCorpo(req);
                return this.enviar(res, await rota.handler({ params, corpo }));
            } catch (e) {
                const status = e instanceof ErroHttp ? e.status : 500;
                return this.enviar(res, { status, corpo: { erro: (e as Error).message } });
            }
        }

        if (metodo === 'GET' && !url.pathname.startsWith('/api')) {
            return this.servirArquivo(url.pathname, res);
        }
        this.enviar(res, { status: 404, corpo: { erro: 'Rota não encontrada' } });
    }

    private async lerCorpo(req: IncomingMessage): Promise<any> {
        if (req.method === 'GET' || req.method === 'DELETE') return undefined;
        const partes: Buffer[] = [];
        for await (const parte of req) partes.push(parte as Buffer);
        const texto = Buffer.concat(partes).toString('utf-8');
        if (!texto) return undefined;
        try { return JSON.parse(texto); }
        catch { throw new ErroHttp(400, 'JSON inválido'); }
    }

    private enviar(res: ServerResponse, r: Resposta) {
        if (r.corpo === undefined) { res.writeHead(r.status); return res.end(); }
        res.writeHead(r.status, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify(r.corpo));
    }

    private servirArquivo(pathname: string, res: ServerResponse) {
        const relativo = pathname === '/' ? 'index.html' : pathname;
        const alvo = path.join(this.pastaPublica, path.normalize(relativo));
        // evita "../" saindo da pasta public
        if (!alvo.startsWith(this.pastaPublica) || !fs.existsSync(alvo) || !fs.statSync(alvo).isFile()) {
            return this.enviar(res, { status: 404, corpo: { erro: 'Arquivo não encontrado' } });
        }
        res.writeHead(200, { 'Content-Type': TIPOS[path.extname(alvo)] ?? 'application/octet-stream' });
        fs.createReadStream(alvo).pipe(res);
    }
}
