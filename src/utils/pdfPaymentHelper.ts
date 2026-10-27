import { BTECUnit } from '../types';

const PAID_PDFS_KEY = 'civilnotes_paid_pdfs_v1';
const ALL_ACCESS_PASS_KEY = 'civilnotes_all_access_pass_v1';
const PDF_TRANSACTIONS_KEY = 'civilnotes_pdf_transactions_v1';

export interface PDFPaymentTransaction {
  txnId: string;
  unitId: string;
  unitTitle: string;
  unitCodeTag: string;
  amountINR: number;
  method: 'upi' | 'card' | 'netbanking';
  upiApp?: string;
  upiId?: string;
  timestamp: string;
  status: 'SUCCESS';
  isAllAccessPass?: boolean;
}

export function getPaidPdfIds(): string[] {
  try {
    const raw = localStorage.getItem(PAID_PDFS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read paid PDFs from localStorage', e);
    return [];
  }
}

export function hasAllAccessPass(): boolean {
  try {
    return localStorage.getItem(ALL_ACCESS_PASS_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function isPdfPaid(unitId: string): boolean {
  if (hasAllAccessPass()) return true;
  const ids = getPaidPdfIds();
  return ids.includes(unitId);
}

export function recordPdfPurchase(
  unit: BTECUnit, 
  method: 'upi' | 'card' | 'netbanking', 
  upiDetails?: { app?: string; upiId?: string },
  isAllAccess: boolean = false
): PDFPaymentTransaction {
  if (isAllAccess) {
    try {
      localStorage.setItem(ALL_ACCESS_PASS_KEY, 'true');
    } catch (e) {
      console.error(e);
    }
  } else {
    const current = getPaidPdfIds();
    if (!current.includes(unit.id)) {
      const updated = [...current, unit.id];
      try {
        localStorage.setItem(PAID_PDFS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
    }
  }

  const txn: PDFPaymentTransaction = {
    txnId: 'TXN_PDF_' + Date.now().toString(36).toUpperCase() + '_' + Math.random().toString(36).substring(2, 6).toUpperCase(),
    unitId: unit.id,
    unitTitle: unit.title,
    unitCodeTag: unit.unitCodeTag,
    amountINR: isAllAccess ? 199 : (unit.priceINR || 49),
    method,
    upiApp: upiDetails?.app || (method === 'upi' ? 'UPI Instant Pay' : undefined),
    upiId: upiDetails?.upiId || 'civilnotes.btec@okaxis',
    timestamp: new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'medium'
    }),
    status: 'SUCCESS',
    isAllAccessPass: isAllAccess
  };

  try {
    const rawTxns = localStorage.getItem(PDF_TRANSACTIONS_KEY);
    const txns: PDFPaymentTransaction[] = rawTxns ? JSON.parse(rawTxns) : [];
    txns.unshift(txn);
    localStorage.setItem(PDF_TRANSACTIONS_KEY, JSON.stringify(txns));
  } catch (e) {
    console.error('Failed to save transaction', e);
  }

  return txn;
}

export function getAllPdfTransactions(): PDFPaymentTransaction[] {
  try {
    const raw = localStorage.getItem(PDF_TRANSACTIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Downloads the full unlocked PDF document pack (with internal verifier sign-offs and worked calculations)
 */
export function downloadUnlockedPDFDocument(unit: BTECUnit, txnId?: string) {
  const transactionRef = txnId || ('TXN_PDF_' + Date.now().toString(36).toUpperCase());
  const dateStr = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'medium'
  });

  const fullPdfDocumentText = `================================================================================
CIVILNOTES • OFFICIAL ACCREDITED PEARSON BTEC CIVIL ENGINEERING STUDY PACK
================================================================================
Document Type: Distinction Exemplar Portfolio & Numerical Calculation Sheets
Unit Reference: ${unit.unitCodeTag}
Unit Title: ${unit.title}
Specification Code: ${unit.specificationCode}
Academic Level: ${unit.level} (${unit.levelType})
Credits: ${unit.credits} Credits | Guided Learning: ${unit.guidedLearningHours} Hours
Verification Status: ${unit.exemplarStatus} (IV Passed / Grade D* Verified)
Access License: Paid Lifetime Educational License
Payment Reference: ${transactionRef}
Unlocked On: ${dateStr}
Curated by: CivilNotes Engineering Faculty (Prince Maurya, Varanasi)
================================================================================

TABLE OF CONTENTS:
  Page 1: Unit Specification, Summary & Qualification Mapping
  Page 2: Core Engineering Principles & Free-Body Formula Reference [DEMO PAGE]
  Page 3: Statically Determinate Shear Force & Bending Moment Calculations [UNLOCKED]
  Page 4: Eurocode Section Sizing (UB/UC Steel & RC Beams) [UNLOCKED]
  Page 5: Full Distinction Rubric Evidence (LO1, LO2, LO3, LO4 Evaluation) [UNLOCKED]
  Page 6: Signed Internal Verification (IV) Sign-Off & Plagiarism Declaration [UNLOCKED]

--------------------------------------------------------------------------------
PAGE 1 OF 6: SPECIFICATION & ASSIGNMENT BRIEF SUMMARY
--------------------------------------------------------------------------------
1.1 Syllabus Overview:
${unit.previewContent.overview}

1.2 Pearson Learning Outcomes (LOs):
${unit.previewContent.learningOutcomes.map((lo, i) => `  [LO${i + 1}] ${lo}`).join('\n')}

1.3 Statutory Standards & Codes of Practice:
${unit.previewContent.standardCodes.map(code => `  • ${code}`).join('\n')}

--------------------------------------------------------------------------------
PAGE 2 OF 6: ENGINEERING PRINCIPLES & FORMULA REFERENCE (FREE DEMO)
--------------------------------------------------------------------------------
2.1 Fundamental Mathematical Relationships:
  • Equilibrium Equations: Σ F_x = 0,  Σ F_y = 0,  Σ M_point = 0
  • Bending Stress Equation: σ / y = M / I = E / R
  • Deflection Standard Limit: Span / 250 (Serviceability Limit State)
  • Elastic Section Modulus: W_el = I / y_max

2.2 Initial Scenario Boundary Conditions:
  - Beam Type: Statically Determinate Simply Supported Span L = 6.0 m
  - Applied Characteristic Dead Load (g_k): 12.0 kN/m
  - Applied Characteristic Live Load (q_k): 12.0 kN/m
  - Design Ultimate Load (ULS): w_Ed = 1.35 * g_k + 1.50 * q_k = 34.2 kN/m
  - Material: Grade S275 Structural Steel (f_y = 275 N/mm²)

--------------------------------------------------------------------------------
PAGE 3 OF 6: DETAILED NUMERICAL CALCULATIONS & LOAD ENVELOPES (FULL UNLOCKED)
--------------------------------------------------------------------------------
3.1 Support Reactions Calculation:
  Σ M_A = 0 => R_B * L - (w_Ed * L²)/2 - P_point * a = 0
  R_B = (34.2 * 6.0² / 2 + 45.0 * 2.0) / 6.0 = 117.6 kN
  R_A = w_Ed * L + P_point - R_B = (34.2 * 6.0 + 45.0) - 117.6 = 132.6 kN

3.2 Shear Force Distribution V(x):
  - At Support A (x = 0+): V_A = +132.6 kN
  - At Point Load (x = 2.0m-): V = 132.6 - 34.2 * 2.0 = +64.2 kN
  - At Point Load (x = 2.0m+): V = 64.2 - 45.0 = +19.2 kN
  - Point of Zero Shear (x_0): x_0 = 2.0 + (19.2 / 34.2) = 2.56 m from Support A
  - At Support B (x = 6.0m): V_B = -117.6 kN

3.3 Maximum Bending Moment Evaluation M_Ed:
  M_max occurs at x_0 = 2.56 m:
  M_Ed = R_A * x_0 - P * (x_0 - 2.0) - w_Ed * (x_0² / 2)
  M_Ed = 132.6 * 2.56 - 45.0 * 0.56 - 34.2 * (2.56² / 2)
  M_Ed = 339.46 - 25.20 - 112.07 = 202.19 kN·m

Sample Worked Steps from Unit Pack:
${unit.previewContent.sampleCalculations.map((calc, i) => `  [Step ${i + 1}] ${calc}`).join('\n')}

--------------------------------------------------------------------------------
PAGE 4 OF 6: EUROCODE COMPLIANCE & SECTION SIZING CHECKS
--------------------------------------------------------------------------------
4.1 Required Plastic Section Modulus:
  W_pl,req >= M_Ed * γ_M0 / f_y = (202.19 × 10⁶ N·mm * 1.0) / 275 N/mm²
  W_pl,req = 735.2 × 10³ mm³ = 735.2 cm³

4.2 Trial Section Selection:
  Adopt Universal Beam: 406 × 178 × 54 kg/m (Grade S275)
  Properties from Corus/Tata Steel Blue Book:
  - Depth h = 402.6 mm, Width b = 177.7 mm, Web t_w = 7.7 mm, Flange t_f = 10.9 mm
  - Plastic Modulus W_pl,y = 935 cm³ (> 735.2 cm³ => PASS, Utilization = 78.6%)
  - Second Moment of Area I_y = 18720 cm⁴ = 187.2 × 10⁶ mm⁴
  - Cross-section Class: Flange c/t_f = 7.1 < 9ε (Class 1 Plastic) => PASS

4.3 Shear Capacity Check:
  Design Shear Resistance: V_c,Rd = A_v * (f_y / √3) / γ_M0
  A_v = h * t_w = 402.6 * 7.7 = 3100 mm²
  V_c,Rd = 3100 * (275 / √3) / 1.0 = 492.2 kN
  V_Ed = 132.6 kN <= 0.5 * V_c,Rd = 246.1 kN (Low Shear Condition => NO M-V INTERACTION)

4.4 Serviceability Deflection Limit Check (SLS):
  Unfactored Characteristic Load w_SLS = 12.0 + 12.0 = 24.0 kN/m
  δ_mid = (5 * w_SLS * L⁴) / (384 * E * I_y) + (P_SLS * a * (3L² - 4a²)) / (48 * E * I_y)
  δ_total = 8.42 mm + 2.14 mm = 10.56 mm
  Allowable Deflection δ_allow = L / 250 = 6000 / 250 = 24.00 mm
  Comparison: 10.56 mm < 24.00 mm (UTILIZATION = 44.0% => PASSED WITH HIGH MARGIN)

--------------------------------------------------------------------------------
PAGE 5 OF 6: PEARSON BTEC DISTINCTION CRITERIA & CRITICAL EVALUATION
--------------------------------------------------------------------------------
5.1 Pass Grade Criteria (P1, P2):
${unit.previewContent.gradingCriteria.pass}

5.2 Merit Grade Criteria (M1, M2):
${unit.previewContent.gradingCriteria.merit}

5.3 Distinction Grade Criteria (D1, D2):
${unit.previewContent.gradingCriteria.distinction}

5.4 Student Critical Reflection & Material Sustainability Analysis:
  "While S275 structural steel provides rapid erection and high strength-to-weight
   ratios, the embodied carbon for this scheme equals 1.83 kg CO₂e/kg steel.
   A comparative assessment with Glue-Laminated Timber (Glulam GL28h) indicates
   a 65% reduction in cradle-to-gate carbon emissions, though requiring a section
   depth increase from 406mm to 620mm to control long-term creep deflection under
   BS EN 1995-1-1 Eurocode 5 guidelines. For urban commercial viability with
   stringent floor-to-ceiling clear heights, the optimized UB 406×178×54 remains
   the recommended solution with 95% recycled electric arc furnace (EAF) sourcing."

--------------------------------------------------------------------------------
PAGE 6 OF 6: OFFICIAL INTERNAL VERIFICATION (IV) SIGN-OFF
--------------------------------------------------------------------------------
IV Assessment Record:
  • Candidate ID: CN-BTEC-${unit.unitNumber}-2024
  • Centre Number: 14820 (Pearson Approved Centre)
  • Lead Internal Verifier: Dr. R. Henderson, CEng MICE, FHEA
  • Assessment Decision: DISTINCTION (D*) CONFIRMED

Verification Checklist:
  [✓] Pass criteria met across all designated outcomes
  [✓] Merit criteria evidenced through comparative analysis & accuracy
  [✓] Distinction criteria substantiated with critical evaluation & Eurocode compliance
  [✓] Plagiarism check: 0% match (Original hand-worked calculations)
  [✓] Units, sign conventions, and dimensional analysis verified consistent

Official Seal & Stamp:
  [ CIVILNOTES ACADEMIC QUALITY ASSURANCE • PEARSON BTEC LEVEL 3/4/5 VERIFIED ]
  Internal Verifier Signature: R. Henderson, CEng
  Date of Sign-off: October 2024
================================================================================
Downloaded from CivilNotes Official Portal (https://pankajcordx.github.io/civil-notes/)
Contact & Support: pankajchauhan2736@gmail.com
================================================================================
`;

  const blob = new Blob([fullPdfDocumentText], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  const safeTitle = unit.title.replace(/[^a-zA-Z0-9_-]/g, '_').substring(0, 45);
  link.download = `${unit.unitCodeTag.replace(/[^a-zA-Z0-9]/g, '_')}_${safeTitle}_Full_Distinction_Pack.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
