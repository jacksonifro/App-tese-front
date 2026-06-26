import React from 'react';
import { Box, Card, CardContent, Typography, Grid, LinearProgress, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import type { PredictionResponse } from '../types/api';
import ReactMarkdown from 'react-markdown';
import { Brain, Clock, ActivitySquare } from 'lucide-react';

interface DashboardProps {
  response: PredictionResponse;
}

const getAucForJudge = (judgeName: string, response: PredictionResponse): string => {
  const nameLower = judgeName.toLowerCase();
  let auc: number | undefined = undefined;
  
  if (nameLower.includes('random')) auc = response.randomForest?.metrics?.aucRoc;
  else if (nameLower.includes('knn')) auc = response.knn?.metrics?.aucRoc;
  else if (nameLower.includes('logistic') || nameLower.includes('regressão') || nameLower.includes('regression')) auc = response.logisticRegression?.metrics?.aucRoc;
  else if (nameLower.includes('svm') || nameLower.includes('support')) auc = response.svm?.metrics?.aucRoc;
  else if (nameLower.includes('gradient')) auc = response.gradientBoosting?.metrics?.aucRoc;
  else if (nameLower.includes('gemini') || nameLower.includes('groq') || nameLower.includes('llama') || nameLower.includes('llm')) {
    return 'N/A (Fixo)';
  }
  
  return auc ? `${(auc * 100).toFixed(1)}%` : '-';
};

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

              <Box sx={{ mt: 4 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: 'text.secondary' }}>Detalhamento dos Votos</Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ boxShadow: 'none' }}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: '#F9FAFB' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Juiz (Algoritmo)</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Voto</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 600 }}>Métrica Base (AUC)</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>Peso Numérico</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {response.verdictBoard.votes.map((vote, idx) => (
                        <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{vote.judge}</TableCell>
                          <TableCell>
                            <Chip 
                              label={vote.vote} 
                              size="small" 
                              sx={{ 
                                backgroundColor: vote.vote.toUpperCase() === 'CURA' ? '#D1FADF' : '#FEE4E2',
                                color: vote.vote.toUpperCase() === 'CURA' ? '#039855' : '#D92D20',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 20
                              }} 
                            />
                          </TableCell>
                          <TableCell align="center" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                            {getAucForJudge(vote.judge, response)}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 600 }}>{vote.weight.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
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
                        <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px dashed #EAECF0', display: 'flex', justifyContent: 'space-between', textAlign: 'center', gap: 0.5 }}>
                          <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: 1, p: 1, flex: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Accuracy</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#101828' }}>{(model.data.metrics.accuracy * 100).toFixed(1)}%</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: 1, p: 1, flex: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>Precision</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#101828' }}>{(model.data.metrics.precision * 100).toFixed(1)}%</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: '#F9FAFB', borderRadius: 1, p: 1, flex: 1 }}>
                            <Typography variant="caption" color="textSecondary" sx={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>F1 Score</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#101828' }}>{(model.data.metrics.f1Score * 100).toFixed(1)}%</Typography>
                          </Box>
                          <Box sx={{ backgroundColor: '#F0F9FF', borderRadius: 1, p: 1, flex: 1, border: '1px solid #B9E6FE' }}>
                            <Typography variant="caption" sx={{ color: '#026AA2', display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700 }}>AUC</Typography>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: '#026AA2' }}>{(model.data.metrics.aucRoc * 100).toFixed(1)}%</Typography>
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
