import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, MenuItem,
  Button, CircularProgress, Alert, Select, LinearProgress, Autocomplete
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { YES_NO_OPTIONS, SUPORT_VEN_OPTIONS } from '../constants/options';
import { predictionService } from '../services/prediction.service';
import { patientService } from '../services/patient.service';
import type { PredictionResponse, PacienteDTO, EpisodioDTO } from '../types/api';
import { getPatientType, calculateAge } from '../utils/patientUtils';
import { Dashboard } from '../components/Dashboard';

const CustomSelect = ({ label, name, value, onChange, options, placeholder, required = true, disabled = false }: any) => (
  <Box>
    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 700, color: disabled ? 'text.disabled' : 'text.secondary' }}>
      {label} {required && !disabled && <span style={{ color: '#D92D20' }}>*</span>}
    </Typography>
    <Select
      fullWidth
      name={name}
      value={value || ''}
      onChange={onChange}
      displayEmpty
      size="small"
      disabled={disabled}
      sx={{ backgroundColor: disabled ? '#f5f5f5' : '#fff' }}
    >
      <MenuItem disabled value=""><em>{placeholder}</em></MenuItem>
      {options.map((opt: string) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
    </Select>
  </Box>
);

const CustomTextField = ({ label, name, value, onChange, placeholder, required = true, type = "text" }: any) => (
  <Box>
    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 700, color: 'text.secondary' }}>
      {label} {required && <span style={{ color: '#D92D20' }}>*</span>}
    </Typography>
    <TextField
      fullWidth
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      size="small"
      sx={{ backgroundColor: '#fff' }}
    />
  </Box>
);

