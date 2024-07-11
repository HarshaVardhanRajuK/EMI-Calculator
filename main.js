import { inject } from "@vercel/analytics"

// request elements
const loanInpEle = document.getElementById("appLoanAmount");
const lifeRadio = document.querySelector(
  'input[name="life-insurance"]:checked'
);
const healthRadio = document.querySelector(
  'input[name="health-insurance"]:checked'
);
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

const url = import.meta.env.VITE_URL;

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

  if (loanInpEle.value < 20000 || loanInpEle.value > 1150000) {
    errEle.textContent = "* Enter Valid Number";
    errEle.style.display = "inline";

    return false;
  }
  return true;
}

function indianFormat(num, dec=3) {
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


async function fetchFunc() {
  try {

    const inputData = {
      approvedLoanAmount: parseInt(loanInpEle.value),
      lifeRadio: lifeRadio.checked,
      healthRadio: healthRadio.checked,
      fpr: fpr.checked,
      irr: parseInt(irrEle.value),
      tenure: parseInt(tenureEle.value)
    };

    const cacheKey = JSON.stringify(inputData)
    const cacheVersion = 'v1';

    let cachedData = localStorage.getItem(cacheKey);

    let data;

    if (cachedData) {
      cachedData = JSON.parse(cachedData)
      
      if (cachedData.v === cacheVersion) {
        data = cachedData.data;
      }else {
        localStorage.removeItem(cacheKey)
      }
    }
    
    if (!data) {
      
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: cacheKey,
      };

      const response = await fetch(url, options);

      data = await response.json();

      localStorage.setItem( cacheKey, JSON.stringify({data, v: "v1"}) )
    }

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

function changeErrFunc() {
  document.getElementById("error").style.display = "none";
}

const debouncedClick = (e) => {

  if (e.disabled) {
    return;
  }

  if (!handleInputs()) {
    return;
  }

  e.disabled = true;

  setTimeout(() => {
    e.disabled = false;
  }, 800);

  fetchFunc();
};

loanInpEle.addEventListener("keyup", (e)=>{
  if(e.key === "Enter"){

    debouncedClick(e)}

})
window.debouncedClick = debouncedClick;
window.onchangeRange = onchangeRange;

window.checkEmi = checkEmi;

window.handleInputs = handleInputs;
window.changeErrFunc = changeErrFunc;

inject({debug: false})