import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { firstValueFrom } from 'rxjs';
import { Produto } from '../../../models/produto';
import { Venda } from '../../../models/venda';
import { ProdutoService } from '../../../services/produto.service';
import { VendaService } from '../../../services/venda.service';
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
  private readonly vendaService = inject(VendaService);

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

  abrirVenda(): void {
    
    const vendaveis = this.lista.filter(p => p.disponivel && p.estoque > 0);

    if (vendaveis.length === 0) {
      Swal.fire('Sem produtos', 'Não há produtos disponíveis com estoque para vender.', 'info');
      return;
    }

    const opcoes = vendaveis
      .map(p => `<option value="${p.id}">${p.nome} - R$ ${p.preco.toFixed(2)} (Estoque: ${p.estoque})</option>`)
      .join('');

    Swal.fire({
      title: 'Nova Venda',
      html: `
        <div class="mb-3 text-start">
          <label class="form-label">Produto</label>
          <select id="swal-produto" class="form-select">${opcoes}</select>
        </div>
        <div class="mb-3 text-start">
          <label class="form-label">Quantidade</label>
          <input type="number" id="swal-quantidade" class="form-control" min="1" value="1">
        </div>
      `,
      confirmButtonText: 'Vender',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading(),
      preConfirm: () => {
        const produtoId = Number((document.getElementById('swal-produto') as HTMLSelectElement).value);
        const quantidade = Number((document.getElementById('swal-quantidade') as HTMLInputElement).value);

        if (!produtoId) {
          Swal.showValidationMessage('Selecione um produto');
          return false;
        }
        if (!Number.isInteger(quantidade) || quantidade <= 0) {
          Swal.showValidationMessage('Informe uma quantidade válida');
          return false;
        }
        return firstValueFrom(this.vendaService.registrar({ produtoId, quantidade }))
          .catch((erro: Error) => {
            Swal.showValidationMessage(erro.message);
            return false;
          });
      }
    }).then((resultado) => {
      if (resultado.isConfirmed && resultado.value) {
        const venda = resultado.value as Venda;

        
        this.carregarProdutos();

        Swal.fire({
          title: 'Venda registrada!',
          html: `Produto: ${venda.produtoNome}<br>Quantidade: ${venda.quantidade}<br>Total: R$ ${venda.valorTotal.toFixed(2)}`,
          icon: 'success',
          confirmButtonText: 'Ok'
        });
      }
    });
  }
}