import { Coisa } from "./Coisa";

export class Aviao extends Coisa {
    public companhia: string;

    constructor(cor: string, companhia: string) {
        super(cor);
        this.companhia = companhia;
    }
}
