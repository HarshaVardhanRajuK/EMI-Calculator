import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from '@vercel/speed-insights';

// request elements
const loanInpEle = document.getElementById("appLoanAmount");
const fpr = document.getElementById("FPR");
const irrEle = document.getElementById("irrVal");
const tenureEle = document.getElementById("tenure");

// display elements
const lifeAmountEle = document.getElementById("lifeAmount");
const healthAmountEle = document.getElementById("healthAmount");
const proFee = document.getElementById("processingFee");
const grossAmount = document.getElementById("totalGrossAmount");
const totalLoanAmountEle = document.getElementById("totalLoanAmount");
const emiEle = document.getElementById("emiAmount");
const ROIpaEle = document.getElementById("ROIpa");
const ROIpmEle = document.getElementById("ROIpm");
const totalInterestAmountEle = document.getElementById("totalInterestAmount");
const totalRepaymentAmountEle = document.getElementById("totalRepaymentAmount");
const broken = document.getElementById("broken");
const spinner = document.querySelector(".span");
const buttonText = document.querySelector(".button-text");

const insuranceData = JSON.parse(import.meta.env.VITE_INSURANCEDATA);
const ROIData = JSON.parse(import.meta.env.VITE_ROIDATA);

// ----------------------------------------------------- //

function emptyInputs() {
  lifeAmountEle.value = "";
  healthAmountEle.value = "";
  proFee.value = "";
  grossAmount.value = "";
  totalLoanAmountEle.value = "";
  emiEle.value = "";
  ROIpaEle.value = "";
  ROIpmEle.value = "";
  totalRepaymentAmountEle.value = "";
  totalInterestAmountEle.value = "";
  broken.value = "";
}

// ----------------------------------------------------- //

function handleInputs() {
  let errEle = document.getElementById("error");
  if (loanInpEle.value == "") {
    errEle.textContent = "* Required";
    errEle.style.display = "inline";
    emptyInputs();
    return false;
  }

  if (loanInpEle.value < 20000) {
    errEle.textContent = "* Enter Valid Number";
    errEle.style.display = "inline";
    emptyInputs();
    return false;
  }

  if (loanInpEle.value > 1150000) {
    errEle.textContent = "* Range Exceeded";
    errEle.style.display = "inline";
    emptyInputs();
    return false;
  }
  errEle.style.display = "none";
  return true;
}

// ----------------------------------------------------- //

loanInpEle.addEventListener("input", () => {
  if (handleInputs()) {
    fetchFunc();
  }
});

loanInpEle.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    fetchFunc();
  }
});

// ----------------------------------------------------- //

function updateHealthRadio() {
  const healthYes = document.getElementById("health-yes");
  healthRadio = healthYes.checked;

  if (handleInputs()) {
    fetchFunc();
  }
}

let healthRadio = true;

document
  .getElementById("health-yes")
  .addEventListener("change", updateHealthRadio);
document
  .getElementById("health-no")
  .addEventListener("change", updateHealthRadio);

// ----------------------------------------------------- //

function updateLifeRadio() {
  const lifeYes = document.getElementById("life-yes");
  lifeRadio = lifeYes.checked;

  if (handleInputs()) {
    fetchFunc();
  }
}

let lifeRadio = true;

document.getElementById("life-yes").addEventListener("change", updateLifeRadio);
document.getElementById("life-no").addEventListener("change", updateLifeRadio);

// ----------------------------------------------------- //

fpr.addEventListener('click', (e) => {
  if(handleInputs()) {
    fetchFunc()
  }
})

// ----------------------------------------------------- //

function onchangeRange(ele) {
  let irrVal = document.getElementById("irrVal");
  irrVal.value = ele.value;

  if (handleInputs()) {
    fetchFunc();
  } else {
  }
}

// ----------------------------------------------------- //

function onchangeSelect(e) {
  if (handleInputs()) {
    fetchFunc();
  }
}

// ----------------------------------------------------- //

function indianFormat(num, dec = 3) {
  let formattedNum = parseFloat(num).toFixed(dec);

  let parts = formattedNum.split(".");
  let integerPart = parts[0];
  let decimalPart = parseInt(parts[1]) ? parts[1] : "";

  let lastThree = integerPart.slice(-3);
  let otherNumbers = integerPart.slice(0, -3);

  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }
  let indianFormattedNumber =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;

  return decimalPart
    ? indianFormattedNumber + "." + decimalPart
    : indianFormattedNumber;
}

// ----------------------------------------------------- //

function userRange(loanAmount) {
  let ligiRange = insuranceData.find(
    (range) => loanAmount >= range.min && loanAmount <= range.max
  );

  return ligiRange;
}

function CheckLifeAndHealthAmount(lifeRadio, healthRadio, loanAmount) {
  let result = {
    lifeAmount: 0,
    healthAmount: 0,
  };

  let ligiRange = userRange(loanAmount);

  if (!lifeRadio) {
    result.lifeAmount = 0;
  } else {
    result.lifeAmount = ligiRange.li;
  }

  if (!healthRadio) {
    result.healthAmount = 0;
  } else {
    result.healthAmount = ligiRange.gi;
  }

  return result;
}

