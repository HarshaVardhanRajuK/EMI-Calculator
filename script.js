const insuranceData = [
    { min: 20000, max: 40000, li: 1799, gi: 1013, total: 2812 },
    { min: 40001, max: 50000, li: 2299, gi: 1013, total: 3312 },
    { min: 50001, max: 60000, li: 3599, gi: 1013, total: 4612 },
    { min: 60001, max: 75000, li: 4199, gi: 1013, total: 5212 },
    { min: 75001, max: 100000, li: 4199, gi: 1972, total: 6171 },
    { min: 100001, max: 125000, li: 4199, gi: 2762, total: 6961 },
    { min: 125001, max: 200000, li: 5699, gi: 4015, total: 9714 },
    { min: 200001, max: 250000, li: 6700, gi: 4015, total: 10715 },
    { min: 250001, max: 300000, li: 6799, gi: 4015, total: 10814 },
    { min: 300001, max: 400000, li: 8799, gi: 4015, total: 12814 },
    { min: 400001, max: 500000, li: 9999, gi: 4015, total: 14014 },
    { min: 500001, max: 600000, li: 11899, gi: 4015, total: 15914 },
    { min: 600001, max: 700000, li: 11999, gi: 4015, total: 16014 },
    { min: 700001, max: 1150000, li: 12099, gi: 4015, total: 16114 },
];


const ROIData = [
    { IRR: 15, Tenure: { 27: 8.20, 39: 8.30, 51: 8.43, 60: 8.55, 63: 8.56 } },
    { IRR: 16, Tenure: { 27: 8.77, 39: 8.89, 51: 9.05, 60: 9.18, 63: 9.20 } },
    { IRR: 17, Tenure: { 27: 9.35, 39: 9.49, 51: 9.67, 60: 9.82, 63: 9.84 } },
    { IRR: 18, Tenure: { 27: 9.93, 39: 10.10, 51: 10.30, 60: 10.47, 63: 10.49 } },
    { IRR: 19, Tenure: { 27: 10.52, 39: 10.71, 51: 10.94, 60: 11.13, 63: 11.15 } },
    { IRR: 20, Tenure: { 27: 11.11, 39: 11.32, 51: 11.58, 60: 11.79, 63: 11.82 } },
    { IRR: 21, Tenure: { 27: 11.70, 39: 11.94, 51: 12.23, 60: 12.46, 63: 12.49 } },
    { IRR: 22, Tenure: { 27: 12.30, 39: 12.57, 51: 12.89, 60: 13.14, 63: 13.17 } },
    { IRR: 23, Tenure: { 27: 12.90, 39: 13.20, 51: 13.55, 60: 13.83, 63: 13.86 } },
    { IRR: 24, Tenure: { 27: 13.51, 39: 13.84, 51: 14.22, 60: 14.52, 63: 14.56 } },
    { IRR: 25, Tenure: { 27: 14.12, 39: 14.48, 51: 14.90, 60: 15.22, 63: 15.26 } },
    { IRR: 26, Tenure: { 27: 14.73, 39: 15.12, 51: 15.58, 60: 15.93, 63: 15.97 } },
    { IRR: 27, Tenure: { 27: 15.34, 39: 15.77, 51: 16.26, 60: 16.64, 63: 16.68 } },
    { IRR: 28, Tenure: { 27: 15.96, 39: 16.43, 51: 16.96, 60: 17.36, 63: 17.41 } },
    { IRR: 29, Tenure: { 27: 16.58, 39: 17.09, 51: 17.66, 60: 18.09, 63: 18.14 } },
    { IRR: 30, Tenure: { 27: 17.21, 39: 17.75, 51: 18.36, 60: 18.82, 63: 18.88 } },
    { IRR: 31, Tenure: { 27: 17.84, 39: 18.42, 51: 19.07, 60: 19.56, 63: 19.62 } },
    { IRR: 32, Tenure: { 27: 18.47, 39: 19.10, 51: 19.79, 60: 20.31, 63: 20.37 } },
    { IRR: 33, Tenure: { 27: 19.10, 39: 19.78, 51: 20.51, 60: 21.06, 63: 21.13 } },
    { IRR: 34, Tenure: { 27: 19.74, 39: 20.46, 51: 21.24, 60: 21.82, 63: 21.89 } },
    { IRR: 35, Tenure: { 27: 20.39, 39: 21.15, 51: 21.97, 60: 22.59, 63: 22.66 } }
];



