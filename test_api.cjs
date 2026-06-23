const axios = require('axios');

async function testApi() {
  const payload = {
    NU_IDADE_N: 28,
    CS_SEXO: "Feminino",
    SG_UF_NOT: "SP",
    CS_RACA: "Branca",
    CS_ZONA: "Urbana",
    NOSOCOMIAL: "Não",
    FEBRE: "Não",
    TOSSE: "Não",
    GARGANTA: "Não",
    DISPNEIA: "Não",
    DESC_RESP: "Não",
    SATURACAO: "Não",
    DIARREIA: "Não",
    VOMITO: "Não",
    DOR_ABD: "Não",
    FADIGA: "Não",
    PERD_OLFT: "Não",
    PERD_PALA: "Não",
    FATOR_RISC: "Não",
    CARDIOPATI: "Não",
    HEMATOLOGI: "Não",
    SIND_DOWN: "Não",
    HEPATICA: "Não",
    ASMA: "Não",
    DIABETES: "Não",
    NEUROLOGIC: "Não",
    PNEUMOPATI: "Não",
    IMUNODEPRE: "Não",
    RENAL: "Não",
    OBESIDADE: "Não",
    VACINA_GRIPE: "Não",
    INTERNACAO: "Não",
    UTI: "Não",
    DIAS_UTI: 0,
    SUPORT_VEN: "Não",
    VACINA_COV: "Não",
    VACINA_COV_1_DOSE: "Não",
    VACINA_COV_2_DOSE: "Não",
    VACINA_COV_3_DOSE: "Não"
  };

  try {
    const response = await axios.post('http://localhost:8080/api/predict/gestante', payload);
    console.log("Success:", response.data);
  } catch (error) {
    console.error("Error Status:", error.response?.status);
    console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));
  }
}

testApi();
