import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Produto, ProdutoPayload } from '../../../models/produto';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProdutoService } from '../../../services/produto.service';

@Component({
  selector: 'app-produtos-details',
  imports: [MdbFormsModule, FormsModule],
  templateUrl: './produtos-details.component.html',
  styleUrl: './produtos-details.component.scss'
})
export class ProdutosDetailsComponent implements OnInit {

  produto = new Produto(0, '', '', 0, 0, true);
  carregando = false;
  salvando = false;
  mensagemErro = '';

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly produtoService = inject(ProdutoService);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.params['id']);
    if (id > 0) {
      this.findById(id);
    }
  }

  findById(id: number): void {
    this.carregando = true;
    this.mensagemErro = '';

    this.produtoService.buscarPorId(id).subscribe({
      next: (produto: Produto) => {
        this.produto = produto;
        this.carregando = false;
      },
      error: (erro: Error) => {
        this.mensagemErro = erro.message;
        this.carregando = false;
      }
    });
  }

  salvar(): void {
    this.salvando = true;
    this.mensagemErro = '';

    if (this.produto.id > 0) {
      this.produtoService.atualizar(this.produto.id, this.criarPayload()).subscribe({
        next: () => this.finalizarSalvamento('Editado com sucesso!'),
        error: (erro: Error) => this.exibirErro(erro)
      });
    } else {
      this.produtoService.cadastrar(this.criarPayload()).subscribe({
        next: () => this.finalizarSalvamento('Salvo com sucesso!'),
        error: (erro: Error) => this.exibirErro(erro)
      });
    }
  }

  private criarPayload(): ProdutoPayload {
    return {
      nome: this.produto.nome,
      categoria: this.produto.categoria,
      preco: this.produto.preco,
      estoque: this.produto.estoque,
      disponivel: this.produto.disponivel
    };
  }

  private finalizarSalvamento(titulo: string): void {
    this.salvando = false;
    Swal.fire({
      title: titulo,
      icon: 'success',
      confirmButtonText: 'Ok'
    });
    this.router.navigate(['/admin/produtos']);
  }

  private exibirErro(erro: Error): void {
    this.salvando = false;
    this.mensagemErro = erro.message;
    Swal.fire('Erro', erro.message, 'error');
  }
}
