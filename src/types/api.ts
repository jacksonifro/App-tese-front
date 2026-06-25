export interface BasePredictionRequest {
  SG_UF_NOT: string;
  CS_SEXO: string;
  NU_IDADE_N: number;
  CS_RACA: string;
  CS_ZONA: string;
  NOSOCOMIAL: string;
  FEBRE: string;
  TOSSE: string;
  GARGANTA: string;
  DISPNEIA: string;
  DESC_RESP: string;
  SATURACAO: string;
  DIARREIA: string;
  VOMITO: string;
  DOR_ABD: string;
  FADIGA: string;
  PERD_OLFT: string;
  PERD_PALA: string;
  FATOR_RISC: string;
  CARDIOPATI: string;
  HEMATOLOGI: string;
  SIND_DOWN: string;
  HEPATICA: string;
  ASMA: string;
  DIABETES: string;
  NEUROLOGIC: string;
  PNEUMOPATI: string;
  IMUNODEPRE: string;
  RENAL: string;
  OBESIDADE: string;
  VACINA_GRIPE: string;
  INTERNACAO: string;
  UTI: string;
  DIAS_UTI: number;
  SUPORT_VEN: string;
  VACINA_COV: string;
  VACINA_COV_1_DOSE: string;
  VACINA_COV_2_DOSE: string;
  VACINA_COV_3_DOSE: string;
}

export interface GestanteRequest extends BasePredictionRequest {}
export interface CriancaRequest extends BasePredictionRequest {}
export interface PuerperaRequest extends BasePredictionRequest {}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  sensitivity: number;
  specificity: number;
  f1Score: number;
  aucRoc: number;
}

export interface ModelPredictionResult {
  predictedClass: string;
  probabilities: Record<string, number>;
  metrics: ModelMetrics;
}

export interface VoteRecord {
  judge: string;
  vote: string;
  weight: number;
}

export interface VerdictBoard {
  votes: VoteRecord[];
  scorePanel: Record<string, number>;
  finalVerdict: string;
}

export interface PredictionResponse {
  randomForest: ModelPredictionResult;
  knn: ModelPredictionResult;
  logisticRegression: ModelPredictionResult;
  svm: ModelPredictionResult;
  gradientBoosting: ModelPredictionResult;
  llmAnalysis: string;
  groqAnalysis: string;
  verdictBoard: VerdictBoard;
  processingTimeMs: number;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
  validationErrors?: Record<string, string>;
}

export interface EnderecoDTO {
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  zona?: string;
}

export interface ContatoDTO {
  telefone?: string;
  celular?: string;
  email?: string;
  contatoEmergencia?: string;
  telefoneEmergencia?: string;
}

export interface ComorbidadeDTO {
  fatorRisco: string;
  diabetes?: string;
  cardiopatia?: string;
  asma?: string;
  obesidade?: string;
  renal?: string;
  hepatica?: string;
  pneumopatia?: string;
  hematologica?: string;
  neurologica?: string;
  imunodepressao?: string;
  sindromeDown?: string;
}

export interface VacinacaoDTO {
  vacinaCovid: string;
  primeiraDose?: string;
  segundaDose?: string;
  terceiraDose?: string;
  vacinaInfluenza: string;
}

export interface PacienteDTO {
  id?: number;
  nome: string;
  cpf: string;
  cns?: string;
  dataNascimento: string;
  sexo: string;
  gestante: string;
  puerpera: string;
  raca?: string;
  estadoCivil?: string;
  escolaridade?: string;
  profissao?: string;
  endereco?: EnderecoDTO;
  contato?: ContatoDTO;
  vacinacao?: VacinacaoDTO;
  comorbidade?: ComorbidadeDTO;
}

export interface EpisodioDTO {
  febre?: string;
  tosse?: string;
  dispneia?: string;
  fadiga?: string;
  dorAbdominal?: string;
  dorGarganta?: string;
  saturacao?: string;
  desconfortoRespiratorio?: string;
  diarreia?: string;
  vomito?: string;
  perdaOlfato?: string;
  perdaPaladar?: string;
  nosocomial?: string;
  internacao?: string;
  uti?: string;
  diasUTI?: number;
  suporteVentilatorio?: string;
}

export interface NovaPredicaoRequest {
  pacienteId: number;
  episodio: EpisodioDTO;
}

export interface Predicao {
  id: number;
  dataHora: string;
  payloadEnviado: string;
  respostaCompleta: string;
  resultado: string;
  tempoProcessamentoMs: number;
  atendimento: any;
}
