import type { CardListItem } from '../components/CardList/CardList.types';

export function itemsToCsv(items: CardListItem[]): string {
  const header = 'id,name,types,details_url\n';
  const rows = items.map((item) =>
    [
      item.id,
      item.name,
      item.types.join('|'),
      `https://pokeapi.co/api/v2/pokemon/${item.id}`,
    ].join(',')
  );
  return header + rows.join('\n');
}

export function downloadCsv(items: CardListItem[]): void {
  const csvContent = itemsToCsv(items);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${items.length}_items.csv`;
  link.click();

  URL.revokeObjectURL(url);
}
