import { HashRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DashboardPage from './pages/DashboardPage'
import CascadeStructurePage from './pages/CascadeStructurePage'
import ClassificationFormPage from './pages/ClassificationFormPage'
import TimelinePage from './pages/TimelinePage'
import CompanyMapPage from './pages/CompanyMapPage'
import ModelPage from './pages/ModelPage'
import AlgorithmPage from './pages/AlgorithmPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/cascade" element={<CascadeStructurePage />} />
          <Route path="/classify" element={<ClassificationFormPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/map" element={<CompanyMapPage />} />
          <Route path="/model" element={<ModelPage />} />
          <Route path="/algorithm" element={<AlgorithmPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}
