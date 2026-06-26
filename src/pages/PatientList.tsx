import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, TextField, Paper, IconButton, Tooltip, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { patientService } from '../services/patient.service';
import { getPatientType } from '../utils/patientUtils';
import type { PacienteDTO } from '../types/api';
import { Plus, Search, Pencil, Trash2, LineChart as LineChartIcon } from 'lucide-react';

import { PatientEvolutionModal } from '../components/PatientEvolutionModal';
import { predictionService } from '../services/prediction.service';

interface PacienteDTOWithCount extends PacienteDTO {
  qtdPredicoes?: number;
}

export const PatientList: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PacienteDTOWithCount[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  const [evolutionModalOpen, setEvolutionModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);

  const handleOpenEvolution = (id: number) => {
    setSelectedPatientId(id);
    setEvolutionModalOpen(true);
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const data = await patientService.findAll(paginationModel.page, paginationModel.pageSize, search);
      
      const contentWithCounts = await Promise.all(data.content.map(async (p: PacienteDTO) => {
         try {
           const history = await predictionService.getHistoryByPatient(p.id!);
           return { ...p, qtdPredicoes: history.length };
         } catch {
           return { ...p, qtdPredicoes: 0 };
         }
      }));
      
      setPatients(contentWithCounts);
      setTotalRows(data.totalElements);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [paginationModel.page, paginationModel.pageSize]);

  const handleSearch = () => {
    setPaginationModel({ ...paginationModel, page: 0 });
    fetchPatients();
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) {
      try {
        await patientService.delete(id);
        fetchPatients();
      } catch (error) {
        alert('Erro ao excluir paciente. Pode haver dependências atreladas a ele.');
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'nome', headerName: 'Nome Completo', flex: 1 },
    { field: 'cpf', headerName: 'CPF', width: 150 },
    { 
      field: 'dataNascimento', 
      headerName: 'Data Nasc.', 
      width: 120,
      valueFormatter: (params: any) => params?.value ? new Date(params.value).toLocaleDateString('pt-BR') : ''
    },
    { field: 'sexo', headerName: 'Sexo', width: 120 },
    { 
      field: 'tipo', 
      headerName: 'Tipo', 
      width: 150,
      renderCell: (params: any) => {
        const type = getPatientType(params.row);
        let color = 'default';
        if (type === 'Gestante') color = 'secondary';
        else if (type === 'Puérpera') color = 'error';
        else if (type.startsWith('Criança')) color = 'info';
        else color = 'primary';
        
        return <Chip label={type} color={color as any} size="small" variant="outlined" />;
      }
    },
    { 
      field: 'qtdPredicoes', 
      headerName: 'Nº Predições', 
      width: 120,
      renderCell: (params: any) => (
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {params.value || 0}
        </Typography>
      )
    },
    {
      field: 'actions',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Evolução">
            <IconButton 
              size="small" 
              color="info"
              onClick={() => handleOpenEvolution(params.row.id)}
              disabled={!params.row.qtdPredicoes}
            >
              <LineChartIcon size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton 
              size="small" 
              color="primary"
              onClick={() => navigate(`/pacientes/${params.row.id}`)}
            >
              <Pencil size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => handleDelete(params.row.id)}
            >
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="600" color="primary.main">Pacientes</Typography>
        <Button 
          variant="contained" 
          startIcon={<Plus />} 
          onClick={() => navigate('/pacientes/novo')}
          sx={{ borderRadius: 2 }}
        >
          Novo Paciente
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 3, borderRadius: 3, display: 'flex', gap: 2 }}>
        <TextField
          size="small"
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" color="secondary" onClick={handleSearch} startIcon={<Search />}>
          Buscar
        </Button>
      </Paper>

      <Paper sx={{ height: 600, width: '100%', borderRadius: 3, overflow: 'hidden' }}>
        <DataGrid
          rows={patients}
          columns={columns}
          rowCount={totalRows}
          loading={loading}
          paginationMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          sx={{
            border: 'none',
            '& .MuiDataGrid-cell:focus': { outline: 'none' },
          }}
        />
      </Paper>
      
      <PatientEvolutionModal 
        open={evolutionModalOpen}
        onClose={() => setEvolutionModalOpen(false)}
        patientId={selectedPatientId}
      />
    </Box>
  );
};
