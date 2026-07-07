import React, { useState } from 'react';
import './App.css';
import CardSelector from './components/CardSelector';
import CardImporter from './components/CardImporter';
import StyleAnalyzer from './components/StyleAnalyzer';
import StyleAdjuster from './components/StyleAdjuster';
import BatchProcessor from './components/BatchProcessor';
import Preview from './components/Preview';
import DownloadManager from './components/DownloadManager';
import { useStore } from './store';

function App() {
  const [step, setStep] = useState('home');
  const styleCard = useStore(state => state.styleCard);
  const targetCards = useStore(state => state.targetCards);
  const styledCards = useStore(state => state.styledCards);
  const customCards = useStore(state => state.customCards);
  const reset = useStore(state => state.reset);

  const goHome = () => {
    reset();
    setStep('home');
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🧙 Magic: The Gathering Style Transfer</h1>
        <p>Apply the visual style of one card to multiple others</p>
      </header>

      <main className="app-main">
        {/* Home Screen */}
        {step === 'home' && (
          <section className="home-section">
            <div className="welcome-box">
              <h2>Welcome to MTG Style Transfer!</h2>
              <p>Transform your Magic cards with custom styles</p>
            </div>

            <div className="home-actions">
              <button
                className="action-btn scryfall-btn"
                onClick={() => setStep('select-style')}
              >
                🔍 Search Scryfall
                <span>Use official Magic cards</span>
              </button>
              
              <button
                className="action-btn import-btn"
                onClick={() => setStep('import-cards')}
              >
                📁 Import Custom Cards
                <span>Upload your own card files</span>
              </button>

              {customCards.length > 0 && (
                <div className="custom-cards-badge">
                  📚 {customCards.length} custom cards available
                </div>
              )}
            </div>
          </section>
        )}

        {/* Import Cards Screen */}
        {step === 'import-cards' && (
          <section className="step-section">
            <button className="back-btn" onClick={goHome}>← Back to Home</button>
            <CardImporter
              onImportComplete={() => {
                setTimeout(() => setStep('select-style'), 1000);
              }}
            />
          </section>
        )}

        {/* Step Indicator */}
        {step !== 'home' && step !== 'import-cards' && (
          <div className="step-indicator">
            <div className={`step ${step === 'select-style' ? 'active' : ''}`}>1. Style Card</div>
            <div className={`step ${step === 'select-targets' ? 'active' : ''}`}>2. Target Cards</div>
            <div className={`step ${step === 'adjust' ? 'active' : ''}`}>3. Adjust</div>
            <div className={`step ${step === 'process' ? 'active' : ''}`}>4. Process</div>
            <div className={`step ${step === 'results' ? 'active' : ''}`}>5. Results</div>
          </div>
        )}

        {/* Select Style Card */}
        {step === 'select-style' && (
          <section className="step-section">
            <button className="back-btn" onClick={goHome}>← Back to Home</button>
            <h2>Step 1: Select a Card for Its Style</h2>
            <CardSelector
              onSelect={(card) => {
                useStore.setState({ styleCard: card });
                setStep('select-targets');
              }}
              placeholder="Search for a card to use as the style source..."
            />
          </section>
        )}

        {/* Select Target Cards */}
        {step === 'select-targets' && styleCard && (
          <section className="step-section">
            <h2>Step 2: Select Target Cards</h2>
            <div className="style-preview">
              <h3>Style Source:</h3>
              <Preview card={styleCard} />
              <StyleAnalyzer card={styleCard} />
            </div>
            <div className="target-selector">
              <h3>Add Cards to Style:</h3>
              <CardSelector
                onSelect={(card) => {
                  useStore.setState({
                    targetCards: [...targetCards, card]
                  });
                }}
                placeholder="Search and add cards one by one..."
              />
              {targetCards.length > 0 && (
                <div className="target-list">
                  <h4>Selected Targets ({targetCards.length}):</h4>
                  <div className="card-grid">
                    {targetCards.map((card, idx) => (
                      <div key={idx} className="target-card-item">
                        <Preview card={card} />
                        <button
                          onClick={() => {
                            useStore.setState({
                              targetCards: targetCards.filter((_, i) => i !== idx)
                            });
                          }}
                          className="remove-btn"
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {targetCards.length > 0 && (
                <button
                  className="proceed-btn"
                  onClick={() => setStep('adjust')}
                >
                  Proceed to Styling ({targetCards.length} cards)
                </button>
              )}
            </div>
          </section>
        )}

        {/* Adjust Styling */}
        {step === 'adjust' && (
          <section className="step-section">
            <h2>Step 3: Adjust Style Settings</h2>
            <StyleAdjuster />
            <button
              className="proceed-btn"
              onClick={() => setStep('process')}
            >
              Proceed to Processing
            </button>
          </section>
        )}

        {/* Process Cards */}
        {step === 'process' && (
          <section className="step-section">
            <h2>Step 4: Process Cards</h2>
            <BatchProcessor
              onComplete={() => setStep('results')}
            />
          </section>
        )}

        {/* Results */}
        {step === 'results' && styledCards.length > 0 && (
          <section className="step-section">
            <h2>Step 5: Results</h2>
            <div className="results-container">
              <h3>Styled Cards ({styledCards.length}):</h3>
              <div className="card-grid">
                {styledCards.map((card, idx) => (
                  <div key={idx} className="result-card">
                    <img src={card.image} alt={card.name} />
                    <p>{card.name}</p>
                  </div>
                ))}
              </div>

              <DownloadManager cards={styledCards} />

              <div className="action-buttons">
                <button
                  className="reset-btn"
                  onClick={goHome}
                >
                  🔄 Start Over
                </button>
                <button
                  className="style-another-btn"
                  onClick={() => {
                    useStore.setState({
                      targetCards: [],
                      styledCards: []
                    });
                    setStep('select-targets');
                  }}
                >
                  🎨 Style More Cards
                </button>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
