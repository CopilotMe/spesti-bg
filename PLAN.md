# План: Газ, Кредити, Застраховки + Комбиниран калкулатор

## Резултати от проучването на API-та

### Налични безплатни API-та:
1. **ECB Data API** (data-api.ecb.europa.eu) — лихви по кредити в БГ, месечно обновяване, без регистрация, JSON/CSV
2. **Eurostat API** — цени на газ за домакинства по държави (вкл. БГ), без регистрация, JSON
3. **ENTSO-E API** — wholesale цени на ток на час (изисква регистрация + имейл за токен)

### Няма API за:
- КЕВР тарифи (газ/вода/ток) — ще останат статични данни
- Застраховки — няма публичен API в БГ, ръчни данни
- Smart meters / потребление — няма в БГ (под 1% smart meters)

## Какво правим

### 1. Секция "Газ" `/gaz`
- Следва pattern на electricity — GasProvider, calculateGasBills()
- Данни: Овергаз, Ситигаз, Черноморска технологична компания и др.
- Breakdown: цена газ + разпределение + пренос + акциз + ДДС
- Ref линкове: `?ref=spesti`

### 2. Секция "Кредити" `/krediti`
- **ECB API интеграция** — средни лихви по потребителски и жилищни кредити в БГ
- Loan калкулатор: въвеждаш сума + срок → изчислява вноска
- Сравнение на банки (статични данни за популярни оферти)
- Ref линкове към банките: `?ref=spesti`

### 3. Секция "Застраховки" `/zastrahovki`
- Сравнение тип telecom — филтрирай по тип (КАСКО, ГО, здравна, имотна)
- Статични данни за основни застрахователи (ДЗИ, Булстрад, Алианц, Лев Инс)
- Ref линкове: `?ref=spesti`

### 4. Комбиниран калкулатор `/kombiniran`
- Dashboard с всички разходи на домакинството
- Интеграция с ECB API — показва реалните средни лихви в БГ (live данни!)
- Въвеждаш потребление ток + вода + газ + кредит → тотал месечно

### 5. Ref линкове навсякъде
- Всички URL-ове получават `?ref=spesti` параметър
- Централизиран utility за генериране на ref URL

## Ред на изпълнение

1. **Ref линкове** — утилита + update на всички съществуващи URL-и
2. **Газ** — data + types + calculator + page (следва electricity pattern)
3. **Кредити** — ECB API fetch + loan calculator + bank comparison + page
4. **Застраховки** — data + comparison table + page
5. **Комбиниран** — dashboard page обединяващ всички секции
6. **Nav + Landing** — обнови навигация и home page с новите категории
7. **i18n** — обнови bg.json с нови стрингове
8. **Build + Push**

## Файлове за създаване/промяна

### Нови файлове:
- `src/data/gas.ts`
- `src/data/loans.ts`
- `src/data/insurance.ts`
- `src/lib/calculators/gas.ts`
- `src/lib/calculators/loans.ts`
- `src/lib/ref.ts` — utility за ref URL-и
- `src/components/calculator/GasCalculator.tsx`
- `src/components/calculator/LoanCalculator.tsx`
- `src/components/calculator/InsuranceComparison.tsx`
- `src/components/calculator/CombinedDashboard.tsx`
- `src/app/gaz/page.tsx`
- `src/app/krediti/page.tsx`
- `src/app/zastrahovki/page.tsx`
- `src/app/kombiniran/page.tsx`

### Промени в съществуващи:
- `src/lib/types.ts` — нови interfaces
- `src/messages/bg.json` — нови strings
- `src/app/page.tsx` — 6 категории вместо 3
- `src/components/layout/Header.tsx` — нови nav links
- `src/components/layout/CategoryCard.tsx` — нови icon mappings
- `src/data/electricity.ts` — ref params в URL-и
- `src/data/water.ts` — ref params в URL-и
- `src/components/calculator/TelecomComparison.tsx` — ref params
- `src/components/calculator/ResultsTable.tsx` — ref params
- `src/data/explanations.ts` — gas explanations
- `src/app/sitemap.ts` — нови страници
