import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Divider, Paper } from '@mui/material';
import { BrainCircuit, Scale, Activity, Calculator, Gavel, Cpu, Info, BarChart2, Trees, TrendingUp, GitMerge } from 'lucide-react';

export const AboutModels: React.FC = () => {
  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', pb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F52BA', mb: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          <BrainCircuit size={32} />
          Sobre os Modelos Preditivos
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '800px' }}>
          Entenda como a nossa Inteligência Artificial analisa os dados clínicos, como os vereditos são calculados e o significado das métricas de confiabilidade. O objetivo é garantir total transparência no apoio à sua decisão clínica.
        </Typography>
      </Box>

      {/* Seção 1: O Tribunal de Consenso */}
      <Paper sx={{ p: 4, mb: 4, borderRadius: 3, borderTop: '4px solid #0F52BA', backgroundColor: '#F8FAFC', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Box sx={{ p: 1.5, backgroundColor: '#EFF6FF', borderRadius: 2, color: '#0F52BA' }}>
            <Gavel size={28} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E293B' }}>
            O Tribunal de Consenso (Votação Ponderada)
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#475569', mb: 2, lineHeight: 1.7 }}>
          Na medicina, um diagnóstico complexo raramente é feito por um único especialista. Nosso sistema utiliza o conceito de <strong>Ensemble</strong> (Comitê de Especialistas). Cada algoritmo matemático analisa o paciente sob uma perspectiva diferente.
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Scale size={20} color="#0F52BA" />
                  Pesos Diferentes
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Nem todos os votos valem o mesmo. O "peso" do voto de cada algoritmo é baseado no seu histórico de acertos prévio (métrica AUC-ROC). Se o Random Forest tem uma capacidade de distinção de 92% e o SVM de 85%, o voto do Random Forest terá um peso matemático maior no veredito final.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ height: '100%', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Cpu size={20} color="#0F52BA" />
                  Modelos Generativos (LLMs)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  O sistema também inclui análises do Gemini e Groq (Llama). Como eles operam baseados em conhecimento amplo da internet e não apenas no nosso banco de dados fechado, eles entram no painel com um <strong>peso fixo de 0.85</strong>, atuando como um "conselheiro extra".
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, p: 3, backgroundColor: '#fff', border: '1px dashed #CBD5E1', borderRadius: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: '#334155' }}>
            Exemplo Prático de Votação
          </Typography>
          <Typography variant="body2" sx={{ color: '#475569', mb: 2, lineHeight: 1.6 }}>
            Imagine que acabamos de receber os dados de um novo paciente. Os 5 algoritmos matemáticos e os 2 modelos generativos (LLMs) começam a analisar os dados simultaneamente e chegam a um impasse clínico:
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, backgroundColor: '#ECFDF5', borderRadius: 2, border: '1px solid #A7F3D0' }}>
                <Typography variant="subtitle2" sx={{ color: '#059669', mb: 1, fontWeight: 700 }}>Votaram pela CURA:</Typography>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#047857', fontSize: '0.875rem' }}>
                  <li><strong>Random Forest:</strong> Peso 0.92</li>
                  <li><strong>Groq (LLM):</strong> Peso 0.85</li>
                  <li><strong>KNN:</strong> Peso 0.78</li>
                </ul>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: '#065F46' }}>
                  Soma Total: 2.55
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ p: 2, backgroundColor: '#FEF2F2', borderRadius: 2, border: '1px solid #FECACA' }}>
                <Typography variant="subtitle2" sx={{ color: '#DC2626', mb: 1, fontWeight: 700 }}>Votaram por ÓBITO:</Typography>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#B91C1C', fontSize: '0.875rem' }}>
                  <li><strong>Gemini (LLM):</strong> Peso 0.85</li>
                  <li><strong>SVM:</strong> Peso 0.82</li>
                  <li><strong>Regressão Logística:</strong> Peso 0.79</li>
                  <li><strong>Gradient Boosting:</strong> Peso 0.88</li>
                </ul>
                <Typography variant="body2" sx={{ fontWeight: 700, mt: 1, color: '#991B1B' }}>
                  Soma Total: 3.34
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.6 }}>
            <strong>O Veredito Final:</strong> Mesmo tendo opiniões de ambos os lados (o que acontece frequentemente em casos clínicos complexos "borderline"), o lado do <strong>ÓBITO acumulou uma massa de peso maior (3.34 contra 2.55)</strong>. 
            A IA apresentará "Óbito" como resultado primário para você, mas no "Tribunal dos Modelos" do Dashboard (e no histórico) exibiremos o placar de pesos exato para que fique claro que foi uma decisão apertada e dividida!
          </Typography>
        </Box>
      </Paper>

      {/* Seção 2: Os Algoritmos */}
      <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E293B', mb: 3 }}>
        Como pensa cada Algoritmo?
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, '&:hover': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }, transition: 'all 0.3s' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F52BA', mb: 1 }}>
                K-Nearest Neighbors (KNN)
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 2 }}>
                "O Historiador de Casos Semelhantes"
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                <strong>Como funciona:</strong> O KNN procura no histórico do banco de dados os pacientes que têm características físicas e clínicas mais idênticas às do paciente atual.<br/><br/>
                <strong>Visão Clínica:</strong> É como o médico que se lembra: <em>"Os últimos 5 pacientes que atendi com essa exata idade e esses sintomas se recuperaram bem, então a probabilidade de cura deste também é alta."</em> Por olhar apenas a vizinhança local, o KNN costuma ter probabilidades extremas (ex: 100% ou 0%).
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, '&:hover': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }, transition: 'all 0.3s' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F52BA', mb: 1 }}>
                Support Vector Machine (SVM)
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 2 }}>
                "O Estrategista de Fronteiras"
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                <strong>Como funciona:</strong> O SVM tenta traçar uma linha matemática global separando de um lado quem evoluiu para óbito e do outro quem se curou, maximizando a margem de segurança entre os dois grupos.<br/><br/>
                <strong>Visão Clínica:</strong> Ele foca no "limiar de risco". Ele olha para a soma dos fatores (idade, comorbidades, sintomas) e calcula de que lado da "linha vermelha" de risco extremo o paciente caiu. É focado na tendência matemática geral, ignorando casos isolados excepcionais.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, '&:hover': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }, transition: 'all 0.3s' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F52BA', mb: 1 }}>
                Regressão Logística
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 2 }}>
                "O Calculista de Riscos Ponderados"
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                <strong>Como funciona:</strong> Semelhante ao SVM, é um modelo linear. Ele atribui um peso fixo (positivo ou negativo) para cada fator de risco e calcula a probabilidade final baseada na soma desses pesos.<br/><br/>
                <strong>Visão Clínica:</strong> Lembra sistemas tradicionais de escore (como o APACHE). Exemplo: Ter mais de 60 anos adiciona +5 pontos de risco, ter asma adiciona +3. Se a soma passar de um limite, ele classifica como alto risco (óbito).
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, '&:hover': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }, transition: 'all 0.3s' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <Trees color="#0F52BA" size={24} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F52BA' }}>
                  Random Forest
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 2 }}>
                "O Conselho de Vários Especialistas"
              </Typography>
              
              {/* Esquema Visual */}
              <Box sx={{ backgroundColor: '#F8FAFC', p: 1.5, borderRadius: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', border: '1px dashed #CBD5E1' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Trees size={20} color="#64748B" />
                  <Typography variant="caption" display="block" color="text.secondary">Árvore 1</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>+</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Trees size={20} color="#64748B" />
                  <Typography variant="caption" display="block" color="text.secondary">Árvore 2</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>=</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Gavel size={20} color="#0F52BA" />
                  <Typography variant="caption" display="block" sx={{ color: '#0F52BA', fontWeight: 600 }}>Votação</Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                <strong>Como funciona:</strong> O algoritmo cria dezenas de "Árvores de Decisão" independentes. Cada árvore analisa um subconjunto diferente dos dados do paciente e dá seu veredito. A decisão final é tomada por votação da maioria.<br/><br/>
                <strong>Visão Clínica:</strong> Imagine pedir a opinião de 100 médicos diferentes, cada um analisando os exames sob óticas distintas. A média de todos eles reduz o viés individual e aumenta drasticamente a segurança do diagnóstico.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%', borderRadius: 2, '&:hover': { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }, transition: 'all 0.3s' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <TrendingUp color="#0F52BA" size={24} />
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F52BA' }}>
                  Gradient Boosting
                </Typography>
              </Box>
              <Typography variant="subtitle2" sx={{ color: '#64748B', mb: 2 }}>
                "O Especialista que Aprende com os Erros"
              </Typography>

              {/* Esquema Visual */}
              <Box sx={{ backgroundColor: '#F8FAFC', p: 1.5, borderRadius: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'center', justifyContent: 'center', border: '1px dashed #CBD5E1' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <GitMerge size={20} color="#64748B" />
                  <Typography variant="caption" display="block" color="text.secondary">Passo 1</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>→</Typography>
                <Box sx={{ textAlign: 'center', position: 'relative' }}>
                  <Typography variant="caption" sx={{ position: 'absolute', top: -18, left: -10, color: '#EF4444', fontSize: '0.65rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Corrige erro
                  </Typography>
                  <GitMerge size={20} color="#64748B" />
                  <Typography variant="caption" display="block" color="text.secondary">Passo 2</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>→</Typography>
                <Box sx={{ textAlign: 'center' }}>
                  <Activity size={20} color="#10B981" />
                  <Typography variant="caption" display="block" sx={{ color: '#10B981', fontWeight: 600 }}>Precisão</Typography>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                <strong>Como funciona:</strong> Também utiliza Árvores de Decisão, mas construídas em sequência. A primeira árvore tenta prever o resultado. A segunda foca exclusivamente em corrigir os erros da primeira, e assim sucessivamente, refinando o modelo.<br/><br/>
                <strong>Visão Clínica:</strong> É como um médico residente sendo corrigido passo a passo por um chefe de equipe até chegar à resposta perfeita. É excepcional para capturar padrões sutis e não lineares nos dados clínicos que outros modelos deixariam passar.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Seção 3: Métricas */}
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Activity size={24} color="#1E293B" />
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1E293B' }}>
          Métricas de Avaliação
        </Typography>
      </Box>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Calculator size={18} color="#0F52BA" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Acurácia</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                A proporção geral de previsões corretas. De todos os pacientes analisados, qual porcentagem o modelo acertou o desfecho final.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Info size={18} color="#0F52BA" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Precisão</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                De todas as vezes que o modelo alertou que o paciente evoluiria para <strong>Óbito</strong> (Alto Risco), quantos realmente evoluíram? Ajuda a evitar "falsos alarmes".
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <BarChart2 size={18} color="#0F52BA" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>F1-Score</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                A média harmônica entre a Precisão e a Sensibilidade (Recall). É a melhor métrica para avaliar o modelo quando os dados são desbalanceados (ex: temos mais casos de cura do que óbito no histórico).
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ height: '100%', backgroundColor: '#F8FAFC', border: '1px solid #0EA5E9', boxShadow: 'none' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Scale size={18} color="#0EA5E9" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#0284C7' }}>AUC-ROC</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Capacidade do modelo de distinguir entre as classes (Cura x Óbito). Quanto mais próximo de 100%, melhor o algoritmo sabe separar os grupos. <strong>Usada como peso na votação do Tribunal.</strong>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
