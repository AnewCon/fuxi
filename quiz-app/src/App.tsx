import { HashRouter, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import QuizPage from './pages/QuizPage'
import ResultPage from './pages/ResultPage'
import WrongBookPage from './pages/WrongBookPage'
import ImportPage from './pages/ImportPage'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/result" element={<ResultPage />} />
        <Route path="/wrong" element={<WrongBookPage />} />
        <Route path="/import" element={<ImportPage />} />
      </Routes>
    </HashRouter>
  )
}

export default App
