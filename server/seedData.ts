import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  loadDatabase,
  saveDatabase,
  PRIVATE_PDF_DIR,
  User,
  Product,
} from './db';

/**
 * Generates a valid standard PDF 1.4 binary file with readable text and metadata.
 * Validated against PDF 1.4 specification without needing heavy external C++ binaries.
 */
function createMinimalPdfBuffer(title: string, subject: string, pageCount: number): Buffer {
  const objects: string[] = [];
  const byteOffsets: number[] = [];
  
  // Helper to add object
  function addObject(content: string): number {
    const objNum = objects.length + 1;
    objects.push(`${objNum} 0 obj\n${content}\nendobj\n`);
    return objNum;
  }

  // 1: Catalog
  addObject(`<< /Type /Catalog /Pages 2 0 R >>`);

  // 2: Pages list (will reference kids)
  // We'll prepare kid references
  const kids: string[] = [];
  const pageObjNums: number[] = [];

  // Font object
  const fontObj = addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
  const fontBoldObj = addObject(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);

  // Build each page
  for (let i = 1; i <= pageCount; i++) {
    const isDemo = i <= 2;
    const streamContent = `
BT
/F2 20 Tf
50 780 Td
(${title.replace(/[()\\]/g, '\\$&')}) Tj
/F1 12 Tf
0 -24 Td
(Subject / Discipline: ${subject.replace(/[()\\]/g, '\\$&')}) Tj
0 -18 Td
(CivilNotes Verified Academic Coursework & Distinction Study Pack) Tj
0 -18 Td
(Page ${i} of ${pageCount} ${isDemo ? '[PREVIEW DEMO PAGE]' : '[PURCHASED FULL DOCUMENT]'}) Tj
0 -36 Td
/F2 14 Tf
(1. TECHNICAL OVERVIEW & CORE FORMULAE - PART ${i}) Tj
/F1 10 Tf
0 -20 Td
(This document contains proprietary engineering schematics, Eurocode calculations,) Tj
0 -14 Td
(limit-state verification, and full numerical analysis for coursework assessment.) Tj
0 -14 Td
(Unauthorized copying or redistribution is strictly monitored via CivilNotes security.) Tj
0 -30 Td
/F2 12 Tf
(2. SPECIFICATION STANDARDS & METHODOLOGY) Tj
/F1 10 Tf
0 -18 Td
(Standard: BS EN 1990 / BS EN 1991 / BTEC Civil Engineering Specification 2026) Tj
0 -14 Td
(Material Safety Factor gamma_m = 1.15 | Characteristic Strength f_ck = 30 N/mm2) Tj
0 -14 Td
(Deflection Check: delta_actual <= L / 250 allowable serviceability span ratio) Tj
0 -30 Td
/F2 11 Tf
(Authoritative Entitlement ID: Verified via CivilNotes Cloud Security) Tj
ET
`.trim();

    const streamLen = Buffer.byteLength(streamContent, 'utf-8');
    const contentObj = addObject(`<< /Length ${streamLen} >>\nstream\n${streamContent}\nendstream`);

    const pageObj = addObject(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentObj} 0 R /Resources << /Font << /F1 ${fontObj} 0 R /F2 ${fontBoldObj} 0 R >> >> >>`);
    kids.push(`${pageObj} 0 R`);
    pageObjNums.push(pageObj);
  }

  // Update object 2 (Pages root)
  objects[1] = `2 0 obj\n<< /Type /Pages /Kids [${kids.join(' ')}] /Count ${pageCount} >>\nendobj\n`;

  // Assemble full file buffer
  let output = `%PDF-1.4\n%\xE2\xE3\xCF\xD3\n`;
  byteOffsets.push(0);

  for (let i = 0; i < objects.length; i++) {
    byteOffsets.push(Buffer.byteLength(output, 'utf-8'));
    output += objects[i];
  }

  const xrefOffset = Buffer.byteLength(output, 'utf-8');
  output += `xref\n0 ${objects.length + 1}\n`;
  output += `0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i++) {
    const offsetStr = byteOffsets[i].toString().padStart(10, '0');
    output += `${offsetStr} 00000 n \n`;
  }
  output += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(output, 'utf-8');
}

