/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Membro, Relatorio } from '../types';

/**
 * Exports data to a CSV file. Uses semicolon as delimiter and includes UTF-8 BOM
 * for automatic compatibility with standard Portuguese configurations of Microsoft Excel.
 */
export function exportToCSV(headers: string[], rows: (string | number)[][], filename: string) {
  const rowLines = rows.map(row => 
    row.map(val => {
      const stringVal = val === null || val === undefined ? '' : String(val);
      // Escape dual quotes
      const escaped = stringVal.replace(/"/g, '""');
      return `"${escaped}"`;
    }).join(';')
  );
  
  const csvContent = '\uFEFF' + [headers.join(';'), ...rowLines].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Downloads a representation of the data as a JSON backup file.
 */
export function exportToJSON(data: { membros: Membro[]; relatorios: Relatorio[] }, filename: string) {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
