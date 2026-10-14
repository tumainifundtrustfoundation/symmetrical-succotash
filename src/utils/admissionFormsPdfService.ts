import { jsPDF } from 'jspdf';

// Institutional Colors: Deep Navy, Catholic Emerald, Gold/Amber, Slate
const DEEP_NAVY: [number, number, number] = [16, 42, 67];
const EMERALD: [number, number, number] = [6, 78, 59];
const AMBER: [number, number, number] = [201, 162, 39];
const SLATE_DARK: [number, number, number] = [30, 41, 59];
const SLATE_MUTED: [number, number, number] = [100, 116, 139];
const BG_LIGHT: [number, number, number] = [248, 250, 252];

export interface AdmissionFormPdfParams {
  studentName?: string;
  applicationNumber?: string;
  dateOfBirth?: string;
  gender?: 'M' | 'F' | string;
  formLevel?: string;
  academicYear?: string;
  parentName?: string;
  parentPhone?: string;
  parentAddress?: string;
  primarySchool?: string;
  psleNumber?: string;
}

/**
 * 1. OFFICIAL STUDENT ADMISSION APPLICATION FORM (A4 Portrait)
 */
export function generateStudentAdmissionFormPdfDoc(params?: AdmissionFormPdfParams): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Frame borders
  doc.setDrawColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.setLineWidth(0.8);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - margin * 2 + 4);
  doc.setDrawColor(AMBER[0], AMBER[1], AMBER[2]);
  doc.setLineWidth(0.3);
  doc.rect(margin - 0.8, margin - 0.8, contentWidth + 1.6, pageHeight - margin * 2 + 1.6);

  // Top Header Banner
  doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.rect(margin, margin, contentWidth, 26, 'F');

  // Header Titles
  doc.setTextColor(253, 224, 71); // Gold
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI LA MOSHI • CATHOLIC DIOCESE OF MOSHI', pageWidth / 2, margin + 5.5, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI • MARANGU', pageWidth / 2, margin + 11.5, { align: 'center' });

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text(
    'S.L.P 361 MARANGU, MOSHI VIJIJINI • KITUO CHA NECTA: S0486 • SIMU: +255 782 558 127 / +255 752 717 191',
    pageWidth / 2,
    margin + 16.5,
    { align: 'center' }
  );

  // Title Ribbon
  doc.setFillColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.roundedRect(pageWidth / 2 - 65, margin + 19, 130, 6, 1.2, 1.2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'FOMU RASMI YA MAOMBI YA UDAHILI • STUDENT ADMISSION APPLICATION FORM',
    pageWidth / 2,
    margin + 23.2,
    { align: 'center' }
  );

  let y = margin + 29;

  // Passport Photo Box & Application Metadata Bar
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth - 36, 18, 1.5, 1.5, 'FD');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('MWAKA WA MASOMO / ACADEMIC YEAR:', margin + 3, y + 4.5);
  doc.text('KIDATO / CLASS LEVEL APPLIED:', margin + 70, y + 4.5);

  doc.setFontSize(8.5);
  doc.setTextColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.text(params?.academicYear || '2026 / 2027', margin + 3, y + 9);
  doc.text(params?.formLevel || 'Kidato cha Kwanza (Form One) & Uhamisho (Form 2 & 3)', margin + 70, y + 9);

  doc.setFontSize(6.8);
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('NAMBA YA MAOMBI / APPLICATION NO:', margin + 3, y + 14);
  doc.setTextColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.setFont('helvetica', 'bold');
  doc.text(params?.applicationNumber || 'UOM-ADM-2026/0486', margin + 55, y + 14);

  // Passport Box
  const photoX = pageWidth - margin - 32;
  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.roundedRect(photoX, y, 32, 36, 1.5, 1.5, 'D');
  doc.setLineDashPattern([], 0);
  doc.setFontSize(6);
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('PASIPOTI YA PICHA', photoX + 16, y + 15, { align: 'center' });
  doc.text('(Passport Size Photo)', photoX + 16, y + 18.5, { align: 'center' });
  doc.text('Sky Blue Background', photoX + 16, y + 22, { align: 'center' });

  y += 21;

  // SECTION 1: STUDENT BIODATA
  const drawSectionHeader = (sw: string, en: string, currentY: number) => {
    doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
    doc.rect(margin, currentY, contentWidth - 36, 4.5, 'F');
    doc.setFontSize(7.2);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`${sw} / ${en}`, margin + 3, currentY + 3.2);
    return currentY + 6.5;
  };

  y = drawSectionHeader('SEHEMU A: TAARIFA BINAFSI ZA MWANAFUNZI', 'SECTION A: STUDENT BIODATA', y);

  // Biodata fields grid
  const fieldH = 8.5;
  const colW = (contentWidth - 36) / 2;

  // Row 1: Full name
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('1. Jina Kamili la Mwanafunzi (Full Name):', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text(params?.studentName || '........................................................................................................', margin + 50, y);
  y += fieldH;

  // Row 2: DOB & Gender
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('2. Tarehe ya Kuzaliwa (Date of Birth):', margin, y);
  doc.text(params?.dateOfBirth || '....... / ....... / 20......', margin + 46, y);

  doc.text('3. Jinsia (Sex): [   ] Mvulana (Male)   [   ] Msichana (Female)', margin + colW + 2, y);
  y += fieldH;

  // Row 3: Religion & Nationality
  doc.text('4. Dini / Madhehebu (Religion): ........................................', margin, y);
  doc.text('5. Uraia (Nationality): .................................................', margin + colW + 2, y);
  y += fieldH + 2;

  // Row 4: Previous School & PSLE
  doc.text('6. Shule Aliyotoka (Primary / Previous School):', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(params?.primarySchool || '....................................................................................', margin + 55, y);
  y += fieldH;

  doc.setFont('helvetica', 'bold');
  doc.text('7. Namba ya Mtihani Darasa la Saba (PSLE No):', margin, y);
  doc.text(params?.psleNumber || 'PSLE: ..........................................................', margin + 56, y);
  doc.text('Alama / Wastani (Average Marks): ...............', margin + colW + 15, y);
  y += fieldH + 1;

  // Accommodation Choice (Bweni au Kutwa)
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y - 2, contentWidth, 7, 1, 1, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.text('8. Aina ya Malazi Iliyoombwa (Accommodation Requested):', margin + 3, y + 2.5);
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text('[   ] Bweni (Boarding Student - Full Board)', margin + 78, y + 2.5);
  doc.text('[   ] Kutwa (Day Student)', margin + 140, y + 2.5);
  y += 10;

  // SECTION 2: PARENT / GUARDIAN INFORMATION
  doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.rect(margin, y, contentWidth, 4.5, 'F');
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SEHEMU B: TAARIFA ZA MZAZI / MLEZI / SECTION B: PARENT OR GUARDIAN DETAILS', margin + 3, y + 3.2);
  y += 7.5;

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);

  doc.text('1. Jina Kamili la Mzazi / Mlezi (Parent/Guardian Name):', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text(params?.parentName || '................................................................................................', margin + 63, y);
  y += fieldH;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('2. Uhusiano na Mwanafunzi (Relationship): [   ] Baba   [   ] Mama   [   ] Mlezi (Guardian)', margin, y);
  y += fieldH;

  doc.text('3. Namba ya Simu ya Kiganjani (Phone Number):', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text(params?.parentPhone || '......................................................', margin + 55, y);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('Simu Mbadala (Emergency No): ............................................', margin + colW + 10, y);
  y += fieldH;

  doc.text('4. Makazi ya Sasa / Anwani ya Posta (Physical Address / P.O. Box):', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(params?.parentAddress || '.......................................................................................', margin + 74, y);
  y += fieldH;

  doc.setFont('helvetica', 'bold');
  doc.text('5. Wilaya na Mkoa wa Makazi (District & Region): .......................................................................................................', margin, y);
  y += 11;

  // SECTION 3: ATTACHMENTS CHECKLIST
  doc.setFillColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.rect(margin, y, contentWidth, 4.5, 'F');
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SEHEMU C: NYARAKA ZINAZOTAKIWA KUAMBATANISHWA (REQUIRED ATTACHMENTS)', margin + 3, y + 3.2);
  y += 7.5;

  const checklistItems = [
    'Nakala halisi iliyothibitishwa ya Cheti cha Kuzaliwa (Certified Birth Certificate - RITA).',
    'Nakala ya Matokeo ya Darasa la Saba (PSLE Result Slip) au Taarifa ya Maendeleo ya Shule ya Awali.',
    'Picha nne (4) ndogo za pasipoti za hivi karibuni zenye mandhari ya rangi ya bluu (Sky Blue).',
    'Fomu Rasmi ya Upimaji wa Afya (Medical Examination Form) iliyojazwa na kugongwa muhuri wa Hospitali.',
    'Fomu ya Ahadi na Makubaliano ya Mzazi/Mlezi kuhusu Nidhamu na Ada ya Shule.',
  ];

  checklistItems.forEach((item, idx) => {
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text(`[   ]  ${idx + 1}.  ${item}`, margin + 3, y);
    y += 5.2;
  });

  y += 3;

  // SECTION 4: DECLARATIONS (TAMKO LA MWOMBAJI & MZAZI)
  doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.rect(margin, y, contentWidth, 4.5, 'F');
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SEHEMU D: TAMKO LA MWOMBAJI NA MZAZI/MLEZI (DECLARATIONS)', margin + 3, y + 3.2);
  y += 7.5;

  doc.setFontSize(6.2);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text(
    'Mimi ninayeomba nafasi hii ninathibitisha kuwa taarifa zote nilizotoa hapo juu ni za kweli na sahihi. Nikikubaliwa kujiunga na Shule ya Sekondari Uomboni, ninaahidi kufuata sheria zote, kanuni za shule, heshima ya kiroho, na bidii ya kitaaluma.',
    margin + 2,
    y,
    { maxWidth: contentWidth - 4 }
  );
  y += 9;

  // Signature lines
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('Sahihi ya Mwanafunzi (Student Signature): ....................................', margin + 2, y);
  doc.text('Tarehe (Date): ......./......./20......', margin + 120, y);
  y += 8;

  doc.text('Sahihi ya Mzazi/Mlezi (Parent Signature): ........................................', margin + 2, y);
  doc.text('Tarehe (Date): ......./......./20......', margin + 120, y);
  y += 11;

  // SECTION 5: OFFICIAL SCHOOL USE ONLY (KWA MATUMIZI YA SHULE TU)
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 32, 1.5, 1.5, 'FD');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.text('KWA MATUMIZI YA KAMATI YA UDAHILI NA OFISI YA MKUU WA SHULE (FOR OFFICIAL USE ONLY)', margin + 3, y + 5);

  doc.setFontSize(6.6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text('Uamuzi wa Kamati ya Udahili:   [   ] IMETHIBITISHWA (Accepted)     [   ] HAIJATHIBITISHWA (Rejected)', margin + 3, y + 10.5);
  doc.text('Kidato Alichopangiwa (Allocated Class): ....................................   Mkondo (Stream): ....................................', margin + 3, y + 16);
  doc.text('Namba Rasmi ya Usajili Shuleni (Admission No): ....................................   Tarehe ya Kuripoti: ......./......./20......', margin + 3, y + 21.5);

  doc.setFont('helvetica', 'bold');
  doc.text('Sahihi ya Mkuu wa Shule / Headmaster Signature: ................................................', margin + 3, y + 27.5);

  // Official Stamp Box
  const adminStampX = pageWidth - margin - 40;
  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([1.5, 1.5], 0);
  doc.rect(adminStampX, y + 4, 38, 25);
  doc.setLineDashPattern([], 0);
  doc.setFontSize(5.5);
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('MUHURI RASMI WA SHULE', adminStampX + 19, y + 14, { align: 'center' });
  doc.text('(Official School Stamp)', adminStampX + 19, y + 17.5, { align: 'center' });
  doc.text('NECTA S0486 • MARANGU', adminStampX + 19, y + 21, { align: 'center' });

  // Footer
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text(
    'OFFICIAL ADMISSION DOCUMENT • Shule ya Sekondari Uomboni (NECTA S0486) • Moshi – Marangu, Kilimanjaro',
    margin,
    pageHeight - 5
  );
  doc.text('Ukurasa 1 wa 1 (Page 1 of 1)', pageWidth - margin, pageHeight - 5, { align: 'right' });

  return doc;
}

export function downloadStudentAdmissionFormPdf(params?: AdmissionFormPdfParams) {
  const doc = generateStudentAdmissionFormPdfDoc(params);
  const fileName = params?.studentName
    ? `FOMU_YA_UDAHILI_${params.studentName.trim().replace(/\s+/g, '_').toUpperCase()}.pdf`
    : 'FOMU_YA_UDAHILI_UOMBONI_SECONDARY_2026_2027.pdf';
  doc.save(fileName);
}

/**
 * 2. PARENT / GUARDIAN INFORMATION & UNDERTAKING AGREEMENT FORM (A4 Portrait)
 */
export function generateParentGuardianFormPdfDoc(params?: AdmissionFormPdfParams): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Frame borders
  doc.setDrawColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.setLineWidth(0.8);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - margin * 2 + 4);
  doc.setDrawColor(AMBER[0], AMBER[1], AMBER[2]);
  doc.setLineWidth(0.3);
  doc.rect(margin - 0.8, margin - 0.8, contentWidth + 1.6, pageHeight - margin * 2 + 1.6);

  // Header Banner
  doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.rect(margin, margin, contentWidth, 25, 'F');

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI LA MOSHI • CATHOLIC DIOCESE OF MOSHI', pageWidth / 2, margin + 5.5, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI • MARANGU', pageWidth / 2, margin + 11.5, { align: 'center' });

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('S.L.P 361 MARANGU, MOSHI VIJIJINI • KITUO CHA NECTA: S0486', pageWidth / 2, margin + 16, { align: 'center' });

  // Ribbon
  doc.setFillColor(AMBER[0], AMBER[1], AMBER[2]);
  doc.roundedRect(pageWidth / 2 - 70, margin + 18.5, 140, 6, 1.2, 1.2, 'F');
  doc.setTextColor(16, 42, 67);
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'FOMU YA TAARIFA ZA MZAZI/MLEZI & MAAGANO YA MALEZI NA ADA (PARENT UNDERTAKING)',
    pageWidth / 2,
    margin + 22.7,
    { align: 'center' }
  );

  let y = margin + 29;

  // Student & Parent identification summary
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('JINA LA MWANAFUNZI (STUDENT NAME):', margin + 3, y + 5);
  doc.text('KIDATO / CLASS:', margin + 120, y + 5);

  doc.setFontSize(8.5);
  doc.setTextColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.text(params?.studentName || '................................................................................', margin + 3, y + 10);
  doc.text(params?.formLevel || 'Kidato cha 1 - 4', margin + 120, y + 10);

  doc.setFontSize(7);
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('JINA LA MZAZI / MLEZI:', margin + 3, y + 15);
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text(params?.parentName || '................................................................................', margin + 40, y + 15);
  y += 22;

  // SECTION 1: DETAILED PARENT / GUARDIAN CONTACTS
  doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.rect(margin, y, contentWidth, 4.5, 'F');
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SEHEMU YA KWANZA: MAWASILIANO YA WAZAZI / WALEZI (PRIMARY CONTACTS)', margin + 3, y + 3.2);
  y += 7.5;

  const contactsTable = [
    { role: 'Mzazi / Mlezi Mkuu (Primary Parent/Guardian):', phone: 'Simu Kuu: ............................................' },
    { role: 'Kazi / Shughuli ya Mzazi (Occupation): ............................................', phone: 'Barua Pepe (Email): ............................................' },
    { role: 'Mawasiliano ya Dharura (Emergency Contact Person):', phone: 'Simu ya Dharura: ............................................' },
    { role: 'Uhusiano wa Mtu wa Dharura (Relationship): ............................................', phone: 'Mahali / Mtaa Anapoishi: ............................................' },
  ];

  contactsTable.forEach((row) => {
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text(row.role, margin + 2, y);
    doc.text(row.phone, margin + 95, y);
    y += 6.5;
  });

  y += 3;

  // SECTION 2: COMMITMENT CLAUSES
  doc.setFillColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.rect(margin, y, contentWidth, 4.5, 'F');
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SEHEMU YA PILI: MAAGANO YA MZAZI / MLEZI (PARENTAL COMMITMENT & UNDERTAKING)', margin + 3, y + 3.2);
  y += 7.5;

  const clauses = [
    {
      title: '1. Maagano ya Ulipaji wa Ada (School Fees Undertaking):',
      desc: 'Ninaahidi kulipa ada na michango yote ya shule iliyoidhinishwa na Serikali na Bodi ya Shule kabla ya kuanza kwa kila muhula au kulingana na awamu zilizowekwa kwenye Maelekezo ya Kujiunga. Ninaelewa kuwa mwanafunzi hataruhusiwa darasani bila ada ya muhula husika kulipwa benki.',
    },
    {
      title: '2. Nidhamu na Malezi ya Kiroho (Discipline & Moral Upbringing):',
      desc: 'Ninakubali kwamba Shule ya Sekondari Uomboni inaendeshwa kwa maadili thabiti ya Kikatoliki ya sala, elimu na kazi (Prayer, Education, Work). Ninaahidi kumuasa mtoto wangu kufuata taratibu zote na sintatetea ukiukwaji wa sheria, utoro, uharibifu wa mali au utovu wa nidhamu.',
    },
    {
      title: '3. Vifaa Vilivyopigwa Marufuku (Prohibited Items Acceptance):',
      desc: 'Ninakiri na kuthibitisha kwamba nimeelewa marufuku kamili ya simu za mkononi, spika za bluetooth, hita za umeme na vifaa vyote vya kielektroniki. Endapo mtoto wangu atapatikana na kifaa chochote kilichopigwa marufuku, kifaa hicho kitataifishwa na hatua kali za kinidhamu zitachukuliwa.',
    },
    {
      title: '4. Afya na Matibabu ya Dharura (Medical Consent & Emergency Care):',
      desc: 'Ninatoa idhini kwa uongozi wa shule kumpatia mwanangu huduma ya kwanza na kumpeleka Hospitali au Kituo cha Afya kinachotambulika endapo ataugua au kupata dharura akiwa shuleni au bwenini, na ninajitolea kugharamia matibabu maalum kulingana na taratibu za afya.',
    },
  ];

  clauses.forEach((c) => {
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
    doc.text(c.title, margin + 2, y);
    y += 4;

    doc.setFontSize(6.2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text(c.desc, margin + 4, y, { maxWidth: contentWidth - 8, lineHeightFactor: 1.25 });
    y += 12;
  });

  y += 2;

  // SECTION 3: PARENT SIGNATURE & WITNESS
  doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.rect(margin, y, contentWidth, 4.5, 'F');
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('SEHEMU YA TATU: SAHIHI YA MZAZI/MLEZI NA SHAHIDI (SIGNATURE & WITNESS)', margin + 3, y + 3.2);
  y += 8;

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text(
    'Mimi niliyetia saini hapa chini ninathibitisha kuwa nimesoma na kuelewa maagano yote hapo juu, na ninaridhia mtoto wangu asajiliwe Uomboni Secondary School chini ya masharti haya.',
    margin + 2,
    y,
    { maxWidth: contentWidth - 4 }
  );
  y += 8;

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('Jina Kamili la Mzazi: ..............................................................', margin + 2, y);
  doc.text('Sahihi: ............................................   Tarehe: ......./......./20......', margin + 100, y);
  y += 8;

  doc.text('Jina la Shahidi (Witness Name): ............................................', margin + 2, y);
  doc.text('Sahihi ya Shahidi: .................................   Simu: ................................', margin + 100, y);
  y += 11;

  // School Acknowledgement Box
  doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
  doc.roundedRect(margin, y, contentWidth, 24, 1.5, 1.5, 'FD');
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.text('UTHIBITISHO WA OFISI YA MKUU WA SHULE (HEADMASTER VERIFICATION)', margin + 3, y + 5);

  doc.setFontSize(6.2);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text('Fomu hii imepokelewa na kuhifadhiwa katika jalada rasmi la mwanafunzi namba: ....................................', margin + 3, y + 10.5);
  doc.text('Jina la Afisa wa Udahili: ................................................................   Sahihi & Tarehe: ................................................', margin + 3, y + 16);

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text(
    'PARENT COMMITMENT RECORD • Shule ya Sekondari Uomboni (NECTA S0486) • Moshi – Marangu, Kilimanjaro',
    margin,
    pageHeight - 5
  );
  doc.text('Ukurasa 1 wa 1 (Page 1 of 1)', pageWidth - margin, pageHeight - 5, { align: 'right' });

  return doc;
}

