import { Carro } from "./Carro";
import { Aviao } from "./Aviao";
import { Sucata } from "./Sucata";

// Em Java usamos Class.forName(). Em Node/TS podemos usar um mapa de classes ou import dinâmico.
const classesMap: { [key: string]: any } = {
    "Carro": Carro,
    "Aviao": Aviao,
    "Sucata": Sucata
};

function processarObjeto(nomeClasse: string) {
    const Construtor = classesMap[nomeClasse];
    if (!Construtor) {
        console.log(`Classe ${nomeClasse} não encontrada.`);
        return;
    }

    // Instancia passando parâmetros genéricos
    const instancia = new Construtor("Vermelho", "Genérico");
    
    console.log(`
Processando instância de: ${instancia.constructor.name}`);
    
    // Verifica dinamicamente se possui a propriedade 'cor'
    if ('cor' in instancia) {
        console.log(`Cor original: ${(instancia as any).cor}`);
        (instancia as any).cor = "Azul (Modificado via Reflexão/Dinâmica)";
        console.log(`Cor nova: ${(instancia as any).cor}`);
    } else {
        console.log("Este objeto não possui o atributo 'cor'.");
    }
}

processarObjeto("Carro");
processarObjeto("Aviao");
processarObjeto("Sucata");
