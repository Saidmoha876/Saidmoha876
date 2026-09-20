import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Venda, VendaPayload } from '../models/venda';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

  private readonly apiUrl = 'http://localhost:8080/api/vendas';

  constructor(private readonly http: HttpClient) {}

  listar(): Observable<Venda[]> {
    return this.http.get<Venda[]>(this.apiUrl)
      .pipe(catchError(this.tratarErro));
  }

  buscarPorId(id: number): Observable<Venda> {
    return this.http.get<Venda>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.tratarErro));
  }

  registrar(venda: VendaPayload): Observable<Venda> {
    return this.http.post<Venda>(this.apiUrl, venda)
      .pipe(catchError(this.tratarErro));
  }

  cancelar(id: number): Observable<Venda> {
    return this.http.patch<Venda>(`${this.apiUrl}/${id}/cancelar`, {})
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

    console.error('Erro na requisicao de vendas:', error);
    return throwError(() => new Error(mensagem));
  }
}
