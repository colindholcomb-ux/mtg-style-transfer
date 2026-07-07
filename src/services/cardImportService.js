export const parseCSV = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const cards = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    if (values.length === 0 || !values[0]) continue;

    const card = {};
    headers.forEach((header, idx) => {
      if (header === 'image_url') {
        card.image_uris = { normal: values[idx] };
      } else if (header === 'colors' && values[idx]) {
        card.colors = values[idx].split('|').map(c => c.trim());
      } else {
        card[header] = values[idx];
      }
    });

    if (card.name && (card.image_uris?.normal || card.image_url)) {
      card.id = `custom_${Date.now()}_${Math.random()}`;
      cards.push(card);
    }
  }

  return cards;
};

export const parseJSON = (jsonText) => {
  try {
    const data = JSON.parse(jsonText);
    const cards = Array.isArray(data) ? data : [data];

    return cards.map((card, idx) => ({
      ...card,
      id: card.id || `custom_${Date.now()}_${idx}`,
      image_uris: card.image_uris || (card.image_url ? { normal: card.image_url } : { normal: '' })
    })).filter(card => card.name && card.image_uris?.normal);
  } catch (err) {
    throw new Error('Invalid JSON format');
  }
};

export const exportCardsAsJSON = (cards, filename = 'cards.json') => {
  const dataStr = JSON.stringify(cards, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  downloadFile(dataBlob, filename);
};

export const exportCardsAsCSV = (cards, filename = 'cards.csv') => {
  const headers = ['name', 'type_line', 'mana_cost', 'image_url', 'colors', 'rarity'];
  const csvContent = [
    headers.join(','),
    ...cards.map(card =>
      headers.map(header => {
        if (header === 'image_url') {
          return card.image_uris?.normal || '';
        } else if (header === 'colors') {
          return (card.colors || []).join('|');
        }
        return `"${(card[header] || '').replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\n');

  const dataBlob = new Blob([csvContent], { type: 'text/csv' });
  downloadFile(dataBlob, filename);
};

const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
