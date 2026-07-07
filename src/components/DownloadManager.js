import React, { useState } from 'react';
import './DownloadManager.css';
import { downloadCardsAsZIP } from '../services/zipExportService';
import { exportCardsAsJSON, exportCardsAsCSV } from '../services/cardImportService';

const DownloadManager = ({ cards }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleZIPDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCardsAsZIP(cards, `mtg-styled-cards-${Date.now()}.zip`);
    } catch (error) {
      alert('Error downloading ZIP: ' + error.message);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleJSONExport = () => {
    try {
      exportCardsAsJSON(cards, `mtg-cards-${Date.now()}.json`);
    } catch (error) {
      alert('Error exporting JSON: ' + error.message);
    }
  };

  const handleCSVExport = () => {
    try {
      exportCardsAsCSV(cards, `mtg-cards-${Date.now()}.csv`);
    } catch (error) {
      alert('Error exporting CSV: ' + error.message);
    }
  };

  return (
    <div className="download-manager">
      <h3>📥 Download Options</h3>
      
      <div className="download-options">
        <div className="option">
          <button
            className="download-btn zip-btn"
            onClick={handleZIPDownload}
            disabled={isDownloading || cards.length === 0}
          >
            {isDownloading ? '⏳ Preparing...' : '📦 Download as ZIP'}
          </button>
          <p className="option-desc">Download all cards as a ZIP archive ({cards.length} files)</p>
        </div>

        <div className="option">
          <button
            className="download-btn json-btn"
            onClick={handleJSONExport}
            disabled={cards.length === 0}
          >
            📄 Export as JSON
          </button>
          <p className="option-desc">Export card data for re-import or sharing</p>
        </div>

        <div className="option">
          <button
            className="download-btn csv-btn"
            onClick={handleCSVExport}
            disabled={cards.length === 0}
          >
            📊 Export as CSV
          </button>
          <p className="option-desc">Export as spreadsheet for editing</p>
        </div>

        <div className="option">
          <button
            className="download-btn individual-btn"
            onClick={() => {
              cards.forEach((card, idx) => {
                const link = document.createElement('a');
                link.href = card.image;
                link.download = `${card.name}-${idx}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              });
            }}
            disabled={cards.length === 0}
          >
            🖼️ Download Individual
          </button>
          <p className="option-desc">Download each card separately</p>
        </div>
      </div>

      <div className="download-info">
        <p>💡 <strong>Tip:</strong> ZIP download is fastest for multiple cards. JSON/CSV exports preserve metadata for later use.</p>
      </div>
    </div>
  );
};

export default DownloadManager;
