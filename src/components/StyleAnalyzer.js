import React, { useEffect, useState } from 'react';
import { analyzeCardStyle } from '../services/styleAnalyzerService';
import './StyleAnalyzer.css';

const StyleAnalyzer = ({ card }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyze = async () => {
      setLoading(true);
      try {
        const result = await analyzeCardStyle(card);
        setAnalysis(result);
      } catch (error) {
        console.error('Error analyzing card style:', error);
      } finally {
        setLoading(false);
      }
    };

    if (card) {
      analyze();
    }
  }, [card]);

  if (loading) return <div className="analyzer-loading">Analyzing card style...</div>;

  if (!analysis) return <div className="analyzer-error">Failed to analyze style</div>;

  return (
    <div className="style-analyzer">
      <h3>Style Analysis</h3>
      <div className="analysis-grid">
        <div className="analysis-item">
          <label>Dominant Color:</label>
          <div
            className="color-swatch"
            style={{ backgroundColor: analysis.dominantColor }}
          />
          <span>{analysis.dominantColor}</span>
        </div>
        <div className="analysis-item">
          <label>Frame Type:</label>
          <span>{analysis.frameType}</span>
        </div>
        <div className="analysis-item">
          <label>Aesthetic:</label>
          <span>{analysis.aesthetic}</span>
        </div>
        <div className="analysis-item">
          <label>Color Palette:</label>
          <div className="color-palette">
            {analysis.colorPalette.map((color, idx) => (
              <div
                key={idx}
                className="palette-swatch"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleAnalyzer;
