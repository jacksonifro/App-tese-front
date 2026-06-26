import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { Activity, History, Users, AlertTriangle, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/patient.service';
import { predictionService } from '../services/prediction.service';
import { getPatientType } from '../utils/patientUtils';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalPredictions: 0,
    criticalPatients: 0,
    averageAge: 0,
  });
  
  const [verdictData, setVerdictData] = useState<any[]>([]);
  const [patientTypeData, setPatientTypeData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patientsRes, historyRes] = await Promise.all([
           patientService.findAll(0, 1000),
           predictionService.getAllHistory()
        ]);
        
        const patients = patientsRes.content || [];
        const totalPatients = patientsRes.totalElements || 0;
        const totalPredictions = historyRes.length;
        
        const criticalCount = historyRes.filter(h => h.resultado === 'ÓBITO' || h.resultado === 'OBITO').length;
        
        let sumAge = 0;
        let validAges = 0;
        const typesCount: Record<string, number> = {};
        
        patients.forEach(p => {
          if (p.dataNascimento) {
            const age = new Date().getFullYear() - new Date(p.dataNascimento).getFullYear();
            sumAge += age;
            validAges++;
          }
          const type = getPatientType(p);
          typesCount[type] = (typesCount[type] || 0) + 1;
        });
        
        const avgAge = validAges > 0 ? Math.round(sumAge / validAges) : 0;
        
        setStats({
          totalPatients,
          totalPredictions,
          criticalPatients: criticalCount,
          averageAge: avgAge
        });

        // Gráfico Vereditos (Pie Chart)
        let cura = 0; let obito = 0;
        historyRes.forEach(h => {
          if (h.resultado === 'ÓBITO' || h.resultado === 'OBITO') obito++;
          else cura++;
        });
        setVerdictData([
          { name: 'Cura', value: cura, color: '#12B76A' },
          { name: 'Óbito', value: obito, color: '#D92D20' }
        ]);

        // Gráfico Tipos de Paciente (Bar Chart)
        const pTypeData = Object.entries(typesCount).map(([name, count]) => {
          let shortName = name.split(' ')[0]; // Simplificar nomes grandes
          if (name === 'Adulto / Idoso') shortName = 'Adulto/Idoso';
          return {
            name: shortName,
            quantidade: count
          };
        }).sort((a, b) => b.quantidade - a.quantidade);
        setPatientTypeData(pTypeData);

        // Gráfico Linha do Tempo (Area Chart)
        const timelineObj: Record<string, number> = {};
        historyRes.forEach(h => {
          const date = new Date(h.dataHora);
          const key = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
          timelineObj[key] = (timelineObj[key] || 0) + 1;
        });
        
        const sortedDates = Object.keys(timelineObj).sort((a,b) => {
           const [d1, m1] = a.split('/');
           const [d2, m2] = b.split('/');
           return (parseInt(m1)*100 + parseInt(d1)) - (parseInt(m2)*100 + parseInt(d2));
        });

        setTimelineData(sortedDates.map(d => ({ name: d, Predições: timelineObj[d] })));

      } catch (err) {
         console.error('Error loading dashboard data', err);
      } finally {
         setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* CABEÇALHO E ATALHOS RÁPIDOS */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="700" color="primary.main" gutterBottom>
            Dashboard Analítico
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Visão geral dos pacientes e predições clínicas do SaúdePredict CDSS.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" startIcon={<Users size={18} />} onClick={() => navigate('/pacientes')}>
            Pacientes
          </Button>
          <Button variant="outlined" startIcon={<History size={18} />} onClick={() => navigate('/history')}>
            Histórico
          </Button>
          <Button variant="contained" color="primary" startIcon={<Plus size={18} />} onClick={() => navigate('/predicao/nova')}>
            Nova Predição
          </Button>
        </Box>
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderLeft: '4px solid #0F52BA' }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>Total de Pacientes</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Users color="#0F52BA" size={32} />
                <Typography variant="h4" fontWeight="700">{stats.totalPatients}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderLeft: '4px solid #32D583' }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>Predições Realizadas</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Activity color="#32D583" size={32} />
                <Typography variant="h4" fontWeight="700">{stats.totalPredictions}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderLeft: '4px solid #D92D20' }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>Casos Críticos (Óbito)</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <AlertTriangle color="#D92D20" size={32} />
                <Typography variant="h4" fontWeight="700">{stats.criticalPatients}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', borderLeft: '4px solid #F79009' }}>
            <CardContent>
              <Typography color="text.secondary" variant="subtitle2" gutterBottom>Média de Idade</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="h4" fontWeight="700" sx={{ color: '#F79009' }}>{stats.averageAge}</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>anos</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* GRÁFICOS */}
      <Grid container spacing={3}>
        {/* Gráfico 1: Barras */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, height: '100%', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>Distribuição de Pacientes (Grupo de Risco)</Typography>
              <Box sx={{ height: 300, mt: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={patientTypeData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: 8 }} />
                    <Bar dataKey="quantidade" fill="#0F52BA" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico 2: Pizza */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3, height: '100%', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <CardContent sx={{ pb: 1 }}>
              <Typography variant="h6" fontWeight="600" gutterBottom>Proporção de Vereditos</Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={verdictData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {verdictData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8 }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Gráfico 3: Área */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="600" gutterBottom>Volume de Predições Diárias</Typography>
              <Box sx={{ height: 300, mt: 3 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0F52BA" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#0F52BA" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 8 }} />
                    <Area type="monotone" dataKey="Predições" stroke="#0F52BA" fillOpacity={1} fill="url(#colorPred)" />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

      </Grid>
    </Box>
  );
};
