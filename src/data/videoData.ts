import { CivilVideo } from '../types';

export const CIVIL_VIDEOS: CivilVideo[] = [
  {
    id: 'vid-unit-1-sfd',
    title: 'Unit 1: SFD & BMD Step-by-Step Beam Mechanics Masterclass',
    unitCodeTag: 'Unit 1 • L3',
    duration: '48:30 min',
    quality: '1080p Full HD • 60fps',
    fileSize: '412 MB',
    tutorName: 'Er. Rajesh Varma (Chartered Structural Eng.)',
    description: 'Comprehensive derivation and calculation walkthrough for point loads, uniformly distributed loads (UDL), and cantilever reactions. Includes complete Pearson Distinction calculation template.',
    priceINR: 49,
    thumbnailColor: 'from-blue-600 to-indigo-900',
    topicsCovered: [
      'Simply Supported Beams with UDL & Point Loads',
      'Point of Contraflexure Derivation',
      'Maximum Bending Moment Location Formulas',
      'Stress vs Strain & Youngs Modulus Verification'
    ]
  },
  {
    id: 'vid-unit-2-surveying',
    title: 'Unit 2: Total Station Traversing & Closed Loop Error Balancing',
    unitCodeTag: 'Unit 2 - L3',
    duration: '36:15 min',
    quality: '1080p Full HD',
    fileSize: '320 MB',
    tutorName: 'Prof. David Thorne (RICS Accredited Surveyor)',
    description: 'On-site video recording of total station setup, electronic distance measurement (EDM), collimation adjustment, and Bowditch compass rule correction sheet.',
    priceINR: 49,
    thumbnailColor: 'from-emerald-600 to-teal-900',
    topicsCovered: [
      'Total Station Centering & Leveling in Field',
      'Bowditch Rule Error Adjustment in Excel',
      'Rise & Fall Levelling Field-book Verification',
      'Converting Coordinates to AutoCAD DXF'
    ]
  },
  {
    id: 'vid-unit-3-piling',
    title: 'Unit 3: Deep Piling & Retaining Substructures Construction',
    unitCodeTag: 'Unit 3 • L3',
    duration: '42:50 min',
    quality: '1080p Full HD',
    fileSize: '385 MB',
    tutorName: 'Er. Alistair MacIntyre (Geotechnical Lead)',
    description: 'Live excavation and piling rig operations: continuous flight auger (CFA), sheet piling, dewatering trench systems, and BS 8004 compliant foundation design calculations.',
    priceINR: 49,
    thumbnailColor: 'from-amber-600 to-orange-900',
    topicsCovered: [
      'CFA & Bored Piling Operations on Live Site',
      'Secant & Contiguous Piled Retaining Walls',
      'Groundwater Cut-off & Well-point Dewatering',
      'Pearson Merit & Distinction Substructure Briefs'
    ]
  },
  {
    id: 'vid-unit-30-soil-lab',
    title: 'Unit 30: Triaxial & Direct Shear Box Soil Mechanics Laboratory Test',
    unitCodeTag: 'Unit 30 • HNC',
    duration: '34:20 min',
    quality: '1080p Full HD',
    fileSize: '298 MB',
    tutorName: 'Dr. Sunita Patel (PhD Geotechnical Eng.)',
    description: 'Complete laboratory demonstration following BS EN ISO 17892: Mohr-Coulomb failure envelopes, cohesion (c) and angle of internal friction (phi) determination.',
    priceINR: 49,
    thumbnailColor: 'from-amber-700 to-stone-900',
    topicsCovered: [
      'Triaxial UU & CU Test Step-by-Step Procedure',
      'Mohr Circle Construction & Failure Envelope',
      'Atterberg Limits (Liquid & Plastic Limit) Demo',
      'Terzaghi 1D Consolidation Calculation Suite'
    ]
  },
  {
    id: 'vid-unit-29-macaulay',
    title: 'Unit 29: Macaulays Method for Beam Slope & Deflection Calculations',
    unitCodeTag: 'Unit 29 • HND',
    duration: '52:10 min',
    quality: '1080p Full HD',
    fileSize: '460 MB',
    tutorName: 'Dr. Kevin O’Connor (Senior Civil Lecturer)',
    description: 'High-level calculus and integration techniques for complex beam bending equations. Macaulay bracket integration rules and boundary condition evaluations.',
    priceINR: 49,
    thumbnailColor: 'from-indigo-600 to-purple-950',
    topicsCovered: [
      'Double Integration & Macaulays Discontinuity Functions',
      'Cantilever & Overhanging Beam Deflection',
      'Integration Constants Boundary Resolution',
      'HND Level 5 Distinction Exemplar Walkthrough'
    ]
  },
  {
    id: 'vid-unit-4-safety-cdm',
    title: 'Unit 4: CDM 2015 Regulations & Dynamic Risk Assessment in Practice',
    unitCodeTag: 'Unit 4 • L3',
    duration: '28:45 min',
    quality: '1080p Full HD',
    fileSize: '245 MB',
    tutorName: 'Marcus Bell (NEBOSH & IOSH Certified)',
    description: 'Real construction hazard walkover: working at height, deep trench collapses, plant movement, and developing Pre-Construction Information (PCI) and Construction Phase Plans.',
    priceINR: 49,
    thumbnailColor: 'from-purple-600 to-slate-900',
    topicsCovered: [
      'CDM 2015 Dutyholder Responsibilities (Client, PD, PC)',
      '5x5 Risk Assessment Matrix & Hierarchy of Control',
      'COSHH Assessment & Silica Dust Protocols',
      'RAMS (Risk Assessment & Method Statement) Generation'
    ]
  }
];

export const UNIVERSAL_VIDEO_PRICE = 49;
