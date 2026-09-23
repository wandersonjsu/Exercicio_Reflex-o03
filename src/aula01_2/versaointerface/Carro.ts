import { ObjectWithColor } from "./ObjectWithColor";

export class Carro implements ObjectWithColor {
    public cor: string;
    public modelo: string;

    constructor(cor: string, modelo: string) {
        this.cor = cor;
        this.modelo = modelo;
    }
}
