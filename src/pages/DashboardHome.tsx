import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { Stethoscope, Activity, History, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="700" color="primary.main" gutterBottom>
          Bem-vindo ao SaúdePredict CDSS
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Sistema Inteligente de Apoio à Decisão Clínica. Gerencie pacientes e realize predições de risco com IA.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, borderTop: '4px solid #0F52BA' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Users size={48} color="#0F52BA" style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight="600" gutterBottom>Cadastro de Pacientes</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Mantenha um registro unificado do histórico e comorbidades de cada paciente.
              </Typography>
              <Button variant="outlined" fullWidth onClick={() => navigate('/pacientes')}>Acessar Pacientes</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, borderTop: '4px solid #F97066' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <Activity size={48} color="#F97066" style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight="600" gutterBottom>Nova Predição Clínica</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Avalie os sintomas de um episódio atual para obter um veredito baseado em ML.
              </Typography>
              <Button variant="contained" color="primary" fullWidth onClick={() => navigate('/predicao/nova')}>Realizar Predição</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', borderRadius: 3, borderTop: '4px solid #32D583' }}>
            <CardContent sx={{ textAlign: 'center', p: 4 }}>
              <History size={48} color="#32D583" style={{ marginBottom: 16 }} />
              <Typography variant="h6" fontWeight="600" gutterBottom>Histórico Geral</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Acompanhe o histórico de todas as predições realizadas na unidade de saúde.
              </Typography>
              <Button variant="outlined" fullWidth onClick={() => navigate('/history')}>Ver Histórico</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
