import React from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import type { PredictionResponse } from '../types/api';
import ReactMarkdown from 'react-markdown';
import { Brain, Clock, ActivitySquare } from 'lucide-react';

interface DashboardProps {
  response: PredictionResponse;
}

export const Dashboard: React.FC<DashboardProps> = ({ response }) => {
  const verdict = response.verdictBoard.finalVerdict;
  const isCura = verdict.toUpperCase() === 'CURA';
  const color = isCura ? '#12B76A' : '#D92D20';

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {/* Resultado Final */}
        <Grid item xs={12}>
          <Card sx={{ borderLeft: `8px solid ${color}` }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="overline" color="textSecondary" sx={{ fontWeight: 600 }}>
                  Resultado Final
                </Typography>
                <Typography variant="h3" sx={{ color: color, fontWeight: 700, mt: 1 }}>
                  {isCura ? '🟢 ' : '🔴 '} {verdict}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end' }}>
                  <Clock size={16} /> Tempo de Processamento: {response.processingTimeMs}ms
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'flex-end', mt: 1 }}>
                  Data: {new Date().toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tribunal dos Modelos */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Brain size={20} /> Tribunal dos Modelos
              </Typography>
              {Object.entries(response.verdictBoard.scorePanel).map(([classe, peso]) => (
                <Box key={classe} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{classe}</Typography>
                    <Typography variant="body2" color="textSecondary">Peso: {peso.toFixed(2)}</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((peso / 5) * 100, 100)} 
                    sx={{ height: 10, borderRadius: 5, backgroundColor: '#EAECF0', '& .MuiLinearProgress-bar': { backgroundColor: classe.toUpperCase() === 'CURA' ? '#12B76A' : '#D92D20' } }} 
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Explicação IA */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#F0F9FF', borderColor: '#B9E6FE' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#026AA2', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ActivitySquare size={20} /> Análise da Inteligência Artificial (Gemini)
              </Typography>
              <Box sx={{ color: '#0B5351', '& p': { m: 0, mb: 1 } }}>
                {(!response.llmAnalysis || response.llmAnalysis.includes('Erro') || response.llmAnalysis.includes('429') || response.llmAnalysis.includes('Indisponivel')) ? (
                  <Typography sx={{ fontStyle: 'italic', color: '#026AA2' }}>
                    Modelo Gemini temporariamente indisponível (falha de comunicação ou cota excedida).
                  </Typography>
                ) : (
                  <ReactMarkdown>{response.llmAnalysis}</ReactMarkdown>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Explicação IA Groq */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#FDF4FF', borderColor: '#FBCFE8' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#9D174D', display: 'flex', alignItems: 'center', gap: 1 }}>
                <ActivitySquare size={20} /> Análise da Inteligência Artificial (Groq / Llama-3)
              </Typography>
              <Box sx={{ color: '#831843', '& p': { m: 0, mb: 1 } }}>
                {(!response.groqAnalysis || response.groqAnalysis.includes('Erro') || response.groqAnalysis.includes('429') || response.groqAnalysis.includes('Indisponivel')) ? (
                  <Typography sx={{ fontStyle: 'italic', color: '#9D174D' }}>
                    Modelo Groq temporariamente indisponível.
                  </Typography>
                ) : (
                  <ReactMarkdown>{response.groqAnalysis}</ReactMarkdown>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Consenso dos Modelos Individuais */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2, mt: 2 }}>Consenso Individual dos Modelos</Typography>
          <Grid container spacing={2}>
            {[
              { name: 'Random Forest', data: response.randomForest },
              { name: 'KNN', data: response.knn },
              { name: 'Logistic Regression', data: response.logisticRegression },
              { name: 'SVM', data: response.svm },
              { name: 'Gradient Boosting', data: response.gradientBoosting },
            ].map((model) => (
              model.data && (
                <Grid item xs={12} md={6} lg={4} key={model.name}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{model.name}</Typography>
                      <Chip 
                        label={model.data.predictedClass} 
                        size="small" 
                        sx={{ 
                          mt: 1, mb: 2, 
                          backgroundColor: model.data.predictedClass.toUpperCase() === 'CURA' ? '#D1FADF' : '#FEE4E2',
                          color: model.data.predictedClass.toUpperCase() === 'CURA' ? '#039855' : '#D92D20',
                          fontWeight: 600
                        }} 
                      />
                      
                      <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Probabilidades:</Typography>
                      {Object.entries(model.data.probabilities).map(([classe, prob]) => (
                        <Box key={classe} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption">{classe}</Typography>
                            <Typography variant="caption">{(prob * 100).toFixed(1)}%</Typography>
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={prob * 100} 
                            sx={{ height: 6, borderRadius: 3, backgroundColor: '#EAECF0', '& .MuiLinearProgress-bar': { backgroundColor: classe.toUpperCase() === 'CURA' ? '#12B76A' : '#D92D20' } }} 
                          />
                        </Box>
                      ))}

                      {model.data.metrics && (
                        <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed #EAECF0', display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                          <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: 1, p: 1, flex: 1, mr: 0.5 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Accuracy</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#101828' }}>{(model.data.metrics.accuracy * 100).toFixed(1)}%</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: 1, p: 1, flex: 1, mx: 0.5 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Precision</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#101828' }}>{(model.data.metrics.precision * 100).toFixed(1)}%</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: 1, p: 1, flex: 1, ml: 0.5 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>F1 Score</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#101828' }}>{(model.data.metrics.f1Score * 100).toFixed(1)}%</Typography>
                          </Box>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              )
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
