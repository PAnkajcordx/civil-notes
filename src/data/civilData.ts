import { BTECUnit, CourseworkToolkit, PYQResource, SubjectDirectory, CommunityDiscussion } from '../types';

export const BTEC_UNITS: BTECUnit[] = [
  {
    id: 'unit-1',
    unitNumber: 1,
    level: 'Level 3',
    levelType: 'Mandatory Unit',
    tag: 'Pearson Spec Aligned',
    title: 'Unit 1: Construction Principles (Structural Mechanics & Materials)',
    description: 'Fundamental structural behavior, bending moments, shear force envelopes, stress/strain relationships, and deflection analysis.',
    unitCodeTag: 'Unit 1 • L3',
    badgeType: 'blue',
    exemplarStatus: 'Distinction Exemplar Attached',
    category: 'Construction Principles',
    credits: 10,
    guidedLearningHours: 60,
    specificationCode: 'Y/615/1387',
    previewContent: {
      overview: 'Covers fundamental mechanics principles including simply supported beams, cantilever loading, axial tension and compression, modulus of elasticity (Young\'s Modulus E), and material testing according to British Standards.',
      learningOutcomes: [
        'LO1: Examine structural mechanics principles for statically determinate beams and frames',
        'LO2: Investigate material behavior under tension, compression, and shear loading',
        'LO3: Calculate bending moments, shear forces, and normal stresses',
        'LO4: Assess structural timber, steel, and concrete properties against Eurocode standards'
      ],
      gradingCriteria: {
        pass: 'P1: Calculate reactions and produce SFD and BMD for simply supported beam with UDL and point load.',
        merit: 'M1: Compare elastic deflection with maximum allowable deflection limit (L/250) for steel S275 section.',
        distinction: 'D1: Evaluate structural efficiency of Universal Beam (UB 406x178x67) versus timber glulam beam under combined serviceability and ultimate limit states.'
      },
      sampleCalculations: [
        'Max Bending Moment for UDL: M_max = (w * L²) / 8 = (24 kN/m * 6m²) / 8 = 108.0 kN·m',
        'Elastic Modulus Requirement: Z_req = M_Ed / f_yd = 108.0×10⁶ N·mm / 275 N/mm² = 392.7×10³ mm³',
        'Shear Force at Support A: V_A = (w * L) / 2 + P * (b / L) = (24 * 6)/2 + 45*(2/6) = 72 + 15 = 87 kN',
        'Mid-span Deflection: δ = (5 * w * L⁴) / (384 * E * I) = (5 * 24 * 6000⁴) / (384 * 210000 * 243000000) = 8.42 mm (< 24 mm limit: PASSED)'
      ],
      standardCodes: ['BS EN 1990: Basis of Structural Design', 'BS EN 1993-1-1: Steel Structures', 'BS 5950 Part 1']
    }
  },
  {
    id: 'unit-2',
    unitNumber: 2,
    level: 'Level 3',
    levelType: 'Core Unit',
    tag: 'Assignment Guidance',
    title: 'Unit 2: Construction Design & Surveying Procedures',
    description: 'Levelling field books, rise and fall calculations, total station traversing, CAD drafting standards, and topographic contouring.',
    unitCodeTag: 'Unit 2 - L3',
    badgeType: 'green',
    exemplarStatus: 'Full Unit Pack',
    category: 'Site & Surveying',
    credits: 10,
    guidedLearningHours: 60,
    specificationCode: 'D/615/1388',
    previewContent: {
      overview: 'Focuses on land surveying instrumentation, field booking protocols, collimation error checks (Two-Peg Test), closed polygonal traverse balancing with Bowditch rule, and site contour interpolation.',
      learningOutcomes: [
        'LO1: Conduct precision differential levelling using automatic levels and digital barcodes',
        'LO2: Perform traverse fieldwork, angular reduction, and coordinate computation',
        'LO3: Apply CAD drafting conventions (BS 8888 & BS 1192 BIM protocols)',
        'LO4: Execute site setting-out for ground beams and drainage sewer gradients'
      ],
      gradingCriteria: {
        pass: 'P2: Complete 10-station levelling reduction using both Rise & Fall and HPC methods with arithmetic checks.',
        merit: 'M2: Determine closing error of closed loop traverse and compute linear fractional misclosure (1 in 5000 standard).',
        distinction: 'D2: Justify total station coordinate setting-out versus GNSS-RTK for high-tolerance urban superstructure construction.'
      },
      sampleCalculations: [
        'Rise & Fall Arithmetic Check: Σ BS - Σ FS = Σ Rise - Σ Fall = Last RL - First RL',
        'Fieldwork result: 14.825 - 14.821 = +0.004 m (within allowable ±5√K mm = ±5√0.8 = ±4.47 mm)',
        'Bowditch Correction: C_east = - (Total Easting Error) * (Leg Length / Total Perimeter)',
        'Gradient Slope Stake: Fall = Distance * (1 / Gradient) = 48.0m * (1/80) = 0.600m invert drop'
      ],
      standardCodes: ['RICS Guidelines for Survey Measurement', 'BS 5606: Guide to Accuracy in Building']
    }
  },
  {
    id: 'unit-3',
    unitNumber: 3,
    level: 'Level 3',
    levelType: 'Mandatory Unit',
    tag: 'Coursework Template',
    title: 'Unit 3: Construction Technology & Substructures',
    description: 'Foundation design (strip, pad, raft, and piled), earthworks retaining systems, drainage installation, and deep basement shoring.',
    unitCodeTag: 'Unit 3 • L3',
    badgeType: 'amber',
    exemplarStatus: 'Distinction Exemplar Attached',
    category: 'Construction Tech',
    credits: 10,
    guidedLearningHours: 60,
    specificationCode: 'H/615/1389',
    previewContent: {
      overview: 'Detailed exploration of structural sub-structures, excavation safety, dewatering methods, contiguous bored piling, diaphragm walls, and radon/moisture ground barrier details.',
      learningOutcomes: [
        'LO1: Analyze geological ground investigation reports (SPT, CPT, plasticity index)',
        'LO2: Select optimal foundation types for varying structural loads and soil profiles',
        'LO3: Detail substructure drainage, radon barrier membranes, and tanking systems',
        'LO4: Evaluate modern methods of construction (MMC) and precast foundation pads'
      ],
      gradingCriteria: {
        pass: 'P3: Identify ground conditions requiring deep piled foundations versus shallow reinforced strip footing.',
        merit: 'M3: Compare water ingress mitigation between Type A (barrier), Type B (structurally integral), and Type C (drained cavity) basement waterproofing.',
        distinction: 'D3: Formulate a comprehensive substructure strategy for a 5-storey hospital on desiccated high-shrinkage London Clay.'
      },
      sampleCalculations: [
        'Required Pad Footing Area: A_req = (P_col + P_footing) / q_allow = (1200 kN * 1.10) / 180 kPa = 7.33 m²',
        'Square Footing Dimension: B = √7.33 = 2.71 m -> Adopt 2.75m × 2.75m × 0.6m reinforced pad',
        'Punching Shear Perimeter at 2d from column face: u_1 = 2(c_x + c_y) + 4πd',
        'Safety factor against overturning: FOS = Σ M_resisting / Σ M_overturning = 3450 / 1680 = 2.05 (> 2.0: ADEQUATE)'
      ],
      standardCodes: ['BS 8004: Code of Practice for Foundations', 'BS 8102: Protection of Below Ground Structures against Water']
    }
  },
  {
    id: 'unit-4',
    unitNumber: 4,
    level: 'Level 3',
    levelType: 'Core Unit',
    tag: 'CDM 2015 Regs',
    title: 'Unit 4: Health, Safety & Welfare in Construction',
    description: 'CDM Regulations 2015, dynamic risk assessments, COSHH evaluations, method statements, and site safety inductions.',
    unitCodeTag: 'Unit 4 • L3',
    badgeType: 'purple',
    exemplarStatus: 'Assignment Guidance',
    category: 'Construction Principles',
    credits: 10,
    guidedLearningHours: 60,
    specificationCode: 'K/615/1390',
    previewContent: {
      overview: 'Comprehensive statutory health and safety principles under the Health and Safety at Work etc. Act 1974 and Construction (Design and Management) Regulations 2015.',
      learningOutcomes: [
        'LO1: Interpret duty holder responsibilities under CDM 2015 (Client, Principal Designer, Principal Contractor)',
        'LO2: Formulate dynamic site risk assessments with quantitative 5x5 severity-likelihood matrices',
        'LO3: Devise safe systems of work (RAMS) for high-risk operations (confined space, deep trenching, crane lifts)',
        'LO4: Audit environmental control measures (silt runoff, noise/vibration limits, dust suppression)'
      ],
      gradingCriteria: {
        pass: 'P4: Outline legal liabilities for safety violations resulting in HSE enforcement notices (Improvement & Prohibition).',
        merit: 'M4: Contrast hierarchy of control effectiveness (Elimination > Substitution > Engineering > Admin > PPE) for crystalline silica dust exposure.',
        distinction: 'D4: Synthesize a Pre-Construction Information (PCI) document and Construction Phase Plan (CPP) for a contaminated brownfield infrastructure scheme.'
      },
      sampleCalculations: [
        'Risk Rating Formula: RR = Likelihood (1-5) × Severity (1-5)',
        'Trench Collapse Initial: Likelihood 4 × Severity 5 = 20 (UNACCEPTABLE - STOP WORK)',
        'With Trench Box Shoring & Edge Protection: Likelihood 1 × Severity 4 = 4 (TOLERABLE)',
        'Safe Working Load (SWL) for lifting sling at 60° angle: WLL_effective = WLL_vertical × cos(30°) = 5.0t × 0.866 = 4.33t'
      ],
      standardCodes: ['HSE CDM 2015 L153 Guidance', 'COSHH Regulations 2002', 'Lifting Operations (LOLER) 1998']
    }
  },
  {
    id: 'unit-29',
    unitNumber: 29,
    level: 'Level 5',
    levelType: 'HND Specialist',
    tag: 'Calculus & Matrices',
    title: 'Unit 29: Further Mathematics in Civil Engineering',
    description: 'Differential and integral calculus applications in beam bending, probability distributions in flood hydrology, and matrix structural stiffness.',
    unitCodeTag: 'Unit 29 • HND',
    badgeType: 'indigo',
    exemplarStatus: 'Distinction Exemplar Attached',
    category: 'Geotechnics & Math',
    credits: 15,
    guidedLearningHours: 60,
    specificationCode: 'R/615/1410',
    previewContent: {
      overview: 'Advanced analytical methods including Macauley’s notation for discontinuous beam loading, Laplace transforms for dynamic structural vibration, and Gaussian elimination for truss stiffness matrix solutions.',
      learningOutcomes: [
        'LO1: Solve differential equations for beam elastica: EI (d²y/dx²) = M(x)',
        'LO2: Implement matrix stiffness formulations for 2D pin-jointed and rigid-jointed portal frames',
        'LO3: Evaluate probability distributions (Gumbel, Log-Pearson Type III) for 1-in-100 year return storm surges',
        'LO4: Model heat dissipation in mass concrete pours using partial differential Fourier series'
      ],
      gradingCriteria: {
        pass: 'P29: Derive deflection equation for beam subjected to two point loads using Macaulay\'s method with singularity brackets.',
        merit: 'M29: Construct global stiffness matrix [K] from elemental stiffness matrices [k_e] for a 3-member truss and solve nodal displacements.',
        distinction: 'D29: Validate numerical Runge-Kutta 4th-order solution against analytical solution for second-order damped seismic harmonic response.'
      },
      sampleCalculations: [
        'Macaulay Equation: EI (d²y/dx²) = -R_A(x) + P₁⟨x - a₁⟩¹ + (w/2)⟨x - a₂⟩²',
        'Boundary Conditions: at x = 0, y = 0; at x = L, y = 0 -> Integrations yield constants C₁ and C₂',
        'Direct Stiffness Member: [k] = (EA/L) * [[1, 0, -1, 0], [0, 0, 0, 0], [-1, 0, 1, 0], [0, 0, 0, 0]]',
        'Gumbel Flood Frequency: x_T = μ + K_T * σ where K_T = -√6/π * [0.5772 + ln(ln(T/(T-1)))]'
      ],
      standardCodes: ['BS EN 1990 Annex D: Design Assisted by Testing', 'CIRIA C753 SuDS Manual (Hydrology)']
    }
  },
  {
    id: 'unit-30',
    unitNumber: 30,
    level: 'Level 4',
    levelType: 'HNC Mandatory',
    tag: 'Lab & Field Tests',
    title: 'Unit 30: Geotechnics & Soil Mechanics',
    description: 'Soil classification (BS EN ISO 14688), shear strength parameters (triaxial & direct shear), compaction curves, and slope stability.',
    unitCodeTag: 'Unit 30 • HNC',
    badgeType: 'orange',
    exemplarStatus: 'Distinction Exemplar Attached',
    category: 'Geotechnics & Math',
    credits: 15,
    guidedLearningHours: 60,
    specificationCode: 'Y/615/1411',
    previewContent: {
      overview: 'Fundamental soil behavior, phase relations (void ratio, porosity, degree of saturation), Terzaghi 1D consolidation theory, Mohr-Coulomb failure envelopes, and Rankine earth pressure coefficients.',
      learningOutcomes: [
        'LO1: Classify cohesive and granular soils based on Atterberg limits and particle size distribution (PSD)',
        'LO2: Determine shear strength parameters (c\', φ\') from consolidated undrained (CU) triaxial tests',
        'LO3: Evaluate primary consolidation settlement using oedometer compression index C_c',
        'LO4: Calculate factor of safety against circular slip surface failure using Bishop’s simplified method'
      ],
      gradingCriteria: {
        pass: 'P30: Calculate dry density, void ratio, and degree of saturation from laboratory proctor compaction data.',
        merit: 'M30: Plot Mohr circles at failure for 3 cell confining pressures (σ₃ = 100, 200, 400 kPa) and deduce effective cohesion c\' and friction angle φ\'.',
        distinction: 'D30: Design gravity retaining wall with Rankine active earth pressure and evaluate FOS against sliding, overturning, and bearing capacity failure.'
      },
      sampleCalculations: [
        'Mohr-Coulomb Criterion: τ_f = c\' + σ\'_n · tan(φ\') = 12 kPa + 145 kPa · tan(31°) = 12 + 87.1 = 99.1 kPa',
        'Rankine Active Earth Pressure Coefficient: K_a = (1 - sin(φ\')) / (1 + sin(φ\')) = (1 - 0.5) / (1 + 0.5) = 0.333',
        'Primary Settlement: S_c = [C_c / (1 + e₀)] · H · log₁₀[(σ\'_v0 + Δσ\'_v) / σ\'_v0] = [0.28 / 1.75] · 4000mm · log₁₀(2.15) = 212.8 mm',
        'Terzaghi Bearing Capacity: q_ult = c N_c + γ D_f N_q + 0.5 γ B N_γ'
      ],
      standardCodes: ['BS EN ISO 14688-1: Soil Identification and Classification', 'BS 1377: Methods of Test for Soils for Civil Engineering']
    }
  },
  {
    id: 'unit-6',
    unitNumber: 6,
    level: 'Level 3',
    levelType: 'Core Unit',
    tag: 'Pearson Spec Aligned',
    title: 'Unit 6: Applied Mathematics for Civil Engineering',
    description: 'Trigonometry for surveying triangles, volumes of earthwork mass haul diagrams, Simpson’s rule, and trapezoidal rule.',
    unitCodeTag: 'Unit 6 • L3',
    badgeType: 'blue',
    exemplarStatus: 'Full Unit Pack',
    category: 'Geotechnics & Math',
    credits: 10,
    guidedLearningHours: 60,
    specificationCode: 'T/615/1392',
    previewContent: {
      overview: 'Essential algebraic and geometric tools for construction estimators and quantity surveyors, including prismoidal volume formulas and Simpson\'s 1/3 rule.',
      learningOutcomes: [
        'LO1: Apply trigonometry to resolve oblique triangles using Sine & Cosine rules',
        'LO2: Compute cross-sectional earthwork cut & fill volumes using prismoidal method',
        'LO3: Graph mass-haul diagrams to optimize haulage distances and balance points'
      ],
      gradingCriteria: {
        pass: 'P6: Compute surface area of irregular boundary using Simpson\'s rule with 10 ordinates.',
        merit: 'M6: Calculate cut and fill volume for 250m road embankment using prismoidal correction.',
        distinction: 'D6: Formulate mass-haul optimization scheme minimizing free-haul and overhaul contractor expenses.'
      },
      sampleCalculations: [
        'Simpson\'s Rule Area: A = (d/3) * [(y₀ + yₙ) + 4Σ(even) + 2Σ(odd)]',
        'Prismoidal Volume: V = (L/6) * (A₁ + 4A_m + A₂)'
      ],
      standardCodes: ['CESMM4: Civil Engineering Standard Method of Measurement']
    }
  },
  {
    id: 'unit-8',
    unitNumber: 8,
    level: 'Level 4',
    levelType: 'HNC Mandatory',
    tag: 'Calculus & Matrices',
    title: 'Unit 8: Fluid Mechanics & Hydraulics in Civil Engineering',
    description: 'Hydrostatic pressure on submerged sluice gates, Bernoulli’s theorem, Darcy-Weisbach pipe friction, and Manning’s open channel flow.',
    unitCodeTag: 'Unit 8 • HNC',
    badgeType: 'indigo',
    exemplarStatus: 'Distinction Exemplar Attached',
    category: 'Structural & Design',
    credits: 15,
    guidedLearningHours: 60,
    specificationCode: 'M/615/1394',
    previewContent: {
      overview: 'Fluid mechanics fundamentals for civil engineers: water supply distribution networks, open stormwater channels, culvert sizing, and hydraulic jumps.',
      learningOutcomes: [
        'LO1: Calculate hydrostatic forces and center of pressure on vertical and inclined submerged surfaces',
        'LO2: Apply Bernoulli energy equations and continuity equations with head losses',
        'LO3: Size stormwater gravity pipes using Manning\'s equation and Colebrook-White charts'
      ],
      gradingCriteria: {
        pass: 'P8: Determine total hydrostatic thrust on 3m wide vertical sluice gate submerged to 4m depth.',
        merit: 'M8: Calculate head loss in 1200m ductile iron pipeline with valves and bends using Darcy-Weisbach.',
        distinction: 'D8: Design a trapezoidal flood relief channel meeting non-silting and non-scouring velocity constraints (0.6 m/s ≤ v ≤ 2.2 m/s).'
      },
      sampleCalculations: [
        'Total Hydrostatic Force: F = ρ * g * A * h_c = 1000 * 9.81 * (3 * 4) * 2 = 235.44 kN',
        'Manning Channel Discharge: Q = (1/n) * A * R^(2/3) * S^(1/2) = (1/0.015) * 5.4 * (0.84)^(2/3) * (0.002)^(1/2) = 14.3 m³/s'
      ],
      standardCodes: ['BS EN 752: Drain and Sewer Systems Outside Buildings']
    }
  }
];

