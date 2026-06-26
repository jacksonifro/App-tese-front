import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import { X } from 'lucide-react';
import { predictionService } from '../services/prediction.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
  open: boolean;
  onClose: () => void;
  patientId: number | null;
}

export const PatientEvolutionModal: React.FC<Props> = ({ open, onClose, patientId }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (open && patientId) {
      fetchHistory();
    } else {
      setData([]);
    }
  }, [open, patientId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const history = await predictionService.getHistoryByPatient(patientId!);
      
      // Ordenar por data crescente para a evolução no tempo
      const sorted = history.sort((a: any, b: any) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
      
      const firstDate = sorted.length > 0 ? new Date(sorted[0].dataHora).getTime() : 0;

      const chartData = sorted.map((item: any, idx: number) => {
        let obito = 0;
        let cura = 0;
        try {
          const parsed = JSON.parse(item.respostaCompleta);
          if (parsed && parsed.verdictBoard && parsed.verdictBoard.scorePanel) {
             obito = parsed.verdictBoard.scorePanel['Óbito'] || parsed.verdictBoard.scorePanel['Obito'] || 0;
             cura = parsed.verdictBoard.scorePanel['Cura'] || 0;
          }
        } catch(e) {}
        
        const total = obito + cura;
        const percObito = total > 0 ? (obito / total) * 100 : 0;
        const percCura = total > 0 ? (cura / total) * 100 : 0;

        // Se o paciente tiver 1 predição no primeiro dia, Diff será 0. Então será D0.
        const diffTime = new Date(item.dataHora).getTime() - firstDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        return {
          name: `Predição ${idx + 1}|${new Date(item.dataHora).toLocaleDateString('pt-BR')}`,
          fullDate: new Date(item.dataHora).toLocaleDateString('pt-BR'),
          Óbito: parseFloat(percObito.toFixed(1)),
          Cura: parseFloat(percCura.toFixed(1))
        };
      });

      setData(chartData);
    } catch (error) {
      console.error('Failed to load history', error);
    } finally {
      setLoading(false);
    }
  };

  const CustomizedAxisTick = (props: any) => {
    const { x, y, payload } = props;
    const split = payload.value.split('|');
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={20} textAnchor="middle" fill="#64748B" fontSize={13}>
          <tspan x="0" dy="0">{split[0]}</tspan>
          <tspan x="0" dy="18" fontWeight="bold">{split[1]}</tspan>
        </text>
      </g>
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth sx={{ '& .MuiDialog-paper': { height: '80vh', maxHeight: 800 } }}>
      <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight="bold" color="primary">Evolução Temporal da Predição Clínica</Typography>
        <IconButton onClick={onClose}>
          <X />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers={false} sx={{ display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, flexGrow: 1, alignItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : data.length === 0 ? (
          <Typography textAlign="center" color="textSecondary" sx={{ py: 4 }}>
            Nenhum histórico disponível para exibir.
          </Typography>
        ) : (
          <Box sx={{ flexGrow: 1, minHeight: 500, mt: 2, width: '100%', mb: 4 }}>
            <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
              Probabilidade prevista pelo modelo de IA para os desfechos de cura e óbito durante a internação.
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 0, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  tick={<CustomizedAxisTick />}
                  axisLine={{ stroke: '#CBD5E1' }}
                  tickLine={false}
                  padding={{ left: 50, right: 50 }}
                />
                <YAxis 
                  tickFormatter={(val) => `${val}%`} 
                  domain={[0, 100]} 
                  ticks={[0, 25, 50, 75, 100]}
                  tick={{ fontSize: 13, fill: '#64748B' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [`${value}%`, name]}
                  labelFormatter={(label: string) => {
                    const split = label.split('|');
                    return `${split[0]} (${split[1]})`;
                  }}
                  contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 600 }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                <Line 
                  type="monotone" 
                  dataKey="Cura" 
                  stroke="#12B76A" 
                  activeDot={{ r: 6 }}
                  strokeWidth={2} 
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="Óbito" 
                  stroke="#D92D20" 
                  activeDot={{ r: 6 }} 
                  strokeWidth={2} 
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
