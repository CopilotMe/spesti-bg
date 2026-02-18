/**
 * Нето/Бруто калкулатор за заплати в България (2026)
 *
 * Ставки за трета категория труд, трудов договор:
 * - ДОО (пенсионен): 14.12% общо → 8.38% работодател + 5.74% работник
 * - ДЗПО (допълнително пенсионно): 5% общо → 2.8% работодател + 2.2% работник
 * - ЗО (здравно): 8% общо → 4.8% работодател + 3.2% работник
 * - Общо от работник: 5.74% + 2.2% + 3.2% = 11.14%
 * - ДОД: 10% върху (бруто - осигуровки)
 *
 * Максимален осигурителен доход: 3750 лв = 1917.35 €
 * Минимален осигурителен доход: варира по професия (използваме 933 лв = 477 €)
 */

const EUR_TO_BGN = 1.95583;

// Осигурителни вноски от работника (%)
const EMPLOYEE_DOO = 5.74; // Пенсионен фонд
const EMPLOYEE_DZPO = 2.2; // Допълнително задължително пенсионно
const EMPLOYEE_ZO = 3.2; // Здравно осигуряване
const EMPLOYEE_TOTAL_RATE = (EMPLOYEE_DOO + EMPLOYEE_DZPO + EMPLOYEE_ZO) / 100; // 0.1114

// Осигурителни вноски от работодателя (%)
const EMPLOYER_DOO = 8.38;
const EMPLOYER_DZPO = 2.8;
const EMPLOYER_ZO = 4.8;
const EMPLOYER_GVRS = 0.06; // Фонд ГВРС
const EMPLOYER_TZPB = 0.5; // Фонд ТЗПБ (средно)
const EMPLOYER_TOTAL_RATE =
  (EMPLOYER_DOO + EMPLOYER_DZPO + EMPLOYER_ZO + EMPLOYER_GVRS + EMPLOYER_TZPB) / 100;

// Данък общ доход
const INCOME_TAX_RATE = 0.1;

// Максимален осигурителен доход
const MAX_INSURANCE_INCOME_BGN = 3750;
const MAX_INSURANCE_INCOME_EUR = MAX_INSURANCE_INCOME_BGN / EUR_TO_BGN;

export interface SalaryBreakdown {
  grossEur: number;
  employeeDooEur: number; // Пенсионен
  employeeDzpoEur: number; // ДЗПО
  employeeZoEur: number; // Здравно
  totalEmployeeInsuranceEur: number;
  taxableIncomeEur: number;
  incomeTaxEur: number;
  netEur: number;
  // Работодател
  employerInsuranceEur: number;
  totalCostEur: number; // Бруто + работодателски осигуровки
  // Процентни показатели
  effectiveTaxRate: number; // (бруто - нето) / бруто
  netToGrossRatio: number; // нето / бруто
}

export function calculateNetFromGross(grossEur: number): SalaryBreakdown {
  // Осигурителен доход е ограничен до максимума
  const insurableIncome = Math.min(grossEur, MAX_INSURANCE_INCOME_EUR);

  const employeeDoo = insurableIncome * (EMPLOYEE_DOO / 100);
  const employeeDzpo = insurableIncome * (EMPLOYEE_DZPO / 100);
  const employeeZo = insurableIncome * (EMPLOYEE_ZO / 100);
  const totalEmployeeInsurance = employeeDoo + employeeDzpo + employeeZo;

  const taxableIncome = grossEur - totalEmployeeInsurance;
  const incomeTax = taxableIncome * INCOME_TAX_RATE;
  const net = taxableIncome - incomeTax;

  const employerInsurance = insurableIncome * EMPLOYER_TOTAL_RATE;
  const totalCost = grossEur + employerInsurance;

  return {
    grossEur: grossEur,
    employeeDooEur: employeeDoo,
    employeeDzpoEur: employeeDzpo,
    employeeZoEur: employeeZo,
    totalEmployeeInsuranceEur: totalEmployeeInsurance,
    taxableIncomeEur: taxableIncome,
    incomeTaxEur: incomeTax,
    netEur: net,
    employerInsuranceEur: employerInsurance,
    totalCostEur: totalCost,
    effectiveTaxRate: grossEur > 0 ? (grossEur - net) / grossEur : 0,
    netToGrossRatio: grossEur > 0 ? net / grossEur : 0,
  };
}

export function calculateGrossFromNet(netEur: number): SalaryBreakdown {
  // Обратна формула:
  // net = (gross - gross * EMPLOYEE_TOTAL_RATE) * (1 - INCOME_TAX_RATE)
  // net = gross * (1 - EMPLOYEE_TOTAL_RATE) * 0.9
  // gross = net / ((1 - EMPLOYEE_TOTAL_RATE) * 0.9)
  // Но трябва да отчетем максималния осигурителен доход

  // Първо изчисляваме без ограничение
  const grossEstimate = netEur / ((1 - EMPLOYEE_TOTAL_RATE) * (1 - INCOME_TAX_RATE));

  if (grossEstimate <= MAX_INSURANCE_INCOME_EUR) {
    return calculateNetFromGross(grossEstimate);
  }

  // Ако бруто > максимален осигурителен доход:
  // net = (gross - MAX * EMPLOYEE_TOTAL_RATE) * 0.9
  // net = 0.9 * gross - 0.9 * MAX * EMPLOYEE_TOTAL_RATE
  // gross = (net + 0.9 * MAX * EMPLOYEE_TOTAL_RATE) / 0.9
  const maxInsurance = MAX_INSURANCE_INCOME_EUR * EMPLOYEE_TOTAL_RATE;
  const gross = (netEur + (1 - INCOME_TAX_RATE) * maxInsurance) / (1 - INCOME_TAX_RATE);

  return calculateNetFromGross(gross);
}

// Константи за експорт
export const SALARY_CONSTANTS = {
  minWageEur: 620.2, // МРЗ 2026
  avgWageEur: 1150, // Приблизителна средна заплата (бруто) Q3 2025
  maxInsuranceIncomeEur: MAX_INSURANCE_INCOME_EUR,
  employeeTotalRate: EMPLOYEE_TOTAL_RATE,
  employerTotalRate: EMPLOYER_TOTAL_RATE,
  incomeTaxRate: INCOME_TAX_RATE,
  rates: {
    employeeDoo: EMPLOYEE_DOO,
    employeeDzpo: EMPLOYEE_DZPO,
    employeeZo: EMPLOYEE_ZO,
    employerDoo: EMPLOYER_DOO,
    employerDzpo: EMPLOYER_DZPO,
    employerZo: EMPLOYER_ZO,
    employerGvrs: EMPLOYER_GVRS,
    employerTzpb: EMPLOYER_TZPB,
  },
};
