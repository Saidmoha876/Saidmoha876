import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Produto, ProdutoPayload } from '../models/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  private readonly apiUrl = 'http://localhost:8080/api/produtos';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl)
      .pipe(catchError(this.tratarErro));
  }

  buscarPorId(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.tratarErro));
  }

  cadastrar(produto: ProdutoPayload): Observable<Produto> {
    return this.http.post<Produto>(this.apiUrl, produto)
      .pipe(catchError(this.tratarErro));
  }

  atualizar(id: number, produto: ProdutoPayload): Observable<Produto> {
    return this.http.put<Produto>(`${this.apiUrl}/${id}`, produto)
      .pipe(catchError(this.tratarErro));
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.tratarErro));
  }

  private tratarErro(error: HttpErrorResponse): Observable<never> {
    const mensagemBackend = typeof error.error === 'string'
      ? error.error
      : error.error?.message;
    const mensagem = mensagemBackend || error.message || 'Erro ao comunicar com o servidor.';

    console.error('Erro na requisicao de produtos:', error);
    return throwError(() => new Error(mensagem));
  }
}
