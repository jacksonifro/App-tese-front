import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Tabs, Tab, TextField, MenuItem, Grid, CircularProgress } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm as useRHForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save, ArrowLeft, ArrowRight } from 'lucide-react';
import { patientService } from '../services/patient.service';
import { formatCpf, formatCep, formatTelefone, formatCns } from '../utils/formatters';
import Swal from 'sweetalert2';

const YES_NO_OPTIONS = ['Sim', 'Não'];
const RACA_OPTIONS = ['Parda', 'Preta', 'Indigena', 'Branca', 'Amarela'];
const ZONA_OPTIONS = ['Urbana', 'Rural', 'Periurbana'];
const UF_NORTE_OPTIONS = ['AC', 'AP', 'AM', 'PA', 'RO', 'RR', 'TO'];

const TAB_FIELDS = [
  ['nome', 'cpf', 'cns', 'dataNascimento', 'sexo', 'raca', 'gestante', 'puerpera'],
  ['endereco.cep', 'endereco.logradouro', 'endereco.numero', 'endereco.bairro', 'endereco.uf', 'endereco.municipio', 'endereco.zona'],
  ['contato.telefone', 'contato.celular', 'contato.email'],
  ['comorbidade.fatorRisco', 'comorbidade.diabetes', 'comorbidade.cardiopatia', 'comorbidade.asma', 'comorbidade.renal', 'comorbidade.hepatica', 'comorbidade.pneumopatia', 'comorbidade.hematologica', 'comorbidade.neurologica', 'comorbidade.imunodepressao', 'comorbidade.sindromeDown', 'comorbidade.obesidade'],
  ['vacinacao.vacinaCovid', 'vacinacao.primeiraDose', 'vacinacao.segundaDose', 'vacinacao.terceiraDose', 'vacinacao.vacinaInfluenza']
];

