import { Coisa } from "./Coisa";

export class Carro extends Coisa {
    public modelo: string;

    constructor(cor: string, modelo: string) {
        super(cor);
        this.modelo = modelo;
    }
}
