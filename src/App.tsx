import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from './styles/theme';
import { MainLayout } from './layouts/MainLayout';
import { PredictionPage } from './pages/PredictionPage';
import { HistoryPage } from './pages/HistoryPage';
import { PatientList } from './pages/PatientList';
import { PatientForm } from './pages/PatientForm';
import { NewPrediction } from './pages/NewPrediction';
import { DashboardHome } from './pages/DashboardHome';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="pacientes" element={<PatientList />} />
            <Route path="pacientes/novo" element={<PatientForm />} />
            <Route path="pacientes/:id" element={<PatientForm />} />
            <Route path="predicao/nova" element={<NewPrediction />} />
            <Route path="history" element={<HistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