const patientSchema = z.object({
  nome: z.string().min(3, 'Nome é obrigatório'),
  cpf: z.string().min(11, 'CPF inválido'),
  cns: z.string().nullish(),
  dataNascimento: z.string().min(10, 'Data obrigatória'),
  sexo: z.string().min(1, 'Obrigatório'),
  gestante: z.string().min(1, 'Obrigatório'),
  puerpera: z.string().min(1, 'Obrigatório'),
  raca: z.string().min(1, 'Obrigatório'),
  
  endereco: z.object({
    cep: z.string().nullish(),
    logradouro: z.string().nullish(),
    numero: z.string().nullish(),
    bairro: z.string().nullish(),
    municipio: z.string().nullish(),
    uf: z.string().min(1, 'Obrigatório'),
    zona: z.string().min(1, 'Obrigatório'),
  }),

  contato: z.object({
    telefone: z.string().nullish(),
    celular: z.string().nullish(),
    email: z.string().email('Email inválido').or(z.literal('')).nullish(),
  }).nullish(),

  comorbidade: z.object({
    fatorRisco: z.string().min(1),
    diabetes: z.string().min(1),
    cardiopatia: z.string().min(1),
    asma: z.string().min(1),
    renal: z.string().min(1),
    hepatica: z.string().min(1),
    pneumopatia: z.string().min(1),
    hematologica: z.string().min(1),
    neurologica: z.string().min(1),
    imunodepressao: z.string().min(1),
    sindromeDown: z.string().min(1),
    obesidade: z.string().min(1),
  }),

  vacinacao: z.object({
    vacinaCovid: z.string().min(1),
    primeiraDose: z.string().min(1),
    segundaDose: z.string().min(1),
    terceiraDose: z.string().min(1),
    vacinaInfluenza: z.string().min(1),
  }),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export const PatientForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cidades, setCidades] = useState<string[]>([]);
  const [loadingCidades, setLoadingCidades] = useState(false);

  const { control, handleSubmit, reset, watch, setValue, trigger, formState: { errors } } = useRHForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      nome: '',
      cpf: '',
      cns: '',
      dataNascimento: '',
      sexo: 'Feminino',
      gestante: 'Não',
      puerpera: 'Não',
      raca: '',
      endereco: { cep: '', logradouro: '', numero: '', bairro: '', municipio: '', uf: '', zona: '' },
      contato: { telefone: '', celular: '', email: '' },
      comorbidade: { 
        fatorRisco: 'Não', diabetes: 'Não', cardiopatia: 'Não', asma: 'Não',
        renal: 'Não', hepatica: 'Não', pneumopatia: 'Não', hematologica: 'Não',
        neurologica: 'Não', imunodepressao: 'Não', sindromeDown: 'Não', obesidade: 'Não'
      },
      vacinacao: { vacinaCovid: 'Não', primeiraDose: 'Não', segundaDose: 'Não', terceiraDose: 'Não', vacinaInfluenza: 'Não' }
    }
  });

  const ufSelecionada = watch('endereco.uf');
  const dataNascimentoSelecionada = watch('dataNascimento');

  const idadeCalculada = React.useMemo(() => {
    if (!dataNascimentoSelecionada) return '';
    const hoje = new Date();
    const nasc = new Date(dataNascimentoSelecionada);
    const nascLocal = new Date(nasc.getTime() + Math.abs(nasc.getTimezoneOffset() * 60000));
    let idade = hoje.getFullYear() - nascLocal.getFullYear();
    const m = hoje.getMonth() - nascLocal.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascLocal.getDate())) {
      idade--;
    }
    return isNaN(idade) ? '' : `${idade} anos`;
  }, [dataNascimentoSelecionada]);

  useEffect(() => {
    if (ufSelecionada && UF_NORTE_OPTIONS.includes(ufSelecionada)) {
      setLoadingCidades(true);
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufSelecionada}/municipios`)
        .then(res => res.json())
        .then(data => {
          setCidades(data.map((c: any) => c.nome));
          setLoadingCidades(false);
        })
        .catch(() => setLoadingCidades(false));
    } else {
      setCidades([]);
    }
  }, [ufSelecionada]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      patientService.findById(Number(id)).then(data => {
        const safeData = {
          ...data,
          gestante: data.gestante || 'Não',
          puerpera: data.puerpera || 'Não',
          sexo: data.sexo || 'Feminino',
          raca: data.raca || '',
          endereco: data.endereco || { cep: '', logradouro: '', numero: '', bairro: '', municipio: '', uf: '', zona: '' },
          contato: data.contato || { telefone: '', celular: '', email: '' },
          comorbidade: data.comorbidade || {},
          vacinacao: data.vacinacao || {}
        };
        
        // Assegurar defaults para comboboxes do MUI
        safeData.endereco.zona = safeData.endereco.zona || '';
        safeData.endereco.uf = safeData.endereco.uf || '';
        safeData.endereco.municipio = safeData.endereco.municipio || '';

        if (safeData.raca === 'Ignorado') safeData.raca = '';
        if (safeData.endereco.zona === 'Ignorado') safeData.endereco.zona = '';

        const comorbKeys = ['fatorRisco', 'diabetes', 'cardiopatia', 'asma', 'renal', 'hepatica', 'pneumopatia', 'hematologica', 'neurologica', 'imunodepressao', 'sindromeDown', 'obesidade'];
        comorbKeys.forEach(k => {
          // @ts-ignore
          if (!safeData.comorbidade[k] || safeData.comorbidade[k] === 'Ignorado') {
            // @ts-ignore
            safeData.comorbidade[k] = 'Não';
          }
        });

        const vacKeys = ['vacinaCovid', 'primeiraDose', 'segundaDose', 'terceiraDose', 'vacinaInfluenza'];
        vacKeys.forEach(k => {
          // @ts-ignore
          if (!safeData.vacinacao[k] || safeData.vacinacao[k] === 'Ignorado') {
            // @ts-ignore
            safeData.vacinacao[k] = 'Não';
          }
        });
        
        // Limpar os nulls residuais
        const removeNulls = (obj: any) => {
          Object.keys(obj).forEach(key => {
            if (obj[key] === null) obj[key] = '';
            else if (typeof obj[key] === 'object' && obj[key] !== null) removeNulls(obj[key]);
          });
        };
        removeNulls(safeData);

        // @ts-ignore
        reset(safeData);
        setLoading(false);
      });
    }
  }, [id, reset]);

  const onSubmit = async (data: PatientFormData) => {
    if (tabValue < 4) {
      handleNext();
      return;
    }
    try {
      setLoading(true);
      if (id) {
        await patientService.update(Number(id), data as any);
      } else {
        await patientService.create(data as any);
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: `Paciente ${id ? 'atualizado' : 'cadastrado'} com sucesso!`,
        confirmButtonColor: '#12B76A'
      });

      navigate('/pacientes');
    } catch (e) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao Salvar',
        text: 'Erro interno ao salvar paciente. Verifique se o CPF já existe ou os dados estão corretos.',
        confirmButtonColor: '#d33'
      });
    }
  };

  const onError = (errors: any) => {
    console.error("Zod Validation Errors:", errors);
    Swal.fire({
      icon: 'warning',
      title: 'Atenção!',
      text: 'Existem campos obrigatórios não preenchidos ou inválidos. Preencha os campos vermelhos para continuar.',
      confirmButtonColor: '#f39c12'
    });
  };

  const handleNext = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.preventDefault();
    
    const fieldsToValidate = TAB_FIELDS[tabValue] as any;
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      setTabValue((prev) => Math.min(4, prev + 1));
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Campos Obrigatórios',
        text: 'Preencha corretamente todos os campos obrigatórios (*) desta aba antes de avançar.',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button startIcon={<ArrowLeft />} onClick={() => navigate('/pacientes')} color="inherit">
            Voltar
          </Button>
          <Typography variant="h4" fontWeight="600" color="primary.main">
            {id ? 'Editar Paciente' : 'Novo Paciente'}
          </Typography>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', borderRadius: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)} 
            variant="scrollable" 
            scrollButtons="auto"
            sx={{
              '& .MuiTabs-indicator': { backgroundColor: '#0F52BA', height: 3 },
              '& .MuiTab-root': { fontWeight: 500 },
              '& .MuiTab-root.Mui-selected': { color: '#0F52BA', fontWeight: 700 }
            }}
          >
            <Tab label="Identificação" />
            <Tab label="Endereço" />
            <Tab label="Contato" />
            <Tab label="Comorbidades" />
            <Tab label="Vacinação" />
          </Tabs>
        </Box>

        <Box sx={{ p: 4 }}>
          <form 
            onSubmit={handleSubmit(onSubmit, onError)} 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (tabValue < 4) handleNext();
                else handleSubmit(onSubmit, onError)();
              }
            }}
          >
            
            {/* IDENTIFICACAO */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Controller name="nome" control={control} render={({ field }) => (
                    <TextField {...field} label="Nome Completo *" fullWidth error={!!errors.nome} helperText={errors.nome?.message} />
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="cpf" control={control} render={({ field }) => (
                    <TextField 
                      {...field} 
                      onChange={(e) => field.onChange(formatCpf(e.target.value))}
                      label="CPF *" fullWidth error={!!errors.cpf} helperText={errors.cpf?.message} 
                    />
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="cns" control={control} render={({ field }) => (
                    <TextField 
                      {...field} 
                      onChange={(e) => field.onChange(formatCns(e.target.value))}
                      label="Cartão SUS (CNS)" fullWidth error={!!errors.cns} helperText={errors.cns?.message} 
                    />
                  )} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller name="dataNascimento" control={control} render={({ field }) => (
                    <TextField {...field} type="date" label="Data Nasc. *" fullWidth InputLabelProps={{ shrink: true }} error={!!errors.dataNascimento} />
                  )} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="Idade Calculada" value={idadeCalculada} fullWidth disabled sx={{ backgroundColor: '#f5f5f5' }} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller name="sexo" control={control} render={({ field }) => (
                    <TextField {...field} select label="Sexo *" fullWidth error={!!errors.sexo}>
                      <MenuItem value="Feminino">Feminino</MenuItem>
                      <MenuItem value="Masculino">Masculino</MenuItem>
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller name="raca" control={control} render={({ field }) => (
                    <TextField {...field} select label="Raça/Cor *" fullWidth error={!!errors.raca} helperText={errors.raca?.message}>
                      {RACA_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller name="gestante" control={control} render={({ field }) => (
                    <TextField {...field} select label="Gestante" fullWidth>
                      <MenuItem value="Sim">Sim</MenuItem>
                      <MenuItem value="Não">Não</MenuItem>
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <Controller name="puerpera" control={control} render={({ field }) => (
                    <TextField {...field} select label="Puérpera" fullWidth>
                      <MenuItem value="Sim">Sim</MenuItem>
                      <MenuItem value="Não">Não</MenuItem>
                    </TextField>
                  )} />
                </Grid>
              </Grid>
            </TabPanel>

            {/* ENDERECO */}
            <TabPanel value={tabValue} index={1}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Controller name="endereco.cep" control={control} render={({ field }) => (
                    <TextField 
                      {...field} 
                      onChange={(e) => field.onChange(formatCep(e.target.value))}
                      label="CEP" fullWidth 
                    />
                  )} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Controller name="endereco.logradouro" control={control} render={({ field }) => (
                    <TextField {...field} label="Logradouro" fullWidth />
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="endereco.numero" control={control} render={({ field }) => (
                    <TextField {...field} label="Número/Complemento" fullWidth />
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="endereco.bairro" control={control} render={({ field }) => (
                    <TextField {...field} label="Bairro" fullWidth />
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="endereco.uf" control={control} render={({ field }) => (
                    <TextField {...field} select label="Estado (UF Norte) *" fullWidth error={!!errors.endereco?.uf} helperText={errors.endereco?.uf?.message}>
                      <MenuItem value=""><em>Selecione...</em></MenuItem>
                      {UF_NORTE_OPTIONS.map(uf => <MenuItem key={uf} value={uf}>{uf}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="endereco.municipio" control={control} render={({ field }) => (
                    <TextField {...field} select label="Município" fullWidth disabled={cidades.length === 0 || loadingCidades}>
                      {loadingCidades ? <MenuItem value=""><CircularProgress size={20} /></MenuItem> : null}
                      <MenuItem value=""><em>{cidades.length > 0 ? 'Selecione...' : 'Escolha a UF primeiro'}</em></MenuItem>
                      {cidades.map(cidade => <MenuItem key={cidade} value={cidade}>{cidade}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller name="endereco.zona" control={control} render={({ field }) => (
                    <TextField {...field} select label="Zona Residencial *" fullWidth error={!!errors.endereco?.zona} helperText={errors.endereco?.zona?.message}>
                      {ZONA_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
              </Grid>
            </TabPanel>

            {/* CONTATO */}
            <TabPanel value={tabValue} index={2}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller name="contato.telefone" control={control} render={({ field }) => (
                    <TextField 
                      {...field} 
                      onChange={(e) => field.onChange(formatTelefone(e.target.value))}
                      label="Telefone Residencial" fullWidth 
                    />
                  )} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller name="contato.celular" control={control} render={({ field }) => (
                    <TextField 
                      {...field} 
                      onChange={(e) => field.onChange(formatTelefone(e.target.value))}
                      label="Celular" fullWidth 
                    />
                  )} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller name="contato.email" control={control} render={({ field }) => (
                    <TextField {...field} label="E-mail" fullWidth error={!!errors.contato?.email} helperText={errors.contato?.email?.message} />
                  )} />
                </Grid>
              </Grid>
            </TabPanel>

            {/* COMORBIDADES */}
            <TabPanel value={tabValue} index={3}>
               <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
                 Marque os fatores de risco e comorbidades apresentados pelo paciente:
               </Typography>
               <Grid container spacing={3}>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.fatorRisco" control={control} render={({ field }) => (
                    <TextField {...field} select label="Possui Fator Risco? *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.diabetes" control={control} render={({ field }) => (
                    <TextField {...field} select label="Diabetes *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.cardiopatia" control={control} render={({ field }) => (
                    <TextField {...field} select label="Cardiopatia *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.asma" control={control} render={({ field }) => (
                    <TextField {...field} select label="Asma *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.renal" control={control} render={({ field }) => (
                    <TextField {...field} select label="Doença Renal *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.hepatica" control={control} render={({ field }) => (
                    <TextField {...field} select label="Doença Hepática *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.pneumopatia" control={control} render={({ field }) => (
                    <TextField {...field} select label="Pneumopatia *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.hematologica" control={control} render={({ field }) => (
                    <TextField {...field} select label="D. Hematológica *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.neurologica" control={control} render={({ field }) => (
                    <TextField {...field} select label="D. Neurológica *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.imunodepressao" control={control} render={({ field }) => (
                    <TextField {...field} select label="Imunodepressão *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.sindromeDown" control={control} render={({ field }) => (
                    <TextField {...field} select label="Síndrome de Down *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} sm={4} md={3}>
                  <Controller name="comorbidade.obesidade" control={control} render={({ field }) => (
                    <TextField {...field} select label="Obesidade *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
               </Grid>
            </TabPanel>

            {/* VACINACAO */}
            <TabPanel value={tabValue} index={4}>
               <Typography variant="subtitle1" sx={{ mb: 2, color: 'text.secondary', fontWeight: 'bold' }}>
                 Histórico de Vacinação do Paciente:
               </Typography>
               <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <Controller name="vacinacao.vacinaCovid" control={control} render={({ field }) => (
                    <TextField {...field} select label="Tomou Vacina COVID? *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller name="vacinacao.primeiraDose" control={control} render={({ field }) => (
                    <TextField {...field} select label="1ª Dose COVID *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller name="vacinacao.segundaDose" control={control} render={({ field }) => (
                    <TextField {...field} select label="2ª Dose COVID *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller name="vacinacao.terceiraDose" control={control} render={({ field }) => (
                    <TextField {...field} select label="3ª Dose COVID (Reforço) *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Controller name="vacinacao.vacinaInfluenza" control={control} render={({ field }) => (
                    <TextField {...field} select label="Tomou Vacina Gripe? *" fullWidth>
                      {YES_NO_OPTIONS.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </TextField>
                  )} />
                </Grid>
               </Grid>
            </TabPanel>

            {/* NAVIGATION WIZARD */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 5, pt: 3, borderTop: '1px solid #EAECF0' }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() => setTabValue(prev => Math.max(0, prev - 1))}
                disabled={tabValue === 0}
                startIcon={<ArrowLeft />}
                sx={{ px: 4 }}
              >
                Voltar
              </Button>

              {tabValue < 4 ? (
                <Button
                  type="button"
                  variant="contained"
                  onClick={handleNext}
                  endIcon={<ArrowRight />}
                  sx={{ px: 4 }}
                >
                  Avançar
                </Button>
              ) : (
                <Button 
                  type="submit"
                  variant="contained" 
                  color="success"
                  startIcon={<Save />} 
                  disabled={loading}
                  sx={{ px: 4, backgroundColor: '#12B76A', '&:hover': { backgroundColor: '#039855' } }}
                >
                  Salvar Paciente
                </Button>
              )}
            </Box>

          </form>
        </Box>
      </Paper>
    </Box>
  );
};
