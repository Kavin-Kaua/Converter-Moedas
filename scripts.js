const convertButton = document.querySelector(".convert-button");
const currencySelect = document.querySelector(".currency-select"); // Destino
const fromCurrencySelect = document.querySelector(".from-currency"); // Origem

let taxas = {};
let taxasCarregadas = false;

const BASE = "BRL";
const API_URL = `https://api.exchangerate-api.com/v4/latest/${BASE}`;


async function atualizaTaxas() {
  try {
    const resposta = await fetch(API_URL);
    const dados = await resposta.json();

    if (!dados || !dados.rates) {
      throw new Error("A resposta da API não contém 'rates'");
    }

    taxas = dados.rates;
    taxas["BRL"] = 1;

    taxasCarregadas = true;

    console.log("✅ Taxas atualizadas:", taxas);
  } catch (error) {
    taxas = {};
    taxasCarregadas = false;

    console.error("❌ Erro ao obter as taxas:", error);
    alert("Não foi possível obter as taxas atualizadas.");
  }
}

async function convertValues() {
  const inputCurrencyValue = parseFloat(document.querySelector(".input-currency").value);

  if (isNaN(inputCurrencyValue)) {
    alert("Por favor, insira um valor numérico.");
    return;
  }

  if (!taxasCarregadas) {
    await atualizaTaxas();
    if (!taxasCarregadas) {
      alert("Não foi possível carregar as taxas para realizar a conversão.");
      return;
    }
  }

  const fromCurrency = fromCurrencySelect.value;
  const toCurrency = currencySelect.value;

  if (!taxas[fromCurrency] || !taxas[toCurrency]) {
    alert("Moeda não suportada ou taxas não carregadas corretamente.");
    return;
  }

  const valorConvertido = inputCurrencyValue * (taxas[toCurrency] / taxas[fromCurrency]);

  const currencyValueToConvert = document.querySelector(".currency-value-to-convert");
  const currencyValueConverted = document.querySelector(".currency-value");

  currencyValueConverted.innerHTML = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: toCurrency,
  }).format(valorConvertido);

  currencyValueToConvert.innerHTML = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: fromCurrency,
  }).format(inputCurrencyValue);
}

function changeCurrency() {
  const currencyName = document.getElementById("currency-name"); // DESTINO
  const currencyImage = document.querySelector(".currency-img"); // DESTINO
  const currencyOriginName = document.getElementById("currency-origin-name"); // ORIGEM
  const currencyOriginImage = document.querySelector(".currency-origin-img"); // ORIGEM

  // DESTINO
  switch (currencySelect.value) {
    case "USD":
      currencyName.innerHTML = "Dólar Americano";
      currencyImage.src = "./assets/Dolar.png";
      break;
    case "EUR":
      currencyName.innerHTML = "Euro";
      currencyImage.src = "./assets/Euro.png";
      break;
    case "GBP":
      currencyName.innerHTML = "Libra Esterlina";
      currencyImage.src = "./assets/Libra.png";
      break;
    case "BTC":
      currencyName.innerHTML = "Bitcoin";
      currencyImage.src = "./assets/Bitcoin.png";
      break;
    case "BRL":
      currencyName.innerHTML = "Real Brasileiro";
      currencyImage.src = "./assets/Real.png";
      break;
  }

  // ORIGEM
  switch (fromCurrencySelect.value) {
    case "USD":
      currencyOriginName.innerHTML = "Dólar Americano";
      currencyOriginImage.src = "./assets/Dolar.png";
      break;
    case "EUR":
      currencyOriginName.innerHTML = "Euro";
      currencyOriginImage.src = "./assets/Euro.png";
      break;
    case "GBP":
      currencyOriginName.innerHTML = "Libra Esterlina";
      currencyOriginImage.src = "./assets/Libra.png";
      break;
    case "BTC":
      currencyOriginName.innerHTML = "Bitcoin";
      currencyOriginImage.src = "./assets/Bitcoin.png";
      break;
    case "BRL":
      currencyOriginName.innerHTML = "Real Brasileiro";
      currencyOriginImage.src = "./assets/Real.png";
      break;
  }

  convertValues();
}

// ✅ Carrega as taxas assim que a página abrir
window.addEventListener("load", async () => {
  await atualizaTaxas();
  changeCurrency();
});

// ✅ Atualiza as taxas automaticamente a cada hora
setInterval(atualizaTaxas, 3600000);

// ✅ Eventos
currencySelect.addEventListener("change", changeCurrency);
fromCurrencySelect.addEventListener("change", changeCurrency);
convertButton.addEventListener("click", convertValues);
