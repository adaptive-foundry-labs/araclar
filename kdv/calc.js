// KDV Dahil/Haric Fiyat Hesaplama Araci
// Iki yonlu donusum: dahilden harice ve haricten dahile
// Kurus yuvarlama: 2 ondalik

const rates = {
  0.01: '%1',
  0.10: '%10',
  0.20: '%20'
};

function calculate() {
  const amount = parseFloat(document.getElementById('amount').value);
  const kdvRate = parseFloat(document.querySelector('input[name="kdv-rate"]:checked').value);
  const direction = document.querySelector('input[name="direction"]:checked').value;
  const errorDiv = document.getElementById('error');
  const resultDiv = document.getElementById('result');
  
  // Hata kontrol
  if (isNaN(amount) || amount === '') {
    errorDiv.textContent = 'Lutfen gecerli bir tutar giriniz.';
    errorDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    return;
  }
  
  if (amount < 0) {
    errorDiv.textContent = 'Tutar negatif olamaz.';
    errorDiv.style.display = 'block';
    resultDiv.style.display = 'none';
    return;
  }
  
  errorDiv.style.display = 'none';
  
  let inclusivePrice, exclusivePrice, kdvAmount;
  
  if (direction === 'inclusive') {
    // KDV Dahil -> KDV Haric
    inclusivePrice = round(amount);
    exclusivePrice = round(inclusivePrice / (1 + kdvRate));
    kdvAmount = round(inclusivePrice - exclusivePrice);
  } else {
    // KDV Haric -> KDV Dahil
    exclusivePrice = round(amount);
    kdvAmount = round(exclusivePrice * kdvRate);
    inclusivePrice = round(exclusivePrice + kdvAmount);
  }
  
  displayResult(inclusivePrice, exclusivePrice, kdvAmount, kdvRate);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function displayResult(inclusive, exclusive, kdv, rate) {
  const resultDiv = document.getElementById('result');
  const ratePercent = (rate * 100).toFixed(0);
  
  document.getElementById('result-inclusive').textContent = inclusive.toFixed(2) + ' ₺';
  document.getElementById('result-exclusive').textContent = exclusive.toFixed(2) + ' ₺';
  document.getElementById('result-kdv-amount').textContent = kdv.toFixed(2) + ' ₺';
  document.getElementById('result-rate').textContent = '%' + ratePercent;
  
  resultDiv.style.display = 'block';
}

function clearForm() {
  document.getElementById('amount').value = '';
  document.getElementById('result').style.display = 'none';
  document.getElementById('error').style.display = 'none';
  document.getElementById('amount').focus();
}
