export type StatusVenda = 'CONCLUIDA' | 'CANCELADA';

export interface Venda {
  id: number;
  produtoId: number;
  produtoNome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
  dataHora: string;
  status: StatusVenda;
}

export interface VendaPayload {
  produtoId: number;
  quantidade: number;
}