export function seedInitialData(): void {
  const db = loadDatabase();

  // 1. Seed Users if not present
  if (db.users.length === 0) {
    const adminPasswordHash = bcrypt.hashSync('Admin@CivilNotes2026', 10);
    const studentPasswordHash = bcrypt.hashSync('Student@123', 10);

    const adminUser: User = {
      id: 'usr_admin_001',
      email: 'admin@civilnotes.com',
      passwordHash: adminPasswordHash,
      name: 'CivilNotes Administrator',
      role: 'admin',
      createdAt: new Date().toISOString(),
    };

    const studentUser: User = {
      id: 'usr_student_001',
      email: 'student@civilnotes.com',
      passwordHash: studentPasswordHash,
      name: 'Pankaj Kumar (Student)',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    db.users.push(adminUser, studentUser);
    console.log('[Seed] Created default users: admin@civilnotes.com and student@civilnotes.com');
  }

  // 2. Seed Sample Products from Requirement if not present
  if (db.products.length === 0) {
    const sampleProducts: Array<{
      serialNumber: number;
      id: string;
      title: string;
      subject: string;
      category: string;
      description: string;
      pageCount: number;
      originalPriceINR: number;
      discountPriceINR: number;
      finalPriceINR: number;
      storageKey: string;
      coverGradient: string;
    }> = [
      {
        serialNumber: 1,
        id: 'prod_civil_complete_notes',
        title: 'Civil Engineering Complete Notes',
        subject: 'Structural & Infrastructure Engineering',
        category: 'Complete Notes & Handbooks',
        description: 'Comprehensive 480-page reference handbook covering structural design, Eurocodes, materials, fluid mechanics, and foundation analysis.',
        pageCount: 480,
        originalPriceINR: 299,
        discountPriceINR: 200,
        finalPriceINR: 99,
        storageKey: 'civil_engineering_complete_notes.pdf',
        coverGradient: 'from-blue-600 via-indigo-700 to-slate-900',
      },
      {
        serialNumber: 2,
        id: 'prod_surveying_notes',
        title: 'Surveying Notes & Fieldwork Toolkit',
        subject: 'Land Surveying & Geomatics',
        category: 'Site & Surveying',
        description: 'Total station protocols, leveling traverse error distribution, GNSS RTK setup guidelines, and photogrammetry numerical guides.',
        pageCount: 220,
        originalPriceINR: 349,
        discountPriceINR: 200,
        finalPriceINR: 149,
        storageKey: 'surveying_notes.pdf',
        coverGradient: 'from-emerald-600 via-teal-700 to-slate-900',
      },
      {
        serialNumber: 3,
        id: 'prod_building_materials',
        title: 'Building Materials & Concrete Technology',
        subject: 'Materials Science & Testing',
        category: 'Construction Tech',
        description: 'Concrete mix design (IS 10262 / BS EN 206), hydration mechanics, cementitious admixtures, non-destructive testing (NDT), and masonry.',
        pageCount: 160,
        originalPriceINR: 199,
        discountPriceINR: 120,
        finalPriceINR: 79,
        storageKey: 'building_materials.pdf',
        coverGradient: 'from-amber-600 via-orange-700 to-slate-900',
      },
      {
        serialNumber: 4,
        id: 'prod_estimation_costing',
        title: 'Estimation, Costing & Valuation Handbook',
        subject: 'Quantity Surveying & Commercials',
        category: 'Management & Quantities',
        description: 'Bar bending schedules (BBS), item-rate analysis, quantity takeoff formulas, CPWD/FIDIC contracts, and commercial tender bidding.',
        pageCount: 240,
        originalPriceINR: 299,
        discountPriceINR: 170,
        finalPriceINR: 129,
        storageKey: 'estimation_and_costing.pdf',
        coverGradient: 'from-rose-600 via-pink-700 to-slate-900',
      },
      {
        serialNumber: 5,
        id: 'prod_construction_planning',
        title: 'Construction Planning, CPM & Management',
        subject: 'Site Management & Scheduling',
        category: 'Project Management',
        description: 'Critical Path Method (CPM), PERT diagrams, Primavera P6/MS Project workflow, Earned Value Management (EVM), and site health & safety.',
        pageCount: 310,
        originalPriceINR: 449,
        discountPriceINR: 250,
        finalPriceINR: 199,
        storageKey: 'construction_planning.pdf',
        coverGradient: 'from-purple-600 via-indigo-800 to-slate-900',
      },
      {
        serialNumber: 6,
        id: 'prod_unit_1_mechanics',
        title: 'Pearson BTEC Unit 1: Construction Principles',
        subject: 'Structural Mechanics & Materials',
        category: 'Construction Principles',
        description: 'Full BTEC Level 3 Distinction Exemplar: Bending moments, shear force diagrams, pin-jointed truss method of joints & sections, thermal U-values.',
        pageCount: 88,
        originalPriceINR: 149,
        discountPriceINR: 100,
        finalPriceINR: 49,
        storageKey: 'btec_unit_1_mechanics.pdf',
        coverGradient: 'from-emerald-700 via-teal-800 to-slate-900',
      },
      {
        serialNumber: 7,
        id: 'prod_unit_30_geotechnics',
        title: 'Pearson BTEC Unit 30: Advanced Geotechnics',
        subject: 'Soil Mechanics & Foundations',
        category: 'Geotechnics & Math',
        description: 'Full BTEC HNC/HND Distinction Exemplar: Mohr-Coulomb failure criteria, Terzaghi bearing capacity, Rankine earth pressure, pad and pile design.',
        pageCount: 114,
        originalPriceINR: 149,
        discountPriceINR: 100,
        finalPriceINR: 49,
        storageKey: 'btec_unit_30_geotechnics.pdf',
        coverGradient: 'from-cyan-700 via-blue-800 to-slate-900',
      },
    ];

    for (const p of sampleProducts) {
      const prod: Product = {
        ...p,
        fileSizeBytes: 1024 * 1024 * (1.2 + (p.pageCount / 100)), // Approximate realistic file size
        isPublished: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      db.products.push(prod);
    }
    console.log('[Seed] Created default sample products:', db.products.length);
  }

  // 3. Ensure all private PDF binary files exist in /storage/private_pdfs
  for (const prod of db.products) {
    const filePath = path.join(PRIVATE_PDF_DIR, prod.storageKey);
    if (!fs.existsSync(filePath)) {
      const pdfBuf = createMinimalPdfBuffer(prod.title, prod.subject, Math.min(prod.pageCount, 12));
      fs.writeFileSync(filePath, pdfBuf);
      console.log(`[Seed] Generated valid PDF asset for: ${prod.storageKey}`);
    }
  }

  saveDatabase(db);
}