// ----------------------------------------------------- //

function getBrokenCharges(tla) {
  let brokenChargesValue = null;

  let now = new Date(2024, 8, 1);

  let currentDay = now.getDate();
  let currentMonth = now.getMonth() + 1;
  let currentYear = now.getFullYear();
  
  if (currentDay > 15 || currentDay < 2) {
    let nextMonth;

    if (currentDay > 15) {
      nextMonth = new Date(currentYear, currentMonth, 2);
    } else if (currentDay < 2) {
      nextMonth = new Date(currentYear, currentMonth - 1, 2);
    }
    
    let diff = nextMonth - now;
    
    let days, total_hours, total_minutes, total_seconds;
    
    total_seconds = parseInt(Math.floor(diff / 1000));
    total_minutes = parseInt(Math.floor(total_seconds / 60));
    total_hours = parseInt(Math.floor(total_minutes / 60));
    days = parseInt(Math.round(total_hours / 24));

    console.log(days)

    if (days === 0) {
      days++;
    }

    brokenChargesValue = (irr.value / (365 * 100)) * tla * days;
  } else {
    brokenChargesValue = 0;
  }

  return brokenChargesValue;
}

// ----------------------------------------------------- //

function calculate(inputData) {

  let { approvedLoanAmount, lifeRadio, healthRadio, fpr, irr, tenure } =
    inputData;

  let { lifeAmount, healthAmount } = CheckLifeAndHealthAmount(
    lifeRadio,
    healthRadio,
    approvedLoanAmount
  );

  let finPulseReport = 0;

  if (fpr) {
    finPulseReport = 499;
  }

  let processingFee =
    ((approvedLoanAmount + lifeAmount + healthAmount + finPulseReport) *
      0.0393) /
    (1 - 0.0393);

  let totalGrossAmount =
    processingFee + lifeAmount + healthAmount + finPulseReport;

  let totalLoanAmount = totalGrossAmount + approvedLoanAmount;

  let roiTenObj = ROIData.find((ele) => ele.IRR === irr).Tenure;

  let ROIpa = roiTenObj[tenure];

  let ROIpm = ROIpa / 12;

  let emi = totalLoanAmount / tenure + (totalLoanAmount * ROIpa) / 1200;

  // error correction
  emi = emi * (1 + 0.00837 / 100);

  let totalRepaymentAmount = tenure * emi;

  let totalInterestAmount = totalRepaymentAmount - totalLoanAmount;

  const brokenCharges = getBrokenCharges(totalLoanAmount);

  return {
    lifeAmount: lifeAmount,
    healthAmount: healthAmount,
    processingFee: processingFee.toFixed(3),
    totalGrossAmount: totalGrossAmount.toFixed(3),
    totalLoanAmount: totalLoanAmount.toFixed(3),
    emi: emi.toFixed(3),
    ROIpa: ROIpa.toFixed(3),
    ROIpm: ROIpm.toFixed(3),
    totalInterestAmount: totalInterestAmount.toFixed(3),
    totalRepaymentAmount: totalRepaymentAmount.toFixed(3),
    brokenCharges,
  };
}

// ----------------------------------------------------- //

function fetchFunc() {
  if (!handleInputs()) {
    return;
  }
  try {
    buttonText.classList.add("hidden");
    spinner.classList.remove("hidden");
    const inputData = {
      approvedLoanAmount: parseInt(loanInpEle.value),
      lifeRadio,
      healthRadio,
      fpr: fpr.checked,
      irr: parseInt(irrEle.value),
      tenure: parseInt(tenureEle.value),
    };

    const data = calculate(inputData);

    buttonText.classList.remove("hidden");
    spinner.classList.add("hidden");

    const {
      lifeAmount,
      healthAmount,
      processingFee,
      totalGrossAmount,
      totalLoanAmount,
      emi,
      totalRepaymentAmount,
      totalInterestAmount,
      ROIpa,
      ROIpm,
      brokenCharges,
    } = data;

    lifeAmountEle.value = indianFormat(lifeAmount);
    healthAmountEle.value = indianFormat(healthAmount);
    proFee.value = indianFormat(processingFee);
    grossAmount.value = indianFormat(totalGrossAmount);
    totalLoanAmountEle.value = indianFormat(totalLoanAmount);
    emiEle.value = indianFormat(emi);
    ROIpaEle.value = indianFormat(ROIpa, 2);
    ROIpmEle.value = indianFormat(ROIpm, 2);
    totalRepaymentAmountEle.value = indianFormat(totalRepaymentAmount);
    totalInterestAmountEle.value = indianFormat(totalInterestAmount);
    broken.value = indianFormat(brokenCharges);
  } catch (err) {
    console.log(err);
  }
}

// ----------------------------------------------------- //

function changeErrFunc() {
  document.getElementById("error").style.display = "none";
}

window.fetchFunc = fetchFunc;
window.onchangeRange = onchangeRange;
window.onchangeSelect = onchangeSelect;

window.checkEmi = checkEmi;

window.handleInputs = handleInputs;
window.changeErrFunc = changeErrFunc;

inject({ debug: false });
injectSpeedInsights();
