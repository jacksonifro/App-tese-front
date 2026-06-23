import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, TextField, MenuItem,
  Button, CircularProgress, Alert, Select, LinearProgress
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import { formatCpf } from '../utils/formatters';
import {
  UF_OPTIONS, RACA_OPTIONS, ZONA_OPTIONS, YES_NO_OPTIONS,
  SUPORT_VEN_OPTIONS, SINTOMAS_LIST, COMORBIDADES_LIST, VACINACAO_LIST
} from '../constants/options';
import { PatientGroup } from '../enums/PatientGroup';
import { api } from '../services/api';
import type { PredictionResponse } from '../types/api';
import { Dashboard } from '../components/Dashboard';
import { saveToHistory } from '../store/historyStore';
import { v4 as uuidv4 } from 'uuid';

const CustomSelect = ({ label, name, value, onChange, options, placeholder, required = true, disabled = false }: any) => (
  <Box>
    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 700, color: disabled ? 'text.disabled' : 'text.secondary' }}>
      {label} {required && !disabled && <span style={{ color: '#D92D20' }}>*</span>}
    </Typography>
    <Select
      fullWidth
      name={name}
      value={value}
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
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      type={type}
      size="small"
      sx={{ backgroundColor: '#fff' }}
    />
  </Box>
);

