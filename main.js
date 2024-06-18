const person = JSON.parse(import.meta.env.VITE_PERSON);
console.log("person")
console.log(person)

let insuranceData = JSON.parse(import.meta.env.VITE_INSURANCEDATA);

let ROIData = JSON.parse(import.meta.env.VITE_ROIDATA);



let loanInpEle = document.getElementById("appLoanAmount");
let healthAmount = document.getElementById("healthAmount");
let lifeAmount = document.getElementById("lifeAmount");
let proFee = document.getElementById("processingFee");
let grossAmount = document.getElementById("totalGrossAmount");
let totalLoanAmount = document.getElementById("totalLoanAmount");
let emi = document.getElementById("emiAmount");
let totalRepaymentAmount = document.getElementById("totalRepaymentAmount");
let totalInterestAmount = document.getElementById("totalInterestAmount");
let fpr = document.getElementById("FPR");

function changeToIndian(num) {
  let [intPart, decPart] = num.toString().split(".");

  if (num == 0) {
    return 0;
  }

  let last3 = intPart.slice(-3);
  let other = intPart.slice(0, -3);

  const formattedNumber =
    other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;

  return decPart ? formattedNumber + "." + decPart : formattedNumber;
}

function userRange(loanAmount) {
  let ligiRange = insuranceData.find(
    (range) => loanAmount >= range.min && loanAmount <= range.max
  );

  return ligiRange;
}

function CheckLifeAmount() {
  const lifeRadio = document.querySelector(
    'input[name="life-insurance"]:checked'
  );

  if (lifeRadio.value === "false") {
    lifeAmount.value = 0;
    return;
  }

  let loanAmount = parseInt(loanInpEle.value);

  let ligiRange = userRange(loanAmount);

  lifeAmount.value = ligiRange.li;
}

function CheckHealthAmount() {
  const healthRadio = document.querySelector(
    'input[name="health-insurance"]:checked'
  );

  if (healthRadio.value === "false") {
    healthAmount.value = 0;
    return;
  }

  let loanAmount = +loanInpEle.value;

  let ligiRange = userRange(loanAmount);

  healthAmount.value = ligiRange.gi;
}

function CalculateTotalLoan() {
  let la = parseInt(document.getElementById("appLoanAmount").value);
  let li = parseInt(document.getElementById("lifeAmount").value);
  let gi = parseInt(document.getElementById("healthAmount").value);


  let finPulseReport;

  if (fpr.checked) {
    finPulseReport = 499;
  } else {
    finPulseReport = 0;
  }

  let proFeeVal = ((la + li + gi + finPulseReport) * 0.0393) / (1 - 0.0393);
  let grossAmountVal = proFeeVal + li + gi + finPulseReport;

  proFee.value = proFeeVal.toFixed(3);

  grossAmount.value = grossAmountVal.toFixed(3);

  totalLoanAmount.value = (grossAmountVal + la).toFixed(3);
}

function onchangeRange(ele) {
  let irrVal = document.getElementById("irrVal");
  irrVal.value = ele.value;
}

function handleInputs() {
  let errEle = document.getElementById("error");
  if (loanInpEle.value == "") {
    errEle.textContent = "* Required";
    errEle.style.display = "inline";
    return false;
  }

  if (loanInpEle.value < 20000) {
    errEle.textContent = "* Enter Valid Number";
    errEle.style.display = "inline";

    return false;
  }
  return true;
}

function checkEmi() {
  if (!handleInputs()) {
    return;
  }

  CheckLifeAmount();
  CheckHealthAmount();

  CalculateTotalLoan();

  let irr = parseInt(document.getElementById("irrVal").value);

  let t = parseInt(document.getElementById("tenure").value);

  let roiTenObj = ROIData.find((ele) => ele.IRR === irr).Tenure;

  let roipa = roiTenObj[t];

  let roipm = roipa / 12;

  document.getElementById("ROIpa").value = roipa;
  document.getElementById("ROIpm").value = roipm;

  let T = parseFloat(document.getElementById("totalLoanAmount").value);

  let emiVal = T / t + (T * roipa) / 1200;

  // error correction
  emiVal = emiVal * (1 + 0.00837 / 100);

  let tramountVal = t * emiVal;
  // let tramountVal = t * Math.ceil(emiVal)

  let tiamountVal = tramountVal - T;

  lifeAmount.value = changeToIndian(lifeAmount.value);
  healthAmount.value = changeToIndian(healthAmount.value);
  proFee.value = changeToIndian(proFee.value);
  grossAmount.value = changeToIndian(grossAmount.value);
  totalLoanAmount.value = changeToIndian(totalLoanAmount.value);
  emi.value = changeToIndian(emiVal.toFixed(2));
  totalRepaymentAmount.value = changeToIndian(tramountVal.toFixed(2));
  totalInterestAmount.value = changeToIndian(tiamountVal.toFixed(2));
}

function changeErrFunc() {
  document.getElementById("error").style.display = "none";
}

window.changeErrFunc = changeErrFunc;

window.checkEmi = checkEmi;
window.onchangeRange = onchangeRange;
