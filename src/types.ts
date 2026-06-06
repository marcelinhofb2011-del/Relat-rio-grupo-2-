/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum CategoriaMembro {
  PUBLICADOR = 'Publicador',
  PIONEIRO_REGULAR = 'Pioneiro Regular',
  PIONEIRO_AUXILIAR = 'Pioneiro Auxiliar'
}

export interface Membro {
  id: string;
  nome: string;
  grupo: string; // "Grupo 2"
  categoria: CategoriaMembro;
  ativo: boolean; // true = Sim, false = Não
}

export interface Relatorio {
  id: string;
  mesAno: string; // Formato e.g. "2026-06"
  membroId: string; // Relacionado ao Membro
  nomeIrmao: string; // Copiado/preenchido automaticamente
  categoria: CategoriaMembro; // Preenchido automaticamente
  participouMinisterio: boolean; // Sim/Não (relevante para publicador, opcional/padrão true para pioneiros)
  quantidadeEstudos: number;
  horas: number | ''; // somente pioneiros (ou null/empty para publicadores)
  observacoes: string;
  dataRegistro: string; // Data ISO em que o relatório foi adicionado
}
