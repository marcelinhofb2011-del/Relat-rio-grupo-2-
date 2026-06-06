/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Membro, Relatorio, CategoriaMembro } from './types';

export const MEMBROS_INICIAIS: Membro[] = [
  {
    id: 'm1',
    nome: 'Carlos Souza',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PIONEIRO_REGULAR,
    ativo: true
  },
  {
    id: 'm2',
    nome: 'Ana Santos',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PIONEIRO_REGULAR,
    ativo: true
  },
  {
    id: 'm3',
    nome: 'Lucas Oliveira',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PUBLICADOR,
    ativo: true
  },
  {
    id: 'm4',
    nome: 'Fernanda Lima',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PIONEIRO_AUXILIAR,
    ativo: true
  },
  {
    id: 'm5',
    nome: 'Marcos Silva',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PUBLICADOR,
    ativo: true
  },
  {
    id: 'm6',
    nome: 'Juliana Costa',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PUBLICADOR,
    ativo: true
  },
  {
    id: 'm7',
    nome: 'Roberto Teixeira',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PUBLICADOR,
    ativo: true
  },
  {
    id: 'm8',
    nome: 'Estevão Pereira',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PIONEIRO_REGULAR,
    ativo: true
  },
  {
    id: 'm9',
    nome: 'Pedro Santos',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PUBLICADOR,
    ativo: true
  },
  {
    id: 'm10',
    nome: 'Marta Ferreira',
    grupo: 'Grupo 2',
    categoria: CategoriaMembro.PUBLICADOR,
    ativo: false // Antigo membro inativo
  }
];

export const RELATORIOS_INICIAIS: Relatorio[] = [
  // Relatórios de Maio de 2026 (Mês anterior)
  {
    id: 'r1_m1',
    mesAno: '2026-05',
    membroId: 'm1',
    nomeIrmao: 'Carlos Souza',
    categoria: CategoriaMembro.PIONEIRO_REGULAR,
    participouMinisterio: true,
    quantidadeEstudos: 3,
    horas: 52,
    observacoes: 'Muito encorajador este mês de campanha.',
    dataRegistro: '2026-05-30T18:30:00Z'
  },
  {
    id: 'r1_m2',
    mesAno: '2026-05',
    membroId: 'm2',
    nomeIrmao: 'Ana Santos',
    categoria: CategoriaMembro.PIONEIRO_REGULAR,
    participouMinisterio: true,
    quantidadeEstudos: 4,
    horas: 50,
    observacoes: 'Consegui iniciar um novo estudo na semana passada.',
    dataRegistro: '2026-05-30T19:00:00Z'
  },
  {
    id: 'r1_m3',
    mesAno: '2026-05',
    membroId: 'm3',
    nomeIrmao: 'Lucas Oliveira',
    categoria: CategoriaMembro.PUBLICADOR,
    participouMinisterio: true,
    quantidadeEstudos: 1,
    horas: '',
    observacoes: 'Participação regular.',
    dataRegistro: '2026-05-31T10:00:00Z'
  },
  {
    id: 'r1_m4',
    mesAno: '2026-05',
    membroId: 'm4',
    nomeIrmao: 'Fernanda Lima',
    categoria: CategoriaMembro.PIONEIRO_AUXILIAR,
    participouMinisterio: true,
    quantidadeEstudos: 2,
    horas: 32,
    observacoes: 'Amei os finais de semana estendidos.',
    dataRegistro: '2026-05-31T12:30:00Z'
  },
  {
    id: 'r1_m5',
    mesAno: '2026-05',
    membroId: 'm5',
    nomeIrmao: 'Marcos Silva',
    categoria: CategoriaMembro.PUBLICADOR,
    participouMinisterio: true,
    quantidadeEstudos: 0,
    horas: '',
    observacoes: '',
    dataRegistro: '2026-05-31T14:45:00Z'
  },
  {
    id: 'r1_m6',
    mesAno: '2026-05',
    membroId: 'm6',
    nomeIrmao: 'Juliana Costa',
    categoria: CategoriaMembro.PUBLICADOR,
    participouMinisterio: false, // Não participou em Maio
    quantidadeEstudos: 0,
    horas: '',
    observacoes: 'Estava viajando e doente.',
    dataRegistro: '2026-06-01T08:00:00Z'
  },
  {
    id: 'r1_m8',
    mesAno: '2026-05',
    membroId: 'm8',
    nomeIrmao: 'Estevão Pereira',
    categoria: CategoriaMembro.PIONEIRO_REGULAR,
    participouMinisterio: true,
    quantidadeEstudos: 5,
    horas: 55,
    observacoes: 'Vários estudantes com boa dedicação.',
    dataRegistro: '2026-05-31T15:20:00Z'
  },

  // Relatórios de Junho de 2026 (Mês atual)
  {
    id: 'r2_m1',
    mesAno: '2026-06',
    membroId: 'm1',
    nomeIrmao: 'Carlos Souza',
    categoria: CategoriaMembro.PIONEIRO_REGULAR,
    participouMinisterio: true,
    quantidadeEstudos: 4,
    horas: 54,
    observacoes: 'Estudos progredindo bem.',
    dataRegistro: '2026-06-05T20:15:00Z'
  },
  {
    id: 'r2_m4',
    mesAno: '2026-06',
    membroId: 'm4',
    nomeIrmao: 'Fernanda Lima',
    categoria: CategoriaMembro.PIONEIRO_AUXILIAR,
    participouMinisterio: true,
    quantidadeEstudos: 2,
    horas: 30,
    observacoes: 'Muito grata pelo privilégio.',
    dataRegistro: '2026-06-05T22:30:00Z'
  },
  {
    id: 'r2_m5',
    mesAno: '2026-06',
    membroId: 'm5',
    nomeIrmao: 'Marcos Silva',
    categoria: CategoriaMembro.PUBLICADOR,
    participouMinisterio: true,
    quantidadeEstudos: 1,
    horas: '',
    observacoes: 'Teve revisitas interessantes.',
    dataRegistro: '2026-06-05T23:50:00Z'
  }
];
