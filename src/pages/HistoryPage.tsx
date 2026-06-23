import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { predictionService } from '../services/prediction.service';
import type { Predicao } from '../types/api';
import { Dashboard } from '../components/Dashboard';

export const HistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Predicao[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<any | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await predictionService.getAllHistory();
      setHistory(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { 
      field: 'dataHora', 
      headerName: 'Data/Hora', 
      width: 160,
      valueFormatter: (params: any) => params?.value ? new Date(params.value).toLocaleString('pt-BR') : ''
    },
    { 
      field: 'pacienteNome', 
      headerName: 'Paciente', 
      flex: 1,
      valueGetter: (params: any) => params.row?.atendimento?.paciente?.nome || 'Desconhecido'
    },
    { 
      field: 'resultado', 
      headerName: 'Veredito', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          label={params.value} 
          color={params.value === 'Obito' ? 'error' : 'success'} 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
      )
    },
    { field: 'tempoProcessamentoMs', headerName: 'Tempo (ms)', width: 100 },
    {
      field: 'actions',
      headerName: 'Detalhes',
      width: 150,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => {
            if (params.row.respostaCompleta) {
              setSelectedPrediction(JSON.parse(params.row.respostaCompleta));
            }
          }}
        >
          Visualizar
        </Button>
      ),
    },
  ];

  if (selectedPrediction) {
    return (
      <Box>
        <Button variant="outlined" onClick={() => setSelectedPrediction(null)} sx={{ mb: 3 }}>
          ← Voltar para Histórico
        </Button>
        <Dashboard response={selectedPrediction} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600" color="primary.main">Histórico de Predições</Typography>
        <Button variant="contained" onClick={fetchHistory}>Atualizar</Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
        <DataGrid
          rows={history}
          columns={columns}
          loading={loading}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
          }}
        />
      </Paper>
    </Box>
  );
};
