export const renderStyledCard = async (card, styleAnalysis) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 300;
    canvas.height = 420;
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = card.image_uris?.normal || card.image_uris?.small;
    
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      applyStyleOverlay(ctx, canvas, styleAnalysis);
      applyBorderEffect(ctx, canvas, styleAnalysis);
      
      const dataUrl = canvas.toDataURL('image/png');
      resolve(dataUrl);
    };
    
    img.onerror = () => {
      renderPlacardCard(canvas, ctx, card, styleAnalysis);
      resolve(canvas.toDataURL('image/png'));
    };
  });
};

const applyStyleOverlay = (ctx, canvas, styleAnalysis) => {
  ctx.save();
  
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, hexToRgba(styleAnalysis.dominantColor, 0.15));
  gradient.addColorStop(1, hexToRgba(styleAnalysis.colorPalette[1] || '#d4af37', 0.15));
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  ctx.restore();
};

const applyBorderEffect = (ctx, canvas, styleAnalysis) => {
  ctx.save();
  
  ctx.strokeStyle = styleAnalysis.dominantColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = hexToRgba(styleAnalysis.dominantColor, 0.5);
  ctx.shadowBlur = 15;
  
  ctx.strokeRect(5, 5, canvas.width - 10, canvas.height - 10);
  ctx.strokeRect(8, 8, canvas.width - 16, canvas.height - 16);
  
  ctx.restore();
};

const renderPlacardCard = (canvas, ctx, card, styleAnalysis) => {
  ctx.fillStyle = styleAnalysis.dominantColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  addCardTexture(ctx, canvas);
  
  ctx.fillStyle = '#000';
  ctx.font = 'bold 16px serif';
  ctx.textAlign = 'center';
  ctx.fillText(card.name, canvas.width / 2, 40);
  
  ctx.font = '12px serif';
  ctx.fillText(card.type_line || 'Card', canvas.width / 2, 80);
  
  if (card.mana_cost) {
    ctx.fillText(`Cost: ${card.mana_cost}`, canvas.width / 2, 120);
  }
};

const addCardTexture = (ctx, canvas) => {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = Math.random() * 20;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
    data[i + 3] = 255;
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