let loanInpEle = document.getElementById("appLoanAmount");
let healthAmount = document.getElementById("healthAmount");
let lifeAmount = document.getElementById("lifeAmount");
let proFee = document.getElementById("processingFee")
let grossAmount = document.getElementById("totalGrossAmount")
let totalLoanAmount = document.getElementById("totalLoanAmount")
let emi = document.getElementById("emiAmount")
let totalRepaymentAmount = document.getElementById("totalRepaymentAmount")
let totalInterestAmount = document.getElementById("totalInterestAmount")



function changeToIndian(num) {
    let [intPart, decPart] = num.toString().split(".")
    
    let last3 = intPart.slice(-3)
    let other = intPart.slice(0, -3)
    
    const formattedNumber = other.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
    
    return decPart ? formattedNumber + '.' + decPart : formattedNumber;


}




function userRange(loanAmount) {
    let ligiRange = insuranceData.find(range => loanAmount >= range.min && loanAmount <= range.max)

    return ligiRange
}

function CheckLifeAmount() {
    const lifeRadio = document.querySelector(
        'input[name="life-insurance"]:checked'
    );


    if (lifeRadio.value === "false") {
        lifeAmount.value = 0;
        return;
    }

    let loanAmount = parseInt(loanInpEle.value)

    let ligiRange = userRange(loanAmount)


    lifeAmount.value = ligiRange.li

}

function CheckHealthAmount() {

    const healthRadio = document.querySelector('input[name="health-insurance"]:checked');


    if (healthRadio.value === "false") {
        healthAmount.value = 0;
        return;
    }

    let loanAmount = +loanInpEle.value

    let ligiRange = userRange(loanAmount)

    healthAmount.value = ligiRange.gi
}


function CalculateTotalLoan() {
    let la = parseInt(document.getElementById("appLoanAmount").value);
    let li = parseInt(document.getElementById("lifeAmount").value)
    let gi = parseInt(document.getElementById("healthAmount").value)


    let finPulseReport = 499

    let proFeeVal = ((la + li + gi + finPulseReport) * 0.0393) / (1 - 0.0393)
    let grossAmountVal = proFeeVal + li + gi

    proFee.value = Math.ceil(proFeeVal)

    grossAmount.value = Math.ceil(grossAmountVal)

    totalLoanAmount.value = Math.ceil(grossAmountVal + la)
}

function onchangeRange(ele) {
    let irrVal = document.getElementById("irrVal")
    irrVal.value = ele.value
}

function handleInputs() {
    let errEle = document.getElementById("error")
    // console.log(loanInpEle.value.split(",")[0] === loanInpEle.value, loanInpEle.value)
    if (loanInpEle.value == "") {
        errEle.textContent = "* Required"
        errEle.style.display = "inline"
        return false
    }

    // if (!loanInpEle.value.split(",")[0] === loanInpEle.value) {
    //     loanInpEle.value = loanInpEle.value.split(",").join("")
    // }

    if (loanInpEle.value < 20000) {
        errEle.textContent = "* Enter Valid Number"
        errEle.style.display = "inline"
        
        return false
    }
    return true
}


function checkEmi() {
    if (!handleInputs()) {
        return
    }

    CheckLifeAmount()
    CheckHealthAmount()


    CalculateTotalLoan()

    let irr = parseInt(document.getElementById("irrVal").value)

    let t = parseInt(document.getElementById("tenure").value)

    let roiTenObj = ROIData.find(ele => ele.IRR === irr).Tenure


    let roipa = roiTenObj[t]


    let roipm = roipa / 12


    document.getElementById("ROIpa").value = roipa;
    document.getElementById("ROIpm").value = roipm;

    let T = +document.getElementById("totalLoanAmount").value
    let emiVal = T / t + T * roipa / 1200
    emiVal = parseFloat(emiVal.toFixed(2))

    emi.value = emiVal


    let tramountVal = t * emiVal

    let tiamountVal = tramountVal - T


    // loanInpEle.value = changeToIndian(loanInpEle.value)
    lifeAmount.value = changeToIndian(lifeAmount.value)
    healthAmount.value = changeToIndian(healthAmount.value)
    proFee.value = changeToIndian(proFee.value)
    grossAmount.value = changeToIndian(grossAmount.value)
    totalLoanAmount.value = changeToIndian(totalLoanAmount.value)
    emi.value = changeToIndian(emiVal)
    totalRepaymentAmount.value = changeToIndian(tramountVal.toFixed(2))
    totalInterestAmount.value = changeToIndian(tiamountVal.toFixed(2))

}

function changeErrFunc() {
    document.getElementById("error").style.display = "none"
}