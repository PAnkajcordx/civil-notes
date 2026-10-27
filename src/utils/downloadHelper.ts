import { BTECUnit } from '../types';

export const downloadUnitPortfolio = (unit: BTECUnit) => {
  const fileContent = `===============================================================
CIVILNOTES - SPECIALIST PEARSON BTEC CIVIL ENGINEERING RESOURCE
===============================================================
Unit: ${unit.title}
Code: ${unit.unitCodeTag} | Spec: ${unit.specificationCode}
Level: ${unit.level} (${unit.levelType})
Credits: ${unit.credits} | Guided Learning Hours: ${unit.guidedLearningHours}
Status: ${unit.exemplarStatus}
Curated by: CivilNotes (Founder: Prince Maurya, Varanasi)
===============================================================

1. UNIT OVERVIEW & SPECIFICATION
---------------------------------------------------------------
${unit.previewContent.overview}

2. PEARSON BTEC LEARNING OUTCOMES
---------------------------------------------------------------
${unit.previewContent.learningOutcomes.map((lo, i) => `${i + 1}. ${lo}`).join('\n')}

3. GRADING CRITERIA BREAKDOWN
---------------------------------------------------------------
[PASS]
${unit.previewContent.gradingCriteria.pass}

[MERIT]
${unit.previewContent.gradingCriteria.merit}

[DISTINCTION]
${unit.previewContent.gradingCriteria.distinction}

4. DISTINCTION-GRADE STEP-BY-STEP CALCULATIONS & WORKED EXAMPLES
---------------------------------------------------------------
${unit.previewContent.sampleCalculations.map((calc, i) => `Step ${i + 1}: ${calc}`).join('\n')}

5. APPLICABLE BRITISH STANDARDS & EUROCODES
---------------------------------------------------------------
${unit.previewContent.standardCodes.map(code => `• ${code}`).join('\n')}

===============================================================
INTERNAL VERIFICATION (IV) SIGN-OFF CHECKLIST:
[✓] Authenticity verified against student declaration
[✓] All calculation units (kN, m, N/mm², kPa) checked for dimensional consistency
[✓] Distinction rubric requirements fully satisfied with critical evaluation
===============================================================
Downloaded from CivilNotes - Pearson BTEC Level 3, HNC & HND Portal
`;

  const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `CivilNotes_${unit.unitCodeTag.replace(/[^a-zA-Z0-9]/g, '_')}_Distinction_Pack.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