export const COURSEWORK_TOOLKITS: CourseworkToolkit[] = [
  {
    id: 'l3-extended',
    title: 'L3 Extended Diploma',
    subtitle: '10 Core & Specialist Units Pack',
    badge: '180 Credits Spec',
    unitsIncluded: 'Units 1-10 complete with distinction coursework'
  },
  {
    id: 'hnc-complete',
    title: 'HNC Complete Pack',
    subtitle: 'Level 4 Civil Engineering Higher National',
    badge: '8 Mandatory Units',
    unitsIncluded: 'Units 1-8 HNC with site assignment portfolios'
  },
  {
    id: 'hnd-portfolio',
    title: 'HND Civil Portfolio',
    subtitle: 'Level 5 Advanced Specialist Bundle',
    badge: '16 Units Full Track',
    unitsIncluded: 'Units 29, 30, Eurocode design & BIM modules'
  },
  {
    id: 'pmd-matrix',
    title: 'Pass/Merit/Distinction',
    subtitle: 'Pearson Criteria Master Rubrics',
    badge: 'IV Verified',
    unitsIncluded: 'Grading matrix breakdown & examiner comments'
  }
];

export const PYQ_RESOURCES: PYQResource[] = [
  {
    id: 'ssc-je-civil',
    title: 'SSC JE Civil PYQ',
    category: 'Civil Engineering Solved Papers',
    questionsCount: 4500,
    yearRange: '2012 - 2024'
  },
  {
    id: 'complete-bundle',
    title: 'Complete Bundle',
    category: 'All Subjects Formula & PYQ Master',
    questionsCount: 12000,
    yearRange: 'Comprehensive'
  },
  {
    id: 'ssc-mech',
    title: 'SSC Mechanical PYQ',
    category: 'Mechanical Engineering Papers',
    questionsCount: 3800,
    yearRange: '2014 - 2024'
  },
  {
    id: 'ssc-elec',
    title: 'SSC Electrical PYQ',
    category: 'Electrical Engineering Papers',
    questionsCount: 3600,
    yearRange: '2014 - 2024'
  }
];