export const PredictionPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const [formData, setFormData] = useState<Record<string, any>>({
    nome: '',
    cpf: '',
    patientGroup: PatientGroup.GESTANTE,
    NU_IDADE_N: '',
    CS_SEXO: 'Feminino',
    SG_UF_NOT: '',
    CS_RACA: '',
    CS_ZONA: '',
    NOSOCOMIAL: 'Não',
    FEBRE: 'Não',
    TOSSE: 'Não',
    GARGANTA: 'Não',
    DISPNEIA: 'Não',
    DESC_RESP: 'Não',
    SATURACAO: 'Não',
    DIARREIA: 'Não',
    VOMITO: 'Não',
    DOR_ABD: 'Não',
    FADIGA: 'Não',
    PERD_OLFT: 'Não',
    PERD_PALA: 'Não',
    FATOR_RISC: 'Não',
    CARDIOPATI: 'Não',
    HEMATOLOGI: 'Não',
    SIND_DOWN: 'Não',
    HEPATICA: 'Não',
    ASMA: 'Não',
    DIABETES: 'Não',
    NEUROLOGIC: 'Não',
    PNEUMOPATI: 'Não',
    IMUNODEPRE: 'Não',
    RENAL: 'Não',
    OBESIDADE: 'Não',
    VACINA_GRIPE: 'Não',
    INTERNACAO: 'Não',
    UTI: 'Não',
    DIAS_UTI: '',
    SUPORT_VEN: 'Não',
    VACINA_COV: 'Não',
    VACINA_COV_1_DOSE: 'Não',
    VACINA_COV_2_DOSE: 'Não',
    VACINA_COV_3_DOSE: 'Não'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;

    if (name === 'cpf') {
      setFormData(prev => ({ ...prev, cpf: formatCpf(value) }));
      return;
    }

    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-hide logic for UTI days
      if (name === 'UTI' && value === 'Não') {
        newData.DIAS_UTI = 0;
      }
      
      // Auto-reset logic for Comorbidades
      if (name === 'FATOR_RISC' && value === 'Não') {
        COMORBIDADES_LIST.forEach(c => {
          if (c.id !== 'FATOR_RISC') newData[c.id] = 'Não';
        });
      }
      
      // Auto-reset logic for Vacinas
      if (name === 'VACINA_COV' && value === 'Não') {
        newData.VACINA_COV_1_DOSE = 'Não';
        newData.VACINA_COV_2_DOSE = 'Não';
        newData.VACINA_COV_3_DOSE = 'Não';
      }
      if (name === 'VACINA_COV_1_DOSE' && value === 'Não') {
        newData.VACINA_COV_2_DOSE = 'Não';
        newData.VACINA_COV_3_DOSE = 'Não';
      }
      if (name === 'VACINA_COV_2_DOSE' && value === 'Não') {
        newData.VACINA_COV_3_DOSE = 'Não';
      }
      
      return newData;
    });
  };

  const validateForm = () => {
    const requiredFields = [
      'nome', 'cpf', 'NU_IDADE_N', 'SG_UF_NOT', 'CS_RACA', 'CS_ZONA',
      ...SINTOMAS_LIST.map(s => s.id),
      ...COMORBIDADES_LIST.map(c => c.id),
      ...VACINACAO_LIST.map(v => v.id),
      'INTERNACAO', 'UTI', 'SUPORT_VEN'
    ];

    for (const field of requiredFields) {
      if (formData[field] === '' || formData[field] === undefined) {
        return false;
      }
    }

    if (formData.UTI === 'Sim' && (formData.DIAS_UTI === '' || formData.DIAS_UTI === undefined)) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (formData.CS_SEXO !== 'Feminino') {
      setError('Apenas pacientes do sexo Feminino são suportados pelos modelos atuais.');
      return;
    }

    if (!validateForm()) {
      setError('Por favor, preencha todos os campos obrigatórios antes de realizar a predição.');
      return;
    }

    setLoading(true);

    try {
      const payload = { ...formData };
      delete payload.nome;
      delete payload.cpf;
      delete payload.patientGroup;

      payload.NU_IDADE_N = Number(payload.NU_IDADE_N);
      if (payload.UTI === 'Não') payload.DIAS_UTI = 0;
      else payload.DIAS_UTI = Number(payload.DIAS_UTI);

      // Jackson (Spring Boot) gerou as propriedades convertendo a primeira palavra para minúsculo
      // Ex: SG_UF_NOT -> sg_UF_NOT, VACINA_COV_3_DOSE -> vacina_COV_3_DOSE, ASMA -> asma
      const mapKeyForJackson = (key: string) => {
        const firstUnderscore = key.indexOf('_');
        if (firstUnderscore === -1) return key.toLowerCase();
        return key.substring(0, firstUnderscore).toLowerCase() + key.substring(firstUnderscore);
      };

      const mappedPayload: Record<string, any> = {};
      Object.keys(payload).forEach(key => {
        let value = payload[key];
        // Remover acentos de "Não" pois o modelo WEKA foi treinado com "Nao"
        if (typeof value === 'string') {
          value = value.replace(/Não/g, 'Nao').replace(/não/g, 'nao');
        }
        mappedPayload[mapKeyForJackson(key)] = value;
      });

      const endpoint = `/predict/${formData.patientGroup.toLowerCase()}`;

      const response = await api.post<PredictionResponse>(endpoint, mappedPayload);
      setResult(response.data);

      saveToHistory({
        id: uuidv4(),
        patientName: formData.nome,
        patientCpf: formData.cpf,
        timestamp: new Date().toISOString(),
        group: formData.patientGroup,
        verdict: response.data.verdictBoard.finalVerdict,
        processingTimeMs: response.data.processingTimeMs,
        fullResponse: response.data
      });

    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocorreu um erro ao conectar com o servidor. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>Nova Predição</Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      {!result ? (
        <form onSubmit={handleSubmit}>
          {/* DADOS DA PACIENTE */}
          <Box sx={{ mb: 4 }}>
            <Card sx={{ borderTop: '4px solid #175CD3' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #EAECF0', pb: 1, color: '#175CD3' }}>
                  Identificação da Paciente
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 2fr 1fr 1fr' }, gap: 2, mb: 2 }}>
                  <CustomTextField label="Nome do Paciente" name="nome" value={formData.nome} onChange={handleChange} placeholder="Ex: Maria da Silva" />
                  <CustomTextField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} placeholder="000.000.000-00" />
                  <CustomSelect label="Grupo Paciente" name="patientGroup" value={formData.patientGroup} onChange={handleChange} options={['GESTANTE', 'PUERPERA', 'CRIANCA']} placeholder="Selecione o Grupo" />
                  <CustomTextField label="Idade" name="NU_IDADE_N" value={formData.NU_IDADE_N} onChange={handleChange} placeholder="Ex: 28" type="number" />
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 2fr 2fr 2fr' }, gap: 2 }}>
                  <CustomSelect label="Sexo" name="CS_SEXO" value={formData.CS_SEXO} onChange={handleChange} options={['Feminino']} placeholder="Selecione" />
                  <CustomSelect label="Raça" name="CS_RACA" value={formData.CS_RACA} onChange={handleChange} options={RACA_OPTIONS} placeholder="Selecione a Raça" />
                  <CustomSelect label="Estado (UF Norte)" name="SG_UF_NOT" value={formData.SG_UF_NOT} onChange={handleChange} options={UF_OPTIONS} placeholder="Selecione o Estado" />
                  <CustomSelect label="Zona Residencial" name="CS_ZONA" value={formData.CS_ZONA} onChange={handleChange} options={ZONA_OPTIONS} placeholder="Urbana ou Rural" />
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
            {/* SINTOMAS */}
            <Card sx={{ height: '100%', backgroundColor: '#FFF9F5', borderTop: '4px solid #F97066' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #FECDCA', pb: 1, color: '#B42318' }}>
                  Sintomas Clínicos
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {SINTOMAS_LIST.map((sintoma) => (
                    <CustomSelect
                      key={sintoma.id}
                      label={sintoma.label}
                      name={sintoma.id}
                      value={formData[sintoma.id]}
                      onChange={handleChange}
                      options={YES_NO_OPTIONS}
                      placeholder="Sim ou Não"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* COMORBIDADES */}
            <Card sx={{ height: '100%', backgroundColor: '#FCFDFD', borderTop: '4px solid #FDB022' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #FEDF89', pb: 1, color: '#B54708' }}>
                  Comorbidades e Fatores de Risco
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                  {COMORBIDADES_LIST.map((comorb) => {
                    const isDisabled = comorb.id !== 'FATOR_RISC' && formData.FATOR_RISC !== 'Sim';
                    return (
                      <CustomSelect
                        key={comorb.id}
                        label={comorb.label}
                        name={comorb.id}
                        value={formData[comorb.id]}
                        onChange={handleChange}
                        options={YES_NO_OPTIONS}
                        placeholder="Sim ou Não"
                        disabled={isDisabled}
                      />
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
            {/* VACINAÇÃO */}
            <Card sx={{ height: '100%', backgroundColor: '#F6FEF9', borderTop: '4px solid #32D583' }}>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 3, borderBottom: '1px solid #A6F4C5', pb: 1, color: '#027A48' }}>
                  Vacinação
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                  {VACINACAO_LIST.map((vac) => {
                    let isDisabled = false;
                    if (vac.id === 'VACINA_COV_1_DOSE') isDisabled = formData.VACINA_COV !== 'Sim';
                    if (vac.id === 'VACINA_COV_2_DOSE') isDisabled = formData.VACINA_COV_1_DOSE !== 'Sim';
                    if (vac.id === 'VACINA_COV_3_DOSE') isDisabled = formData.VACINA_COV_2_DOSE !== 'Sim';
                    
                    return (
                      <CustomSelect
                        key={vac.id}
                        label={vac.label}
                        name={vac.id}
                        value={formData[vac.id]}
                        onChange={handleChange}
                        options={YES_NO_OPTIONS}
                        placeholder="Sim ou Não"
                        disabled={isDisabled}
                      />
                    );
                  })}
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
                  <CustomSelect
                    label="Houve Internação?"
                    name="INTERNACAO"
                    value={formData.INTERNACAO}
                    onChange={handleChange}
                    options={YES_NO_OPTIONS}
                    placeholder="Sim ou Não"
                  />
                  <CustomSelect
                    label="Suporte Ventilatório"
                    name="SUPORT_VEN"
                    value={formData.SUPORT_VEN}
                    onChange={handleChange}
                    options={SUPORT_VEN_OPTIONS}
                    placeholder="Invasivo, Não Invasivo..."
                  />
                  <CustomSelect
                    label="Internado em UTI?"
                    name="UTI"
                    value={formData.UTI}
                    onChange={handleChange}
                    options={YES_NO_OPTIONS}
                    placeholder="Sim ou Não"
                  />

                  {formData.UTI === 'Sim' && (
                    <CustomTextField
                      label="Dias em UTI"
                      name="DIAS_UTI"
                      value={formData.DIAS_UTI}
                      onChange={handleChange}
                      placeholder="Ex: 5"
                      type="number"
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* SUBMIT */}
          <Box sx={{ mt: 2, mb: 6 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={loading}
              sx={{ py: 2, fontSize: '1.1rem' }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} color="inherit" sx={{ mr: 2 }} />
                  Processando Modelos e IA...
                </>
              ) : (
                'Realizar Predição'
              )}
            </Button>
            {loading && (
              <LinearProgress sx={{ mt: 1, borderRadius: 2 }} />
            )}
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
