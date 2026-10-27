import fs from 'fs';
import path from 'path';

/**
 * Generates a clean, valid, standard PDF 1.4 binary buffer without external C-libraries
 */
function createMinimalPdfBuffer(title: string, subtitle: string, pages: string[]): Buffer {
  const objects: string[] = [];
  
  // Obj 1: Catalog
  objects.push('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj');
  
  // Obj 2: Pages container
  const pageRefs = pages.map((_, i) => `${3 + i * 2} 0 R`).join(' ');
  objects.push(`2 0 obj\n<< /Type /Pages /Kids [${pageRefs}] /Count ${pages.length} >>\nendobj`);

  // Font object
  const fontObjIndex = 3 + pages.length * 2;
  
  // Build Pages and Content Streams
  pages.forEach((pageText, i) => {
    const pageIndex = 3 + i * 2;
    const contentIndex = pageIndex + 1;

    // Page Object
    objects.push(
      `${pageIndex} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents ${contentIndex} 0 R /Resources << /Font << /F1 ${fontObjIndex} 0 R >> >> >>\nendobj`
    );

    // Escape text for PDF stream
    const escapedText = pageText.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    
    // Draw professional CivilNotes watermarks, headers, and text lines
    const streamContent = `
BT
/F1 18 Tf
40 790 Td
(${title.replace(/[^a-zA-Z0-9 -]/g, '')}) Tj
ET
BT
/F1 11 Tf
40 770 Td
(CIVILNOTES OFFICIAL ACCREDITED RESOURCE | ${subtitle.replace(/[^a-zA-Z0-9 -]/g, '')}) Tj
ET
BT
/F1 9 Tf
40 755 Td
(Verified Single Customer Educational License. Unauthorized redistribution prohibited.) Tj
ET
BT
/F1 10 Tf
40 720 Td
14 TL
${escapedText.split('\n').map(line => `(${line.replace(/[^a-zA-Z0-9 :.,_=/*+()-]/g, '')}) '`).join('\n')}
ET
BT
/F1 9 Tf
40 30 Td
(CivilNotes Portal - Page ${i + 1} of ${pages.length} - Strictly Confidential - Licensed to Customer) Tj
ET
`;
    const streamLen = Buffer.byteLength(streamContent, 'utf-8');
    objects.push(`${contentIndex} 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream\nendobj`);
  });

  // Font Object
  objects.push(`${fontObjIndex} 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj`);

  // Assemble PDF
  let pdf = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const offsets: number[] = [0]; // 0000000000 65535 f 

  for (let i = 0; i < objects.length; i++) {
    offsets.push(Buffer.byteLength(pdf, 'utf-8'));
    pdf += objects[i] + '\n';
  }

  const xrefOffset = Buffer.byteLength(pdf, 'utf-8');
  pdf += 'xref\n';
  pdf += `0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  for (let i = 1; i < offsets.length; i++) {
    pdf += offsets[i].toString().padStart(10, '0') + ' 00000 n \n';
  }

  pdf += 'trailer\n';
  pdf += `<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += 'startxref\n';
  pdf += `${xrefOffset}\n`;
  pdf += '%%EOF\n';

  return Buffer.from(pdf, 'utf-8');
}

export function ensureSeedPdfsExist() {
  const dir = path.resolve(process.cwd(), 'storage/private_pdfs');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const pdfFiles: Record<string, { title: string; subtitle: string; pages: string[] }> = {
    'pdf_civil_complete_notes.pdf': {
      title: 'Civil Engineering Complete Study Notes',
      subtitle: 'Distinction Master Portfolio Suite',
      pages: [
        `MODULE 1: STRUCTURAL MECHANICS & STATIC EQUILIBRIUM
1.1 Governing Elastic Bending Equation:
   M / I = sigma / y = E / R
   where M = Bending Moment, I = Second Moment of Area,
   sigma = Normal Stress, y = Neutral Axis Distance.
1.2 Maximum Simply Supported UDL Bending Moment:
   M_max = (w * L^2) / 8
1.3 Eurocode 3 Load Combination (ULS):
   w_Ed = 1.35 * G_k + 1.50 * Q_k
1.4 Shear Force Envelope & Zero Shear Inflection Points:
   dM/dx = V(x). Peak moment occurs where shear is zero.`,
        `MODULE 2: LAND SURVEYING & TOTAL STATION FIELDWORK
2.1 Differential Levelling Arithmetic Reduction Checks:
   Sum(Backsights) - Sum(Foresights) = Sum(Rise) - Sum(Fall) = Last RL - First RL
2.2 Bowditch Traverse Misclosure Rule:
   Correction in Easting = - (Total Easting Error) * (Leg Length / Perimeter)
2.3 Collimation Error Two-Peg Test:
   Error delta = (A1 - B1) - (A2 - B2) <= 1.5 mm tolerance over 20m.`,
        `MODULE 3: GEOTECHNICS & SOIL FOUNDATIONS
3.1 Mohr-Coulomb Shear Strength:
   tau_f = c + sigma_n * tan(phi)
3.2 Rankine Active Lateral Earth Pressure:
   K_a = (1 - sin(phi)) / (1 + sin(phi)) = tan^2(45 - phi/2)
3.3 Primary Consolidation Settlement:
   S_c = [C_c / (1 + e_0)] * H * log10[(sigma_0 + delta_sigma) / sigma_0]`
      ]
    },
    'pdf_surveying_notes.pdf': {
      title: 'Surveying & Levelling Numerical Pack',
      subtitle: 'Fieldwork Calculations & Traverse Reductions',
      pages: [
        `SECTION 1: THEODOLITE & TOTAL STATION TRAVERSING
1. Included Angles Angular Misclosure:
   Sum of interior angles = (2n - 4) * 90 degrees
2. Linear Fractional Misclosure:
   1 in 5000 precision standard for structural setting out.
3. Coordinate Computation:
   Departure = Length * sin(WCB)
   Latitude = Length * cos(WCB)`,
        `SECTION 2: CURVATURE, REFRACTION & TWO-PEG ERROR
1. Combined Earth Curvature & Atmospheric Refraction:
   h_correction = 0.0673 * D^2 (m, where D is in km)
2. Setting out horizontal circular curves by Rankine deflection angle:
   delta_1 = 1718.9 * (c_1 / R) minutes.`
      ]
    },
    'pdf_building_materials.pdf': {
      title: 'Building Materials & Concrete Technology',
      subtitle: 'Eurocode 2 & IS 456 Specification Guide',
      pages: [
        `CHAPTER 1: CEMENT HYDRATION & CONCRETE MIX DESIGN
1. Bogue Compounds Kinetics: C3S (early strength), C2S (ultimate durability).
2. Water-Cement Ratio Law (Abrams Rule):
   Compressive strength f_ck inversely proportional to w/c ratio.
3. Workability Tests: Slump Test (mm), Compacting Factor, V-B Consistometer.`,
        `CHAPTER 2: STEEL REBAR & PRESTRESSED TENDONS
1. High Yield Deformed Bars (Fe 500 / B500B):
   Yield stress f_yk = 500 N/mm2, Modulus E_s = 200,000 N/mm2.
2. Minimum cover for durability in marine environment: 50mm + delta_c.`
      ]
    },
    'pdf_estimation_costing.pdf': {
      title: 'Estimation, Costing & Valuation Handbook',
      subtitle: 'Standard Measurement (CESMM4 & PWD DSR)',
      pages: [
        `PART 1: QUANTITY TAKEOFF & RCC RATE ANALYSIS
1. Center Line Method: Net Length = Total Center Line - 0.5 * Number of Junctions * Wall Width
2. Prismoidal Earthwork Volume:
   V = (L / 6) * [A1 + 4*Am + A2]
3. Steel Reinforcement Estimation:
   Weight = (D^2 / 162) kg per running meter.`,
        `PART 2: VALUATION & CONTRACT TENDERING
1. Capitalized Value = Net Annual Income * Year Purchase (YP)
2. Sinking Fund Formula:
   I_c = (S * i) / [(1 + i)^n - 1]`
      ]
    },
    'pdf_construction_planning.pdf': {
      title: 'Construction Planning, CPM & PERT Methods',
      subtitle: 'Project Scheduling & CDM 2015 RAMS',
      pages: [
        `MODULE 1: NETWORK SCHEDULING (CPM & PERT)
1. Critical Path determination: Float = Total Float = Late Start - Early Start = 0
2. PERT Expected Duration:
   t_e = (t_o + 4*t_m + t_p) / 6
3. Project Crashing Cost Slope:
   Cost Slope = (Crash Cost - Normal Cost) / (Normal Time - Crash Time)`,
        `MODULE 2: CDM REGULATIONS 2015 COMPLIANCE
1. Statutory Duty Holders: Client, Principal Designer, Principal Contractor.
2. Dynamic Site Risk Assessment Matrix: Risk = Likelihood (1-5) * Severity (1-5).
3. RAMS safe systems of work for deep excavations (>1.2m shoring).`
      ]
    },
    'pdf_unit_1_mechanics.pdf': {
      title: 'Unit 1: Construction Principles (Mechanics)',
      subtitle: 'Pearson BTEC Level 3 Distinction Portfolio',
      pages: [
        `PEARSON BTEC SPECIFICATION Y/615/1387
Learning Outcomes LO1, LO2, LO3, LO4
Pass, Merit, and Distinction criteria fully satisfied.
Calculations verified against BS EN 1990 & BS EN 1993-1-1.`,
        `STEP-BY-STEP WORKED EXAMPLES
Beam Span L = 6.0m, w_Ed = 34.2 kN/m, P_point = 45 kN at 2.0m.
Reaction R_B = 117.6 kN, Reaction R_A = 132.6 kN.
Point of Zero Shear: x_0 = 2.56 m.
Peak Bending Moment M_Ed = 202.19 kN.m.
Section Sizing: UB 406x178x54 (S275 steel). Utilization = 78.6% (PASSED).`
      ]
    },
    'pdf_unit_30_geotech.pdf': {
      title: 'Unit 30: Geotechnics & Soil Mechanics',
      subtitle: 'Pearson BTEC Level 4 HNC Distinction Portfolio',
      pages: [
        `PEARSON BTEC SPECIFICATION Y/615/1411
1. Particle Size Distribution (PSD) & Atterberg Limits (LL, PL, PI).
2. Rankine Active Earth Pressure Ka = 0.333 for phi = 30 degrees.
3. Gravity Retaining Wall Overturning Factor of Safety = 2.05 (> 2.0 ADEQUATE).
4. Signed Internal Verifier (IV) sheet confirmed Grade D*.`
      ]
    }
  };

  for (const [filename, doc] of Object.entries(pdfFiles)) {
    const fullPath = path.join(dir, filename);
    if (!fs.existsSync(fullPath)) {
      const buffer = createMinimalPdfBuffer(doc.title, doc.subtitle, doc.pages);
      fs.writeFileSync(fullPath, buffer);
    }
  }
}