export const SUBJECT_DIRECTORIES: SubjectDirectory[] = [
  {
    id: 'structural',
    name: 'Structural Mechanics & Analysis',
    iconName: 'Building2',
    unitsCount: 4,
    topics: ['Bending Moment & Shear Envelopes', 'Truss Analysis (Method of Joints/Sections)', 'Macaulay Deflection Method', 'Eurocode 2 & 3 Design Tables'],
    keyFormulas: ['M_max = wL²/8', 'σ = My/I', 'τ = VQ/Ib', 'δ = 5wL⁴/(384EI)'],
    notesAvailable: 42
  },
  {
    id: 'geotechnics',
    name: 'Geotechnics & Soil Mechanics',
    iconName: 'Layers',
    unitsCount: 3,
    topics: ['Soil Classification BS EN ISO 14688', 'Direct Shear & Triaxial CU Tests', 'Terzaghi 1D Consolidation', 'Rankine Earth Pressure'],
    keyFormulas: ['τ = c\' + σ\'·tan(φ\')', 'K_a = (1-sinφ)/(1+sinφ)', 'S_c = [Cc/(1+e₀)]·H·log(Δσ)'],
    notesAvailable: 36
  },
  {
    id: 'surveying',
    name: 'Surveying & Geomatics',
    iconName: 'Compass',
    unitsCount: 2,
    topics: ['Rise & Fall / Collimation Levelling', 'Total Station Coordinate Traversing', 'Bowditch Rule Correction', 'GNSS-RTK Site Setting-Out'],
    keyFormulas: ['ΣBS - ΣFS = ΣRise - ΣFall', 'Closing Error = √(ΔE² + ΔN²)', 'Misclosure ≤ ±5√K mm'],
    notesAvailable: 28
  },
  {
    id: 'hydraulics',
    name: 'Fluid Mechanics & Water Resources',
    iconName: 'Droplets',
    unitsCount: 3,
    topics: ['Hydrostatic Pressure on Dams', 'Bernoulli Pipe Head Losses', 'Manning Open Channel Equation', 'Hydraulic Jump Energy Dissipation'],
    keyFormulas: ['F = ρ·g·A·h_c', 'h_f = (f·L·v²)/(2·g·D)', 'Q = (1/n)·A·R^(2/3)·S^(1/2)'],
    notesAvailable: 31
  },
  {
    id: 'construction-tech',
    name: 'Construction Technology & Materials',
    iconName: 'Hammer',
    unitsCount: 4,
    topics: ['Pad, Strip, Raft & Bored Piles', 'Basement Tanking Types A, B, C', 'Concrete Mix Proportioning C25/30', 'Steel Connection Detailing'],
    keyFormulas: ['A_pad = P_total / q_allowable', 'f_ck = f_cm - 8 N/mm²', 'Water-Cement Ratio ≤ 0.50'],
    notesAvailable: 38
  },
  {
    id: 'health-safety',
    name: 'Site Management & CDM 2015',
    iconName: 'ShieldAlert',
    unitsCount: 2,
    topics: ['CDM 2015 Duty Holders', 'RAMS & Safe Systems of Work', 'COSHH & Hazardous Chemical Audits', 'Trench Shoring & Edge Barriers'],
    keyFormulas: ['Risk = Likelihood × Severity', 'SWL = WLL × cos(θ)', 'Excavation Shoring Depth ≥ 1.2m'],
    notesAvailable: 22
  }
];

