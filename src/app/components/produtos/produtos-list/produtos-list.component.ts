import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Produto } from '../../../models/produto';
import { ProdutoService } from '../../../services/produto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-produtos-list',
  imports: [RouterLink],
  templateUrl: './produtos-list.component.html',
  styleUrl: './produtos-list.component.scss'
})
export class ProdutosListComponent implements OnInit {

  lista: Produto[] = [];
  carregando = false;
  mensagemErro = '';

  private readonly produtoService = inject(ProdutoService);

  ngOnInit(): void {
    this.carregarProdutos();
  }

  carregarProdutos(): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.produtoService.listar().subscribe({
      next: (produtos: Produto[]) => {
        this.lista = produtos;
        this.carregando = false;
      },
      error: (erro: Error) => {
        this.mensagemErro = erro.message;
        this.carregando = false;
      }
    });
  }

  deletar(produto: Produto): void {
    Swal.fire({
      title: 'Excluir produto?',
      text: `Deseja excluir ${produto.nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.produtoService.deletar(produto.id).subscribe({
          next: () => {
            this.lista = this.lista.filter((item) => item.id !== produto.id);
            Swal.fire('Excluido!', 'Produto removido com sucesso.', 'success');
          },
          error: (erro: Error) => {
            this.mensagemErro = erro.message;
            Swal.fire('Erro', erro.message, 'error');
          }
        });
      }
    });
  }
}