export const NewPrediction: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const [patients, setPatients] = useState<PacienteDTO[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<PacienteDTO | null>(null);

  React.useEffect(() => {
    patientService.findAll(0, 50, '').then(data => setPatients(data.content)).catch(console.error);
  }, []);

  const [formData, setFormData] = useState<EpisodioDTO>({
    febre: 'Não',
    tosse: 'Não',
    dispneia: 'Não',
    fadiga: 'Não',
    dorAbdominal: 'Não',
    dorGarganta: 'Não',
    saturacao: 'Não',
    desconfortoRespiratorio: 'Não',
    diarreia: 'Não',
    vomito: 'Não',
    perdaOlfato: 'Não',
    perdaPaladar: 'Não',
    nosocomial: 'Não',
    internacao: 'Não',
    uti: 'Não',
    diasUTI: 0,
    suporteVentilatorio: 'Não',
  });

  const handleSearch = async (_event: any, newValue: string, reason: string) => {
    if (reason === 'reset' || reason === 'selectOption') return;
    if (!newValue) {
      patientService.findAll(0, 50, '').then(data => setPatients(data.content)).catch(console.error);
      return;
    }
    setSearchLoading(true);
    try {
      const data = await patientService.findAll(0, 10, newValue);
      setPatients(data.content);
    } catch (e) {
      console.error(e);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'uti' && value === 'Não') {
        newData.diasUTI = 0;
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!selectedPatient || !selectedPatient.id) {
      setError('Selecione um paciente para continuar.');
      return;
    }

    setLoading(true);
    try {
      let suporteFormatado = formData.suporteVentilatorio;
      if (suporteFormatado === 'Sim - não invasivo') {
        suporteFormatado = 'Sim - nao invasivo';
      } else if (suporteFormatado === 'Não') {
        suporteFormatado = 'Nao';
      }

      const response = await predictionService.predictEpisode({
        pacienteId: selectedPatient.id,
        episodio: {
           ...formData,
           suporteVentilatorio: suporteFormatado,
           diasUTI: Number(formData.diasUTI)
        }
      });
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao realizar a predição clínica.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>Nova Predição Clínica</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {!result ? (
        <form onSubmit={handleSubmit}>
          
          <Box sx={{ mb: 4 }}>
            <Card sx={{ borderTop: '4px solid #175CD3' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #EAECF0', pb: 1, color: '#175CD3' }}>
                  Selecionar Paciente
                </Typography>
                
                <Autocomplete
                  options={patients}
                  getOptionLabel={(option) => `${option.nome} (CPF: ${option.cpf})`}
                  filterOptions={(x) => x}
                  onInputChange={handleSearch}
                  onChange={(_event, newValue) => setSelectedPatient(newValue)}
                  loading={searchLoading}
                  renderInput={(params) => (
                    <TextField {...params} label="Buscar por Nome ou CPF" variant="outlined" fullWidth />
                  )}
                />

                {selectedPatient && (
                  <Box sx={{ mt: 3, p: 2, backgroundColor: '#F8FAFC', borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Dados Cadastrais (Read-only)</Typography>
                    <Typography variant="body1"><strong>Nome:</strong> {selectedPatient.nome}</Typography>
                    <Typography variant="body1"><strong>Idade Mapeada:</strong> {calculateAge(selectedPatient.dataNascimento)} anos ({new Date(selectedPatient.dataNascimento).toLocaleDateString()})</Typography>
                    <Typography variant="body1"><strong>Sexo:</strong> {selectedPatient.sexo}</Typography>
                    <Typography variant="body1">
                      <strong>Tipo de Paciente (Modelo Preditivo):</strong> <span style={{ color: '#0F52BA', fontWeight: 600 }}>{getPatientType(selectedPatient)}</span>
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
            {/* SINTOMAS */}
            <Card sx={{ height: '100%', backgroundColor: '#FFF9F5', borderTop: '4px solid #F97066' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #FECDCA', pb: 1, color: '#B42318' }}>
                  Sintomas do Episódio Atual
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  <CustomSelect label="Febre" name="febre" value={formData.febre} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Tosse" name="tosse" value={formData.tosse} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Dispneia" name="dispneia" value={formData.dispneia} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Fadiga" name="fadiga" value={formData.fadiga} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Dor Abdominal" name="dorAbdominal" value={formData.dorAbdominal} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Dor de Garganta" name="dorGarganta" value={formData.dorGarganta} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Saturação O2 < 95%" name="saturacao" value={formData.saturacao} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Desc. Respiratório" name="desconfortoRespiratorio" value={formData.desconfortoRespiratorio} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Diarreia" name="diarreia" value={formData.diarreia} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Vômito" name="vomito" value={formData.vomito} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Perda de Olfato" name="perdaOlfato" value={formData.perdaOlfato} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Perda de Paladar" name="perdaPaladar" value={formData.perdaPaladar} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Nosocomial" name="nosocomial" value={formData.nosocomial} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                </Box>
              </CardContent>
            </Card>

            {/* INTERNAÇÃO */}
            <Card sx={{ height: '100%', backgroundColor: '#F9F5FF', borderTop: '4px solid #9B86EC' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #D6BBFB', pb: 1, color: '#6941C6' }}>
                  Dados de Internação
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  <CustomSelect label="Houve Internação?" name="internacao" value={formData.internacao} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />
                  <CustomSelect label="Suporte Ventilatório" name="suporteVentilatorio" value={formData.suporteVentilatorio} onChange={handleChange} options={SUPORT_VEN_OPTIONS} placeholder="Invasivo..." />
                  <CustomSelect label="Internado em UTI?" name="uti" value={formData.uti} onChange={handleChange} options={YES_NO_OPTIONS} placeholder="Sim ou Não" />

                  {formData.uti === 'Sim' && (
                    <CustomTextField label="Dias em UTI" name="diasUTI" value={formData.diasUTI} onChange={handleChange} placeholder="Ex: 5" type="number" />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ mt: 2, mb: 6 }}>
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={loading || !selectedPatient} sx={{ py: 2, fontSize: '1.1rem' }}>
              {loading ? (
                <><CircularProgress size={24} color="inherit" sx={{ mr: 2 }} /> Processando...</>
              ) : (
                'Realizar Predição'
              )}
            </Button>
            {loading && <LinearProgress sx={{ mt: 1, borderRadius: 2 }} />}
          </Box>
        </form>
      ) : (
        <Box>
          <Button variant="outlined" onClick={() => setResult(null)} sx={{ mb: 2 }}>
            ← Fazer Nova Predição
          </Button>
          <Dashboard response={result} />
        </Box>
      )}
    </Box>
  );
};