export function downloadParentGuardianFormPdf(params?: AdmissionFormPdfParams) {
  const doc = generateParentGuardianFormPdfDoc(params);
  doc.save('FOMU_YA_MZAZI_MAAGANO_UOMBONI.pdf');
}

/**
 * 3. SCHOOL RULES AND DISCIPLINARY REGULATIONS (SHERIA NA KANUNI ZA SHULE)
 */
export function generateSchoolRulesAndRegulationsPdfDoc(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Frame borders
  doc.setDrawColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.setLineWidth(0.8);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - margin * 2 + 4);
  doc.setDrawColor(AMBER[0], AMBER[1], AMBER[2]);
  doc.setLineWidth(0.3);
  doc.rect(margin - 0.8, margin - 0.8, contentWidth + 1.6, pageHeight - margin * 2 + 1.6);

  // Top Header Banner
  doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.rect(margin, margin, contentWidth, 25, 'F');

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI LA MOSHI • CATHOLIC DIOCESE OF MOSHI', pageWidth / 2, margin + 5.5, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI • MARANGU', pageWidth / 2, margin + 11.5, { align: 'center' });

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('S.L.P 361 MARANGU, MOSHI VIJIJINI • KITUO CHA NECTA: S0486 • MOTTO: ELIMU, SALA NA KAZI', pageWidth / 2, margin + 16, { align: 'center' });

  // Ribbon
  doc.setFillColor(EMERALD[0], EMERALD[1], EMERALD[2]);
  doc.roundedRect(pageWidth / 2 - 75, margin + 18.5, 150, 6, 1.2, 1.2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.2);
  doc.setFont('helvetica', 'bold');
  doc.text(
    'SHERIA, KANUNI NA TARATIBU ZA SHULE • OFFICIAL SCHOOL RULES & CODE OF CONDUCT',
    pageWidth / 2,
    margin + 22.7,
    { align: 'center' }
  );

  let y = margin + 29;

  // Introduction
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text(
    'Shule ya Sekondari Uomboni inalenga kutoa malezi bora ya kiakili, kimaadili na kimwili. Sheria hizi zimewekwa ili kujenga nidhamu thabiti, mshikamano, na mazingira salama ya kujifunzia kwa wanafunzi wote (Bweni na Kutwa).',
    margin + 2,
    y,
    { maxWidth: contentWidth - 4 }
  );
  y += 9;

  const rules = [
    {
      num: '1',
      title: 'MAHUDHURIO NA NIDHAMU YA MUDA (PUNCTUALITY & ATTENDANCE)',
      desc: 'Kila mwanafunzi anapaswa kuwahi gwarideni (Assembly) saa 1:30 asubuhi. Utoro wa siku 3 bila taarifa rasmi ya daktari au kibali cha maandishi cha Mkuu wa Shule utasababisha kufukuzwa shule kulingana na miongozo ya Wizara ya Elimu.',
    },
    {
      num: '2',
      title: 'SARE RASMI ZA SHULE (OFFICIAL UNIFORMS & DRESS CODE)',
      desc: 'Mwanafunzi lazima avae sare rasmi zilizopigwa pasi, shati jeupe lililochomekewa, suruali/sketi ya heshima, viatu vya ngozi vyeusi vya kufunga kwa kamba na soksi sahihi. Uvaaji wa mavazi yasiyo ya shule au urembo wa kupindukia hauruhusiwi.',
    },
    {
      num: '3',
      title: 'MARUFUKU YA SIMU NA VIFAA VYA KIELEKTRONIKI (PROHIBITED ELECTRONIC DEVICES)',
      desc: 'Simu za mkononi, hita za kuchemshia maji, spika za bluetooth, na kamera zimepigwa marufuku kabisa kwa wanafunzi wote. Kifaa kitakachokamatwa kitataifishwa na mwanafunzi atafikishwa mbele ya Kamati ya Nidhamu kwa adhabu ya kusimamishwa au kufukuzwa.',
    },
    {
      num: '4',
      title: 'MALEZI YA KIROHO NA MAADILI MEMA (MORAL & SPIRITUAL VALUES)',
      desc: 'Shule inazingatia misingi ya Kikatoliki ya kujiheshimu, kumcha Mungu na kuheshimu wengine. Lugha ya matusi, ugomvi, ubaguzi, au dhihaka havitavumiliwa hata kidogo.',
    },
    {
      num: '5',
      title: 'UTUNZAJI WA MAZINGIRA NA MALI YA SHULE (PROPERTY & SANITATION)',
      desc: 'Kila mwanafunzi anawajibika kutunza madawati, vitabu vya maktaba, vifaa vya maabara, na usafi wa mazingira. Uharibifu wowote wa makusudi utalipwa na mzazi au mlezi mara dufu.',
    },
    {
      num: '6',
      title: 'HESHIMA KWA VIONGOZI, WALIMU NA WAFANYAKAZI (RESPECT & COURTESY)',
      desc: 'Heshima ya kiwango cha juu inahitajika kwa walimu wote, watumishi wasio walimu, na viranja wa shule. Kauli au vitendo vya dharau vitaadhibiwa vikali.',
    },
    {
      num: '7',
      title: 'TARATIBU ZA BWENI NA CHAKULA (BOARDING & DINING REGULATIONS)',
      desc: 'Kwa wanafunzi wa bweni, hairuhusiwi kutoka nje ya uzio wa shule bila kibali rasmi (Gate Pass). Wanafunzi wanapaswa kuzingatia muda wa ukimya (Lights Out) saa 4:00 usiku na kuhudhuria milo yote kwa mpangilio.',
    },
    {
      num: '8',
      title: 'MARUFUKU YA DAWA ZA KULEVYA, SIGARA NA POMBE (ZERO SUBSTANCE TOLERANCE)',
      desc: 'Kuvuta sigara, unywaji wa pombe, mirungi au utumiaji wa dawa za kulevya ni kosa la jinai na adhabu yake ni kufukuzwa shule papo hapo bila mjadala.',
    },
    {
      num: '9',
      title: 'MAHUSIANO NA NIDHAMU YA KIJINSIA (HEALTHY & SAFE BOUNDARIES)',
      desc: 'Wanafunzi wanapaswa kuishi kama ndugu katika Kristo. Mahusiano ya kimapenzi shuleni au bwenini yamepigwa marufuku kabisa kwa ajili ya kulinda mustakabali wa kitaaluma.',
    },
    {
      num: '10',
      title: 'BIDII YA KITAALUMA NA MITIHANI (ACADEMIC DEDICATION & EXAMS)',
      desc: 'Kila mwanafunzi anapaswa kufanya mazoezi yote, majaribio ya kila wiki, na mitihani ya NECTA kwa uaminifu. Udanganyifu katika mtihani utasababisha kufutiwa matokeo na adhabu kali.',
    },
  ];

  rules.forEach((r) => {
    doc.setFillColor(BG_LIGHT[0], BG_LIGHT[1], BG_LIGHT[2]);
    doc.roundedRect(margin, y, contentWidth, 14, 1, 1, 'F');

    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
    doc.text(`${r.num}.  ${r.title}`, margin + 3, y + 4);

    doc.setFontSize(5.8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
    doc.text(r.desc, margin + 4.5, y + 8, { maxWidth: contentWidth - 9, lineHeightFactor: 1.2 });

    y += 15.2;
  });

  y += 2;

  // Student & Parent acceptance
  doc.setFillColor(DEEP_NAVY[0], DEEP_NAVY[1], DEEP_NAVY[2]);
  doc.rect(margin, y, contentWidth, 4.5, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('MKATABA WA KUKUBALIANA NA SHERIA ZA SHULE (ACCEPTANCE CONTRACT)', margin + 3, y + 3.2);
  y += 7.5;

  doc.setFontSize(6.2);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(SLATE_DARK[0], SLATE_DARK[1], SLATE_DARK[2]);
  doc.text(
    'Mimi mwanafunzi pamoja na mzazi/mlezi wangu, tunathibitisha kuwa tumesoma kanuni hizi 10, na tunaahidi kuzingatia kikamilifu katika muda wote wa masomo shuleni Uomboni.',
    margin + 2,
    y
  );
  y += 7;

  doc.setFontSize(6.6);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text('Jina la Mwanafunzi: ................................................................   Sahihi: ....................................   Tarehe: ......./......./20......', margin + 2, y);
  y += 6.5;
  doc.text('Jina la Mzazi/Mlezi: ................................................................   Sahihi: ....................................   Tarehe: ......./......./20......', margin + 2, y);

  // Footer
  doc.setFontSize(6);
  doc.setTextColor(SLATE_MUTED[0], SLATE_MUTED[1], SLATE_MUTED[2]);
  doc.text(
    'CODE OF CONDUCT • Shule ya Sekondari Uomboni (NECTA S0486) • Moshi – Marangu, Kilimanjaro, Tanzania',
    margin,
    pageHeight - 5
  );
  doc.text('Ukurasa 1 wa 1 (Page 1 of 1)', pageWidth - margin, pageHeight - 5, { align: 'right' });

  return doc;
}

export function downloadSchoolRulesAndRegulationsPdf() {
  const doc = generateSchoolRulesAndRegulationsPdfDoc();
  doc.save('SHERIA_NA_KANUNI_UOMBONI_SECONDARY.pdf');
}
