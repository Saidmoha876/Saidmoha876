export class Usuario {

  id!: number;
  nome!: string;
  usuario!: string;
  senha!: string;


  constructor(id: number, nome: string, usuario: string, senha: string) {
    this.id = id;
    this.nome = nome;
    this.usuario = usuario;
    this.senha = senha;
  }
}
