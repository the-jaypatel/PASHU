import { useState } from "react";
import { predictBreed } from "./api";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await predictBreed(selectedFile);

      if (!data.success) {
        throw new Error(data.error || "Prediction failed");
      }

      setResult(data.prediction);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="navbar">
        <div className="brand">
          <div className="brand-icon">🐄</div>
          <div>
            <h2>PASHU</h2>
            <span>Indian Bovine Breed Identification</span>
          </div>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AI MODEL ONLINE
        </div>
      </header>

      {/* HERO */}
      <main>
        <section className="hero-section">
          <div className="hero-badge">
            AI-POWERED BREED IDENTIFICATION
          </div>

          <h1>
            Identify Indian Cattle
            <br />
            <span>with AI.</span>
          </h1>

          <p className="hero-description">
            Upload an image of a bovine and PASHU will identify its
            breed using our trained EfficientNet-B0 deep learning model.
          </p>
        </section>

        {/* UPLOAD CARD */}
        <section className="prediction-card">
          <div className="upload-area">
            {!preview ? (
              <label className="drop-zone">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                />

                <div className="upload-icon">📷</div>

                <h3>Upload cattle image</h3>

                <p>
                  Choose a clear image of the cattle you want
                  to identify.
                </p>

                <span className="browse-button">
                  Choose Image
                </span>

                <small>JPG, JPEG or PNG</small>
              </label>
            ) : (
              <div className="preview-container">
                <img
                  src={preview}
                  alt="Selected cattle"
                  className="preview-image"
                />

                <button
                  className="remove-button"
                  onClick={reset}
                >
                  ✕ Remove image
                </button>
              </div>
            )}
          </div>

          {/* PREDICT BUTTON */}
          {preview && !result && (
            <button
              className="predict-button"
              onClick={handlePredict}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>🔍 Identify Breed</>
              )}
            </button>
          )}

          {/* ERROR */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* RESULT */}
          {result && (
            <div className="result-section">
              <div className="result-label">
                AI PREDICTION
              </div>

              <h2>{result.breed}</h2>

              <div className="confidence">
                <div className="confidence-header">
                  <span>Confidence</span>
                  <strong>
                    {(result.confidence * 100).toFixed(2)}%
                  </strong>
                </div>

                <div className="confidence-bar">
                  <div
                    className="confidence-fill"
                    style={{
                      width: `${result.confidence * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* TOP 3 */}
              {result.top_predictions &&
                result.top_predictions.length > 1 && (
                  <div className="top-predictions">
                    <h3>Top Predictions</h3>

                    {result.top_predictions.map(
                      (prediction, index) => (
                        <div
                          className="prediction-row"
                          key={prediction.breed}
                        >
                          <div className="prediction-name">
                            <span className="rank">
                              #{index + 1}
                            </span>

                            {prediction.breed}
                          </div>

                          <strong>
                            {(
                              prediction.confidence * 100
                            ).toFixed(2)}
                            %
                          </strong>
                        </div>
                      )
                    )}
                  </div>
                )}

              <button
                className="try-again-button"
                onClick={reset}
              >
                Identify Another Image
              </button>
            </div>
          )}
        </section>

        {/* FEATURES */}
        <section className="features">
          <div className="feature">
            <span>🧠</span>
            <div>
              <h3>Deep Learning</h3>
              <p>EfficientNet-B0 trained for bovine classification.</p>
            </div>
          </div>

          <div className="feature">
            <span>🐄</span>
            <div>
              <h3>41 Breeds</h3>
              <p>Recognizes 41 Indian bovine breeds.</p>
            </div>
          </div>

          <div className="feature">
            <span>⚡</span>
            <div>
              <h3>Fast Prediction</h3>
              <p>GPU-accelerated inference through FastAPI.</p>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <p>
          PASHU • Indian Bovine Breed Identification
        </p>
      </footer>
    </div>
  );
}

export default App;