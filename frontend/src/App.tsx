import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AnalysisProvider } from './context/AnalysisContext'
import { HomePage } from './pages/HomePage'
import { UploadPage } from './pages/UploadPage'
import { PreviewPage } from './pages/PreviewPage'
import { AnalysisPage } from './pages/AnalysisPage'
import { ResultsPage } from './pages/ResultsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <AnalysisProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/analyze" element={<AnalysisPage />} />
          <Route path="/results" element={<ResultsPage />} />

          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </AnalysisProvider>
    </BrowserRouter>
  )
}