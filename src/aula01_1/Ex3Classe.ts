export class Ex3Classe {
    public nome: string;
    private idade: number;

    constructor(nome: string, idade: number) {
        this.nome = nome;
        this.idade = idade;
    }

    public falar(): void {
        console.log(`Olá, meu nome é ${this.nome}`);
    }

    private metodoPrivado(): void {
        console.log("Este é um método privado");
    }
}