export const COMMUNITY_DISCUSSIONS: CommunityDiscussion[] = [
  {
    id: 'disc-1',
    author: 'Liam Davies',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    unitTag: 'Unit 1 • L3',
    title: 'Internal Verification feedback on Point Load Shear Force Diagram step-off',
    excerpt: 'My assessor noted that on beam with 45kN point load at 2.5m, the shear force diagram must show vertical jump matching exactly 45kN. Exemplar uploaded helps clarity!',
    replies: 18,
    views: 420,
    timeAgo: '2 hours ago',
    verifiedByTutor: true
  },
  {
    id: 'disc-2',
    author: 'Aisha Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    unitTag: 'Unit 30 • HNC',
    title: 'Triaxial Test: effective stress cohesion intercept c\' vs zero for NC clay?',
    excerpt: 'In the Distinction criterion D30, when plotting Mohr circle envelope for normally consolidated clay, should we force the tangent through origin or accept 4 kPa scatter?',
    replies: 24,
    views: 890,
    timeAgo: '5 hours ago',
    verifiedByTutor: true
  },
  {
    id: 'disc-3',
    author: 'Callum Wright',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    unitTag: 'Unit 2 - L3',
    title: 'Two-Peg Test calculation sheet template verified against RICS standards',
    excerpt: 'Shared a clean PDF levelling table that passed IV without queries. Includes intermediate sight reduction column and error check formulas.',
    replies: 31,
    views: 1250,
    timeAgo: '1 day ago',
    verifiedByTutor: true
  }
];
