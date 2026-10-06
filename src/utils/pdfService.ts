import { jsPDF } from 'jspdf';
import { StudentResult, OnlineApplication, AcademicCalendarEvent } from '../types';

/**
 * Builds the official jsPDF instance for a Student Result Slip
 */
export function generateStudentResultSlipPdfDoc(student: StudentResult, qrDataUrl?: string): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Background border frame
  doc.setDrawColor(5, 75, 50); // Deep Catholic Emerald
  doc.setLineWidth(0.8);
  doc.rect(margin - 3, margin - 3, contentWidth + 6, 273);
  doc.setDrawColor(217, 119, 6); // Amber border accent
  doc.setLineWidth(0.3);
  doc.rect(margin - 1.5, margin - 1.5, contentWidth + 3, 270);

  // Top Header Banner
  doc.setFillColor(6, 78, 59); // emerald-900
  doc.rect(margin, margin, contentWidth, 32, 'F');

  // Header texts
  doc.setTextColor(253, 224, 71); // Amber yellow
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI MOSHI • CATHOLIC DIOCESE OF MOSHI', pageWidth / 2, margin + 7, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI • MARANGU', pageWidth / 2, margin + 14, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('S.L.P 361 MARANGU, MOSHI VIJIJINI • KITUO CHA NECTA NA: S0486', pageWidth / 2, margin + 20, { align: 'center' });

  doc.setFillColor(245, 158, 11);
  doc.roundedRect(pageWidth / 2 - 45, margin + 23, 90, 6, 1.5, 1.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL STUDENT PERFORMANCE REPORT SLIP', pageWidth / 2, margin + 27.2, { align: 'center' });

  let y = margin + 37;

  // Student Details Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('STUDENT FULL NAME:', margin + 4, y + 6);
  doc.text('EXAMINATION NUMBER:', margin + 100, y + 6);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(student.studentName, margin + 4, y + 11);
  doc.setTextColor(5, 150, 105);
  doc.text(student.examNumber, margin + 100, y + 11);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.text('CLASS & STREAM:', margin + 4, y + 17);
  doc.text('EXAM TYPE & YEAR:', margin + 60, y + 17);
  doc.text('GENDER:', margin + 130, y + 17);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8.5);
  doc.text(`${student.form} (${student.stream})`, margin + 4, y + 21.5);
  doc.text(`${student.examType} (${student.year})`, margin + 60, y + 21.5);
  doc.text(student.gender === 'F' ? 'Female (Wasichana)' : 'Male (Wavulana)', margin + 130, y + 21.5);

  y += 28;

  // Summary Metrics Banner (Division, Points, Average, Position)
  const boxW = (contentWidth - 6) / 4;
  const metrics = [
    { label: 'DIVISION', val: student.division, color: [5, 150, 105] },
    { label: 'NECTA POINTS', val: `${student.points} Pts`, color: [37, 99, 235] },
    { label: 'AVERAGE', val: `${student.averageMarks}%`, color: [217, 119, 6] },
    { label: 'CLASS POSITION', val: `${student.classPosition} / ${student.totalStudentsInClass}`, color: [147, 51, 234] },
  ];

  metrics.forEach((m, idx) => {
    const bx = margin + idx * (boxW + 2);
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(bx, y, boxW, 14, 1.5, 1.5, 'FD');

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    doc.text(m.label, bx + boxW / 2, y + 4.5, { align: 'center' });

    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(m.val, bx + boxW / 2, y + 10.5, { align: 'center' });
  });

  y += 18;

  // Subject Results Table
  doc.setFillColor(6, 78, 59);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('CODE', margin + 4, y + 4.8);
  doc.text('SUBJECT NAME / SOMO', margin + 20, y + 4.8);
  doc.text('SCORE (%)', margin + 95, y + 4.8, { align: 'center' });
  doc.text('GRADE', margin + 115, y + 4.8, { align: 'center' });
  doc.text('POINTS', margin + 130, y + 4.8, { align: 'center' });
  doc.text('REMARKS', margin + 145, y + 4.8);

  y += 7;

  // Table rows
  student.subjects.forEach((subj, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 6.2, 'F');

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 6.2, margin + contentWidth, y + 6.2);

    doc.setTextColor(100, 116, 139);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.text(subj.code, margin + 4, y + 4.3);

    doc.setTextColor(15, 23, 42);
    doc.text(subj.name, margin + 20, y + 4.3);

    doc.setTextColor(30, 41, 59);
    doc.text(String(subj.score), margin + 95, y + 4.3, { align: 'center' });

    // Grade highlight
    if (subj.grade === 'A') {
      doc.setTextColor(5, 150, 105);
    } else if (subj.grade === 'B') {
      doc.setTextColor(37, 99, 235);
    } else if (subj.grade === 'C') {
      doc.setTextColor(217, 119, 6);
    } else {
      doc.setTextColor(220, 38, 38);
    }
    doc.setFont('helvetica', 'bold');
    doc.text(subj.grade, margin + 115, y + 4.3, { align: 'center' });

    doc.setTextColor(71, 85, 105);
    doc.setFont('helvetica', 'normal');
    doc.text(String(subj.points), margin + 130, y + 4.3, { align: 'center' });

    doc.setFontSize(6.8);
    doc.text(subj.remarks, margin + 145, y + 4.3);

    y += 6.2;
  });

  y += 5;

  // Grade Interpretation Scale
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 8, 1, 1, 'F');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.text(
    'VIWANGO VYA ALAMA (NECTA):  A: 75-100% (Pts 1 - Bora Sana)   |   B: 65-74% (Pts 2 - Nzuri Sana)   |   C: 45-64% (Pts 3 - Nzuri)   |   D: 30-44% (Pts 4 - Inaridhisha)   |   F: 0-29% (Pts 5 - Feli)',
    pageWidth / 2,
    y + 5,
    { align: 'center' }
  );

  y += 12;

  // Conduct & Character Box
  doc.setFillColor(254, 252, 232);
  doc.setDrawColor(254, 240, 138);
  doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'FD');

  doc.setTextColor(133, 77, 14);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('TATHMINI YA TABIA NA NIDHAMU (CONDUCT & DISCIPLINE):', margin + 4, y + 5);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`★  ${student.conduct}`, margin + 4, y + 10);

  y += 18;

  // Headmaster Remarks Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 1.5, 1.5, 'FD');

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('MAONI NA USHAURI WA MKUU WA SHULE (HEADMASTER REMARKS):', margin + 4, y + 5);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(`"${student.headmasterRemarks}"`, margin + 4, y + 10, { maxWidth: contentWidth - 8 });

  y += 24;

  // Signatures & Official Stamp
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Br. Adolph Massawe', margin + 5, y + 6);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Mkuu wa Shule (Headmaster)', margin + 5, y + 10);
  doc.text('Shule ya Sekondari Uomboni - Marangu', margin + 5, y + 14);
  doc.text(`Tarehe: ${student.publishDate || new Date().toISOString().split('T')[0]}`, margin + 5, y + 18);

  // Rubber stamp
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin + 105, y + 1, 65, 18, 2, 2);
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI', margin + 137.5, y + 6, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('★ OFFICIAL EXAM SEAL ★', margin + 137.5, y + 10.5, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('S.L.P 361 MARANGU - MOSHI', margin + 137.5, y + 15, { align: 'center' });

  // Optional Digital Verification QR Code
  if (qrDataUrl) {
    try {
      doc.addImage(qrDataUrl, 'PNG', margin + 74, y - 2, 22, 22);
      doc.setFontSize(5);
      doc.setTextColor(5, 150, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('SCAN TO VERIFY REPORT', margin + 85, y + 22.5, { align: 'center' });
    } catch {
      // Gracefully continue if image format fails
    }
  }

  return doc;
}

/**
 * Generates and downloads an official Student Performance Report Slip PDF
 */
export function downloadStudentResultSlipPdf(student: StudentResult, qrDataUrl?: string) {
  const doc = generateStudentResultSlipPdfDoc(student, qrDataUrl);
  const cleanName = student.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanExam = student.examNumber.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`UOMBONI_RESULT_SLIP_${cleanExam}_${cleanName}.pdf`);
}

/**
 * Generates a Blob URL for inline PDF viewing and embedding
 */
export function getStudentResultSlipPdfBlobUrl(student: StudentResult, qrDataUrl?: string): string {
  const doc = generateStudentResultSlipPdfDoc(student, qrDataUrl);
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
}

/**
 * Direct print of student result slip via a hidden iframe
 */
export function printStudentResultSlipDirectly(student: StudentResult) {
  const blobUrl = getStudentResultSlipPdfBlobUrl(student);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = blobUrl;

  document.body.appendChild(iframe);

  iframe.onload = () => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch {
      window.print();
    } finally {
      setTimeout(() => {
        document.body.removeChild(iframe);
        URL.revokeObjectURL(blobUrl);
      }, 5000);
    }
  };
}

/**
 * Builds the class consolidated broadsheet doc
 */
export function generateClassBroadsheetPdfDoc(results: StudentResult[], title = 'MATOKEO YA DARASA - UOMBONI SECONDARY SCHOOL'): jsPDF {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 297mm
  const margin = 10;
  const contentWidth = pageWidth - margin * 2; // 277mm

  // Header Banner
  doc.setFillColor(6, 78, 59);
  doc.rect(margin, margin, contentWidth, 20, 'F');

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI MOSHI • SHULE YA SEKONDARI UOMBONI (NECTA S0486)', pageWidth / 2, margin + 6, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text(title.toUpperCase(), pageWidth / 2, margin + 13, { align: 'center' });

  let y = margin + 24;

  // Table Column Headers
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.line(margin, y + 7, margin + contentWidth, y + 7);

  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');

  doc.text('POS', margin + 3, y + 4.8);
  doc.text('EXAM NO', margin + 14, y + 4.8);
  doc.text('STUDENT NAME', margin + 45, y + 4.8);
  doc.text('SEX', margin + 102, y + 4.8);
  doc.text('CLASS', margin + 112, y + 4.8);

  // Subject abbreviated headers
  const subjHeaders = ['CIV', 'HIST', 'GEO', 'KISW', 'ENG', 'PHY', 'CHEM', 'BIO', 'BAM', 'RE'];
  subjHeaders.forEach((sh, idx) => {
    doc.text(sh, margin + 132 + idx * 9.5, y + 4.8, { align: 'center' });
  });

  doc.text('AVG', margin + 232, y + 4.8, { align: 'center' });
  doc.text('PTS', margin + 245, y + 4.8, { align: 'center' });
  doc.text('DIV', margin + 262, y + 4.8, { align: 'center' });

  y += 7;

  // Render Rows
  results.forEach((st, idx) => {
    // Check if new page needed
    if (y > 185) {
      doc.addPage('a4', 'landscape');
      y = margin + 10;
    }

    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6, margin + contentWidth, y + 6);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');

    doc.text(String(st.classPosition || idx + 1), margin + 3, y + 4.2);
    doc.setFont('helvetica', 'bold');
    doc.text(st.examNumber, margin + 14, y + 4.2);

    doc.setTextColor(15, 23, 42);
    doc.text(st.studentName.slice(0, 26), margin + 45, y + 4.2);
    doc.text(st.gender, margin + 102, y + 4.2);
    doc.text(st.form.replace('Form ', 'F.'), margin + 112, y + 4.2);

    // Subjects
    subjHeaders.forEach((sh, sidx) => {
      const sub = st.subjects.find((s) => s.code.includes(sh) || s.name.toUpperCase().includes(sh));
      const gradeStr = sub ? `${sub.score}${sub.grade}` : '-';
      doc.setTextColor(sub?.grade === 'A' ? 5 : sub?.grade === 'B' ? 37 : 71, sub?.grade === 'A' ? 150 : sub?.grade === 'B' ? 99 : 85, sub?.grade === 'A' ? 105 : sub?.grade === 'B' ? 235 : 105);
      doc.text(gradeStr, margin + 132 + sidx * 9.5, y + 4.2, { align: 'center' });
    });

    // Average
    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.text(`${st.averageMarks}%`, margin + 232, y + 4.2, { align: 'center' });

    // Points
    doc.text(String(st.points), margin + 245, y + 4.2, { align: 'center' });

    // Division
    if (st.division === 'Division I') {
      doc.setTextColor(5, 150, 105);
    } else if (st.division === 'Division II') {
      doc.setTextColor(37, 99, 235);
    } else {
      doc.setTextColor(217, 119, 6);
    }
    doc.text(st.division.replace('Division ', 'DIV '), margin + 262, y + 4.2, { align: 'center' });

    y += 6;
  });

  // Footer summary
  y += 6;
  if (y > 185) {
    doc.addPage('a4', 'landscape');
    y = margin + 10;
  }

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 12, 1, 1, 'F');
  doc.setTextColor(71, 85, 105);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  const div1Count = results.filter((r) => r.division === 'Division I').length;
  const div2Count = results.filter((r) => r.division === 'Division II').length;
  const div3Count = results.filter((r) => r.division === 'Division III').length;
  const div4Count = results.filter((r) => r.division === 'Division IV').length;

  doc.text(
    `JUMLA YA WANAFUNZI: ${results.length}   |   DIVISION I: ${div1Count} (${((div1Count / (results.length || 1)) * 100).toFixed(1)}%)   |   DIVISION II: ${div2Count}   |   DIVISION III: ${div3Count}   |   DIVISION IV: ${div4Count}   |   UFAULU WA JUMLA: MADARAJA YA JUU`,
    pageWidth / 2,
    y + 7.5,
    { align: 'center' }
  );

  return doc;
}

/**
 * Generates and downloads an official Joining Instructions PDF
 */
export function downloadJoiningInstructionsPdf(docInfo?: any) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Outer border frame
  doc.setDrawColor(5, 75, 50);
  doc.setLineWidth(0.8);
  doc.rect(margin - 3, margin - 3, contentWidth + 6, 273);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.rect(margin - 1.5, margin - 1.5, contentWidth + 3, 270);

  // Top Header Banner
  doc.setFillColor(6, 78, 59);
  doc.rect(margin, margin, contentWidth, 32, 'F');

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI MOSHI • CATHOLIC DIOCESE OF MOSHI', pageWidth / 2, margin + 7, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.text('SHULE YA SEKONDARI UOMBONI • MARANGU', pageWidth / 2, margin + 14, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('S.L.P 361 MARANGU, MOSHI VIJIJINI • KITUO CHA NECTA: S0486 • SIMU: +255 754 892 140', pageWidth / 2, margin + 20, { align: 'center' });

  doc.setFillColor(245, 158, 11);
  doc.roundedRect(pageWidth / 2 - 55, margin + 23, 110, 6, 1.5, 1.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('MAELEKEZO YA KUJIUNGA NA SHULE (JOINING INSTRUCTIONS 2026)', pageWidth / 2, margin + 27.2, { align: 'center' });

  let y = margin + 38;

  // Introduction text
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('1. UTANGULIZI NA PONGEZI', margin + 4, y);
  y += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    'Uongozi wa Shule ya Sekondari Uomboni unakupa hongera kwa kuchaguliwa/kujiunga na shule yetu. Shule ipo Marangu chini ya mteremko wa Mlima Kilimanjaro na inamilikiwa na Jimbo Katoliki Moshi. Tunatarajia mwanafunzi atazingatia kikamilifu maadili, nidhamu na bidii ya masomo.',
    margin + 4,
    y,
    { maxWidth: contentWidth - 8 }
  );

  y += 16;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('2. MAELEZO YA MALIPO NA ADA YA SHULE', margin + 4, y);
  y += 5;

  // Bank Info Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setTextColor(6, 78, 59);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('• CRDB BANK: A/C 01J1079051400 (Uomboni Secondary School)', margin + 4, y + 6);
  doc.text('• NMB BANK: A/C 40302507439 (Uomboni Secondary School)', margin + 4, y + 12);

  y += 22;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('3. MAHITAJI MUHIMU YA MWANAFUNZI WA BWENI & KUTWA', margin + 4, y);
  y += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('a) Sare kamili za shule (Suruali/Sketi za kijani kibichi, Mashati meupe, Sweta na Tai ya kijani).', margin + 4, y);
  doc.text('b) Godoro (3x6), mashuka mawili ya rangi ya bluu, na chandarua cha duara (kwa wanafunzi wa bweni).', margin + 4, y + 5);
  doc.text('c) Vifaa vya usafi binafsi, ndoo 2, na koti la maabara (Science Lab Coat).', margin + 4, y + 10);
  doc.text('d) Daftari kubwa (Counter books 10), Vifaa vya Hisabati (Mathematical Set) na Kamusi.', margin + 4, y + 15);
  doc.text('e) Fomu ya uchunguzi wa afya (Medical Examination Report) iliyothibitishwa na Daktari.', margin + 4, y + 20);

  y += 30;
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('4. NIDHAMU NA MALEZI YA KIROHO', margin + 4, y);
  y += 5;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text(
    'Shule inaendeshwa kwa misingi ya Kikatoliki. Wanafunzi wote wanatakiwa kuheshimu sala, ibada, walimu na taratibu zote za shule. Hairuhusiwi kabisa kuwa na simu ya mkononi au vifaa vya kielektroniki visivyoidhinishwa.',
    margin + 4,
    y,
    { maxWidth: contentWidth - 8 }
  );

  y += 22;
  // Signatures
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Br. Adolph Massawe', margin + 5, y + 6);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Mkuu wa Shule (Headmaster)', margin + 5, y + 10);
  doc.text('Shule ya Sekondari Uomboni - Marangu', margin + 5, y + 14);

  // Rubber stamp
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin + 105, y + 1, 65, 18, 2, 2);
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI', margin + 137.5, y + 6, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('★ ADMISSION OFFICE ★', margin + 137.5, y + 10.5, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('S.L.P 361 MARANGU - MOSHI', margin + 137.5, y + 15, { align: 'center' });

  doc.save('UOMBONI_SECONDARY_JOINING_INSTRUCTIONS_2026.pdf');
}

/**
 * Generates and downloads a Class Consolidated Broadsheet PDF (A4 Landscape)
 */
export function downloadClassBroadsheetPdf(results: StudentResult[], title = 'MATOKEO YA DARASA - UOMBONI SECONDARY SCHOOL') {
  const doc = generateClassBroadsheetPdfDoc(results, title);
  doc.save(`UOMBONI_BROADSHEET_MATOKEO_${new Date().getFullYear()}.pdf`);
}

/**
 * Generates a Blob URL for the broadsheet PDF
 */
/**
 * Generates an Official Admission Acceptance & Verification Letter PDF (A4 Portrait)
 */
export function generateAdmissionVerificationLetterDoc(app: OnlineApplication): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Outer Border Frame
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.8);
  doc.rect(margin - 3, margin - 3, contentWidth + 6, 273);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.rect(margin - 1.5, margin - 1.5, contentWidth + 3, 270);

  // Top Header Banner
  doc.setFillColor(6, 78, 59);
  doc.rect(margin, margin, contentWidth, 32, 'F');

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI MOSHI • CATHOLIC DIOCESE OF MOSHI', pageWidth / 2, margin + 7, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI • MARANGU', pageWidth / 2, margin + 14, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('S.L.P 361 MARANGU, MOSHI VIJIJINI • KITUO CHA NECTA: S0486 • SIMU: +255 754 892 140', pageWidth / 2, margin + 20, { align: 'center' });

  doc.setFillColor(245, 158, 11);
  doc.roundedRect(pageWidth / 2 - 55, margin + 23, 110, 6, 1.5, 1.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('BARUA RASMI YA UHAKIKI WA MAOMBI YA KUJIUNGA (2026)', pageWidth / 2, margin + 27.2, { align: 'center' });

  let y = margin + 38;

  // Metadata ribbon
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.text(`Kumbukumbu Na: ${app.applicationNumber}`, margin + 2, y);
  doc.text(`Tarehe ya Uhakiki: ${new Date().toLocaleDateString('sw-TZ')}`, pageWidth - margin - 2, y, { align: 'right' });

  y += 5;

  // Status Badge Callout
  const isApproved = app.status === 'Imethibitishwa';
  if (isApproved) {
    doc.setFillColor(236, 253, 245);
    doc.setDrawColor(16, 185, 129);
  } else if (app.status === 'Inasubiri Uhakiki') {
    doc.setFillColor(254, 252, 232);
    doc.setDrawColor(234, 179, 8);
  } else {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(148, 163, 184);
  }
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 12, 1.5, 1.5, 'FD');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  if (isApproved) {
    doc.setTextColor(6, 95, 70);
    doc.text('✓ HALI YA MAOMBI: IMETHIBITISHWA (ADMISSION ACCEPTED & VERIFIED)', margin + 5, y + 7.5);
  } else {
    doc.setTextColor(133, 77, 14);
    doc.text(`★ HALI YA MAOMBI: ${app.status.toUpperCase()} (APPLICATION UNDER VERIFICATION)`, margin + 5, y + 7.5);
  }

  y += 17;

  // Student & Application Details Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 42, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('TAARIFA ZA MWANAFUNZI NA MAOMBI:', margin + 4, y + 6);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Jina Kamili la Mwanafunzi:', margin + 4, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text(app.studentName.toUpperCase(), margin + 50, y + 13);

  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('Jinsia / Tarehe ya Kuzaliwa:', margin + 4, y + 19);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${app.gender === 'M' ? 'Mvulana (Male)' : 'Msichana (Female)'} • ${app.dob || 'Haijajazwa'}`, margin + 50, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Darasa Analoomba & Aina:', margin + 4, y + 25);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${app.applyingFor} • ${app.entryType}`, margin + 50, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Shule Aliyotoka:', margin + 4, y + 31);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(app.previousSchool || 'Haijabainishwa', margin + 50, y + 31);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Ufaulu / Matokeo ya Awali:', margin + 4, y + 37);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(app.primaryResults || 'Wastani umeridhiwa na ofisi ya udahili', margin + 50, y + 37);

  y += 47;

  // Parent Details Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('TAARIFA ZA MZAZI / MLEZI:', margin + 4, y + 6);

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('Jina la Mzazi/Mlezi:', margin + 4, y + 13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(app.parentName, margin + 40, y + 13);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Simu / Mawasiliano:', margin + 4, y + 19);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`${app.parentPhone} ${app.parentEmail ? `• ${app.parentEmail}` : ''} • ${app.parentAddress || 'Marangu, Kilimanjaro'}`, margin + 40, y + 19);

  y += 29;

  // Instructions & Fees Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 68, 2, 2, 'FD');

  doc.setTextColor(6, 78, 59);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('MAELEKEZO YA KURIPOTI NA MALIPO YA ADA (2026):', margin + 4, y + 6);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('1. Nafasi hii inathibitishwa rasmi baada ya kukamilisha taratibu zote za usajili na kulipa ada ya muhula wa kwanza.', margin + 4, y + 12);
  doc.text('2. Mwanafunzi afike shuleni akiwa na nakala ya barua hii, cheti halisi cha kuzaliwa, na picha 4 za pasipoti.', margin + 4, y + 17);
  doc.text('3. Malipo yote ya shule yafanywe kupitia akaunti rasmi za benki za shule:', margin + 4, y + 22);

  // Mini Bank Box
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin + 4, y + 25, contentWidth - 8, 14, 1.5, 1.5, 'F');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('• CRDB Bank: A/C 01J1079051400 (Shule ya Sekondari Uomboni)', margin + 7, y + 31);
  doc.text('• NMB Bank: A/C 40302507439 (Shule ya Sekondari Uomboni)', margin + 7, y + 36);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('4. Wanafunzi wa bweni wanatakiwa kuripoti wakiwa na vifaa vyote vilivyoainishwa kwenye Joining Instructions.', margin + 4, y + 47);
  doc.text('5. Maoni ya Utawala: ' + (app.adminNotes || 'Maombi yamekaguliwa na kuingizwa kwenye kumbukumbu za shule.'), margin + 4, y + 53, { maxWidth: contentWidth - 8 });

  if (app.enrolledStudentId) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`Namba Rasmi ya Usajili wa Mwanafunzi (Student ID): ${app.enrolledStudentId}`, margin + 4, y + 62);
  }

  y += 73;

  // Signatures & Stamp
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('Br. Adolph Massawe', margin + 5, y + 6);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Mkuu wa Shule (Headmaster)', margin + 5, y + 10);
  doc.text('Shule ya Sekondari Uomboni - Marangu', margin + 5, y + 14);

  // Rubber Stamp
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.6);
  doc.roundedRect(margin + 105, y + 1, 65, 18, 2, 2);
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI', margin + 137.5, y + 6, { align: 'center' });
  doc.setFontSize(7.5);
  doc.text('★ OFISI YA UDAHILI ★', margin + 137.5, y + 10.5, { align: 'center' });
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('S.L.P 361 MARANGU - MOSHI', margin + 137.5, y + 15, { align: 'center' });

  return doc;
}

export function generateOfficialAdmissionInvitationLetterDoc(params?: {
  parentName?: string;
  studentName?: string;
  dateStr?: string;
  form?: string;
  premNumber?: string;
  previousSchool?: string;
  applicationNumber?: string;
}): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const margin = 20;
  const contentWidth = pageWidth - margin * 2; // 170

  // Corner crop marks (matching the uploaded official letter)
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.7);
  // Top left
  doc.line(margin - 8, margin - 2, margin - 2, margin - 2);
  doc.line(margin - 8, margin - 2, margin - 8, margin + 6);
  // Top right
  doc.line(pageWidth - margin + 8, margin - 2, pageWidth - margin + 2, margin - 2);
  doc.line(pageWidth - margin + 8, margin - 2, pageWidth - margin + 8, margin + 6);
  // Bottom left
  doc.line(margin - 8, 280, margin - 2, 280);
  doc.line(margin - 8, 280, margin - 8, 272);
  // Bottom right
  doc.line(pageWidth - margin + 8, 280, pageWidth - margin + 2, 280);
  doc.line(pageWidth - margin + 8, 280, pageWidth - margin + 8, 272);

  let y = margin + 5;

  // Header: Left side school title & motto
  doc.setTextColor(217, 119, 6); // Amber / Gold
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('UOMBONI SECONDARY SCHOOL', margin, y);

  y += 5.5;
  doc.setTextColor(202, 138, 4); // Dark gold
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Marangu, Moshi - Kilimanjaro', margin, y);

  y += 4.5;
  doc.setFontSize(7.5);
  doc.setTextColor(180, 83, 9);
  doc.setFont('helvetica', 'bold');
  doc.text('MOTTO: TUJIENDELEZE SISI WENYEWE', margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text('(Education • Pray • Work)', margin + 62, y);

  // Header: Right side contacts & web
  const rightX = pageWidth - margin;
  doc.setTextColor(202, 138, 4);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('+255 782 558 127', rightX, margin + 3.5, { align: 'right' });
  doc.text('+255 755 238 838', rightX, margin + 7.5, { align: 'right' });
  doc.text('+255 752 717 191', rightX, margin + 11.5, { align: 'right' });
  doc.text('www.uombonisecondary.ac.tz', rightX, margin + 16.5, { align: 'right' });
  doc.text('info@uombonisecondary.ac.tz', rightX, margin + 20.5, { align: 'right' });

  // Divider line between left & right header
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.line(margin + 98, margin, margin + 98, margin + 23);

  y += 11;
  // Center Slogan: Elimu Bora, Maendeleo Yako!
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(1.5);
  doc.line(margin, y, pageWidth - margin, y);

  y += 5.5;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(15, 23, 42);
  doc.text('Elimu Bora, Maendeleo Yako!', pageWidth / 2, y, { align: 'center' });

  y += 2.5;
  doc.setLineWidth(0.4);
  doc.line(margin, y, pageWidth - margin, y);

  // Date
  y += 9;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  const dateText = params?.dateStr || 'Tarehe: _____ / _____ / 2026';
  doc.text(dateText, rightX, y, { align: 'right' });

  // Parent line
  y += 8;
  doc.text('Ndugu Mzazi/Mlezi wa,', margin, y);
  const parentFilled = params?.parentName ? ` ${params.parentName}` : ' __________________________________________';
  doc.setFont('helvetica', 'bold');
  doc.text(parentFilled, margin + 35, y);

  // Subject: YAH: MWALIKO WA KUJIUNGA NA UOMBONI SECONDARY SCHOOL
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  const subj = 'YAH: MWALIKO WA KUJIUNGA NA UOMBONI SECONDARY SCHOOL';
  doc.text(subj, pageWidth / 2, y, { align: 'center' });
  const subjWidth = doc.getTextWidth(subj);
  doc.line(pageWidth / 2 - subjWidth / 2, y + 1, pageWidth / 2 + subjWidth / 2, y + 1);

  // Body Paragraph 1
  y += 9;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  const stdName = params?.studentName ? ` ${params.studentName}` : ' ___________________________________';
  
  doc.text('Kwa heshima kubwa, uongozi wa Uomboni Secondary School unakutaarifu kuwa mtoto wako,', margin, y);
  y += 5.5;
  doc.setFont('helvetica', 'bold');
  doc.text(stdName, margin, y);
  doc.setFont('helvetica', 'normal');
  doc.text(' amefaulu usaili (interview) wa kujiunga na shule yetu.', margin + (params?.studentName ? doc.getTextWidth(params.studentName) + 2 : 75), y);

  if (params?.premNumber || params?.previousSchool || params?.applicationNumber) {
    y += 5.5;
    doc.setFontSize(8);
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    const creds = [
      params?.applicationNumber ? `Ref: #${params.applicationNumber}` : '',
      params?.premNumber ? `PREM / Mtihani La Saba: ${params.premNumber}` : '',
      params?.previousSchool ? `Shule Aliyotoka: ${params.previousSchool}` : '',
    ].filter(Boolean).join('  |  ');
    doc.text(`[ ${creds} ]`, margin, y);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
  }

  y += 8;
  doc.text('Tunamkaribisha kujiunga na familia ya Uomboni Sekondari ili kupata elimu bora, mazingira mazu-', margin, y);
  y += 5;
  doc.text('ri ya kujifunzia, nidhamu, maadili na maendeleo ya kitaaluma.', margin, y);

  // Section: Faida za Kujiunga Nasi (Table Box with 2 Columns)
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text('Faida za Kujiunga Nasi:', margin, y);

  y += 3;
  const tableY = y;
  const colW = contentWidth / 2;
  doc.setDrawColor(148, 163, 184);
  doc.setLineWidth(0.4);
  doc.rect(margin, tableY, contentWidth, 23);
  doc.line(margin + colW, tableY, margin + colW, tableY + 23);
  doc.line(margin, tableY + 7.6, margin + contentWidth, tableY + 7.6);
  doc.line(margin, tableY + 15.3, margin + contentWidth, tableY + 15.3);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  // Left col
  doc.text('•   Walimu wenye sifa na uzoefu', margin + 5, tableY + 5.2);
  doc.text('•   Maabara na vifaa vya kisasa', margin + 5, tableY + 12.8);
  doc.text('•   Nidhamu na maadili mema', margin + 5, tableY + 20.4);
  // Right col
  doc.text('•   Mazingira bora ya kujifunzia', margin + colW + 5, tableY + 5.2);
  doc.text('•   Maktaba na huduma za TEHAMA', margin + colW + 5, tableY + 12.8);
  doc.text('•   Michezo na shughuli za maendeleo', margin + colW + 5, tableY + 20.4);

  y = tableY + 31;
  doc.setFontSize(9.5);
  doc.text('Tafadhali fika shuleni kwa ajili ya kukamilisha usajili na kupata maelekezo muhimu ya masomo.', margin, y);

  y += 7;
  doc.text('Tunakupongeza kwa mafanikio ya mtoto wako na tunatarajia ushirikiano wako. Karibu sana Uo-', margin, y);
  y += 5;
  doc.text('mboni Secondary School.', margin, y);

  // Signature and Official Stamp
  y += 28;
  doc.setFont('helvetica', 'normal');
  doc.text('(Sahihi) ___________________________', margin, y);
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('MKUU WA SHULE', margin, y);

  // Official Stamp Box (Right side)
  const stampX = margin + 105;
  const stampY = y - 18;
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.5);
  doc.rect(stampX, stampY, 65, 26);
  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('MUHURI WA SHULE', stampX + 32.5, stampY + 11, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('(Official Stamp)', stampX + 32.5, stampY + 16, { align: 'center' });

  return doc;
}

export function downloadOfficialAdmissionInvitationLetterPdf(params?: {
  parentName?: string;
  studentName?: string;
  dateStr?: string;
  form?: string;
}) {
  const doc = generateOfficialAdmissionInvitationLetterDoc(params);
  const cleanName = (params?.studentName || 'MWANAFUNZI').replace(/\s+/g, '_').toUpperCase();
  doc.save(`BARUA_YA_MWALIKO_UOMBONI_${cleanName}.pdf`);
}

export function downloadAdmissionVerificationLetterPdf(application: any) {
  const params = {
    parentName: application?.parentName || application?.parent_guardian_name || 'Mzazi / Mlezi',
    studentName: application?.studentName || application?.fullName || application?.full_name || application?.applicantName || 'Mwanafunzi',
    dateStr: new Date().toLocaleDateString('sw-TZ', { year: 'numeric', month: 'long', day: 'numeric' }),
    form: application?.applyingFor || application?.form || 'Kidato cha Kwanza (Form I) 2026',
    premNumber: application?.premNumber || application?.prem_number,
    previousSchool: application?.previousSchool || application?.previous_school,
    applicationNumber: application?.applicationNumber || application?.application_number,
  };
  const doc = generateOfficialAdmissionInvitationLetterDoc(params);
  const cleanName = (params.studentName || 'MWANAFUNZI').replace(/\s+/g, '_').toUpperCase();
  doc.save(`THIBITISHO_UDAHILI_UOMBONI_${cleanName}.pdf`);
}

export function getOfficialAdmissionInvitationLetterBlobUrl(params?: {
  parentName?: string;
  studentName?: string;
  dateStr?: string;
  form?: string;
}): string {
  const doc = generateOfficialAdmissionInvitationLetterDoc(params);
  const pdfBlob = doc.output('blob');
  return URL.createObjectURL(pdfBlob);
}

export function printOfficialAdmissionInvitationLetter(params?: {
  parentName?: string;
  studentName?: string;
  dateStr?: string;
  form?: string;
}) {
  const doc = generateOfficialAdmissionInvitationLetterDoc(params);
  doc.autoPrint();
  const pdfBlob = doc.output('blob');
  const blobUrl = URL.createObjectURL(pdfBlob);
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.src = blobUrl;
  document.body.appendChild(iframe);
  iframe.onload = () => {
    try {
      iframe.contentWindow?.print();
    } catch {
      window.open(blobUrl, '_blank');
    }
  };
}

/**
 * Builds an official Fee Payment Receipt / Stakabadhi ya Malipo PDF
 */
export function generateFeePaymentReceiptPdfDoc(payment: {
  receiptNumber?: string;
  studentName: string;
  examNumber?: string;
  form?: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  paymentDate: string;
  parentPhone?: string;
  status?: string;
}): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // A5 is perfect for school receipts
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 148mm
  const margin = 10;
  const contentWidth = pageWidth - margin * 2; // 128mm

  // Frame
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.8);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 194);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.rect(margin - 1, margin - 1, contentWidth + 2, 192);

  // Header Banner
  doc.setFillColor(6, 78, 59);
  doc.rect(margin, margin, contentWidth, 24, 'F');

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI MOSHI • DIOCESE OF MOSHI', pageWidth / 2, margin + 5.5, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.text('SHULE YA SEKONDARI UOMBONI • MARANGU', pageWidth / 2, margin + 12, { align: 'center' });

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text('S.L.P 361 MARANGU • NECTA S0486 • SIMU: +255 754 892 140', pageWidth / 2, margin + 17, { align: 'center' });

  doc.setFillColor(245, 158, 11);
  doc.roundedRect(pageWidth / 2 - 40, margin + 19, 80, 5, 1, 1, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('STAKABADHI RASMI YA MALIPO YA ADA (OFFICIAL RECEIPT)', pageWidth / 2, margin + 22.5, { align: 'center' });

  let y = margin + 29;

  // Receipt Number & Date Ribbon
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, y, contentWidth, 10, 1.5, 1.5, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Namba ya Risiti:', margin + 3, y + 6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text(payment.receiptNumber || 'REC-ONLINE', margin + 25, y + 6.5);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Tarehe ya Malipo:', margin + 70, y + 6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(payment.paymentDate || new Date().toISOString().split('T')[0], margin + 96, y + 6.5);

  y += 14;

  // Student Details Box
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 38, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'bold');
  doc.text('TAARIFA ZA MWANAFUNZI & MALIPO:', margin + 3, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.text('Jina la Mwanafunzi:', margin + 3, y + 12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(payment.studentName.toUpperCase(), margin + 35, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Kidato / Darasa:', margin + 3, y + 18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(payment.form || 'Kidato cha Kwanza', margin + 35, y + 18);

  if (payment.examNumber && payment.examNumber !== 'S0486/UNREGISTERED') {
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Namba ya Mtihani:', margin + 3, y + 24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text(payment.examNumber, margin + 35, y + 24);
  }

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Njia ya Malipo:', margin + 3, y + 30);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(payment.paymentMethod, margin + 35, y + 30);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Kumbukumbu ya Benki/Simu:', margin + 3, y + 36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text(payment.transactionReference, margin + 35, y + 36);

  y += 42;

  // Amount Paid Big Callout
  doc.setFillColor(236, 253, 245);
  doc.setDrawColor(16, 185, 129);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setTextColor(6, 95, 70);
  doc.setFont('helvetica', 'bold');
  doc.text('KIASI KILICHOLIPWA (TOTAL AMOUNT PAID):', margin + 4, y + 6);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text(`TZS ${Number(payment.amount).toLocaleString()} /=`, margin + 4, y + 14);

  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129);
  doc.text('✓ MALIPO YAMETHIBITISHWA', pageWidth - margin - 4, y + 14, { align: 'right' });

  y += 24;

  // Bursar Note & Accounts
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, contentWidth, 28, 1.5, 1.5, 'FD');

  doc.setFontSize(6.5);
  doc.setTextColor(71, 85, 105);
  doc.setFont('helvetica', 'normal');
  doc.text('MAELEZO MUHIMU:', margin + 3, y + 5);
  doc.text('1. Risiti hii ni halali na inatambuliwa na Ofisi ya Uhasibu (Bursar Office) ya Shule ya Sekondari Uomboni.', margin + 3, y + 10);
  doc.text('2. Tafadhali tunza risiti hii kama uthibitisho wa malipo ya ada na michango ya shule.', margin + 3, y + 15);
  doc.text('3. Kwa maswali au maelezo ya ziada kuhusu akaunti na bakaa ya mwanafunzi, wasiliana na Ofisi ya Bursar.', margin + 3, y + 20);

  y += 33;

  // Signature & Seal
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('Ofisi ya Mhasibu (Bursar)', margin + 3, y + 6);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('Shule ya Sekondari Uomboni - Marangu', margin + 3, y + 10);
  doc.text(`Imetolewa: ${new Date().toLocaleDateString('sw-TZ')}`, margin + 3, y + 14);

  // Rubber stamp
  doc.setDrawColor(5, 150, 105);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin + 65, y, 60, 16, 1.5, 1.5);
  doc.setTextColor(5, 150, 105);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'bold');
  doc.text('SHULE YA SEKONDARI UOMBONI', margin + 95, y + 5, { align: 'center' });
  doc.setFontSize(6.5);
  doc.text('★ BURSAR & FINANCE SEAL ★', margin + 95, y + 9.5, { align: 'center' });
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.text('S.L.P 361 MARANGU - MOSHI', margin + 95, y + 13.5, { align: 'center' });

  return doc;
}

export function downloadFeePaymentReceiptPdf(payment: {
  receiptNumber?: string;
  studentName: string;
  examNumber?: string;
  form?: string;
  amount: number;
  paymentMethod: string;
  transactionReference: string;
  paymentDate: string;
  parentPhone?: string;
  status?: string;
}) {
  const doc = generateFeePaymentReceiptPdfDoc(payment);
  const cleanName = payment.studentName.replace(/[^a-zA-Z0-9]/g, '_');
  const cleanRec = (payment.receiptNumber || 'RECEIPT').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`RISITI_UOMBONI_${cleanRec}_${cleanName}.pdf`);
}

/**
 * Builds an official Academic Calendar & Examination Timetable PDF Document
 */
export function generateAcademicCalendarPdfDoc(
  events: AcademicCalendarEvent[],
  year = '2026',
  language: 'sw' | 'en' = 'sw'
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2; // 186mm

  // Outer border frame
  doc.setDrawColor(6, 78, 59);
  doc.setLineWidth(0.7);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, pageHeight - margin * 2 + 4);
  doc.setDrawColor(217, 119, 6);
  doc.setLineWidth(0.3);
  doc.rect(margin - 1, margin - 1, contentWidth + 2, pageHeight - margin * 2 + 2);

  // Top Header Banner
  doc.setFillColor(6, 78, 59);
  doc.rect(margin, margin, contentWidth, 26, 'F');

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('JIMBO KATOLIKI MOSHI • CATHOLIC DIOCESE OF MOSHI', pageWidth / 2, margin + 6, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.text('SHULE YA SEKONDARI UOMBONI • MARANGU', pageWidth / 2, margin + 13, { align: 'center' });

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(209, 250, 229);
  doc.text(`KALENDA YA TAAALUMA, MITIHANI YA NECTA & MATUKIO YA MWAKA WA MASOMO ${year}`, pageWidth / 2, margin + 19, { align: 'center' });

  doc.setFillColor(245, 158, 11);
  doc.roundedRect(pageWidth / 2 - 50, margin + 21.5, 100, 4.5, 1, 1, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(
    language === 'sw'
      ? `RATIBA RASMI YA MUHULA WA 1 & 2 - MWAKA WA MASOMO ${year}`
      : `OFFICIAL ACADEMIC TIMELINE & NECTA EXAM SCHEDULE ${year}`,
    pageWidth / 2,
    margin + 24.5,
    { align: 'center' }
  );

  let y = margin + 31;

  // Table header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');

  doc.text(language === 'sw' ? 'TAREHE' : 'DATE', margin + 3, y + 4.5);
  doc.text(language === 'sw' ? 'TUKIO LA KITAALUMA / MTIHANI' : 'ACADEMIC EVENT / EXAM', margin + 38, y + 4.5);
  doc.text(language === 'sw' ? 'MUHULA' : 'TERM', margin + 120, y + 4.5);
  doc.text(language === 'sw' ? 'KUNDI / DARASA' : 'TARGET AUDIENCE', margin + 145, y + 4.5);
  doc.text(language === 'sw' ? 'HALI' : 'STATUS', margin + 172, y + 4.5);

  y += 7;

  // Table rows
  events.forEach((ev, idx) => {
    // Check if near bottom of page
    if (y > 270) {
      doc.addPage();
      y = margin + 10;
      doc.setFillColor(15, 23, 42);
      doc.rect(margin, y, contentWidth, 7, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'bold');
      doc.text(language === 'sw' ? 'TAREHE' : 'DATE', margin + 3, y + 4.5);
      doc.text(language === 'sw' ? 'TUKIO LA KITAALUMA / MTIHANI' : 'ACADEMIC EVENT / EXAM', margin + 38, y + 4.5);
      doc.text(language === 'sw' ? 'MUHULA' : 'TERM', margin + 120, y + 4.5);
      doc.text(language === 'sw' ? 'KUNDI / DARASA' : 'TARGET AUDIENCE', margin + 145, y + 4.5);
      doc.text(language === 'sw' ? 'HALI' : 'STATUS', margin + 172, y + 4.5);
      y += 7;
    }

    const rowHeight = 11;
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');

    // Bottom border line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y + rowHeight, margin + contentWidth, y + rowHeight);

    // Date
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'bold');
    const dateStr = ev.endDate ? `${ev.startDate} - ${ev.endDate}` : ev.startDate;
    doc.text(dateStr, margin + 2, y + 5);

    if (ev.time) {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.setFontSize(5.5);
      doc.text(ev.time.substring(0, 24), margin + 2, y + 8.5);
    }

    // Title & Category
    doc.setTextColor(6, 78, 59);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    const titleText = language === 'sw' ? ev.titleSw : ev.titleEn;
    doc.text(titleText.substring(0, 52), margin + 38, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.setFontSize(5.8);
    const descText = language === 'sw' ? ev.descriptionSw : ev.descriptionEn;
    doc.text(descText.substring(0, 75) + (descText.length > 75 ? '...' : ''), margin + 38, y + 8.5);

    // Term
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(6.5);
    doc.text(ev.term, margin + 120, y + 6);

    // Target Audience
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(6.5);
    doc.text(ev.targetAudience, margin + 145, y + 6);

    // Status Pill
    if (ev.status === 'Completed') {
      doc.setTextColor(100, 116, 139);
      doc.text('Imekamilika', margin + 172, y + 6);
    } else if (ev.status === 'In Progress') {
      doc.setTextColor(180, 83, 9);
      doc.text('Inaendelea', margin + 172, y + 6);
    } else {
      doc.setTextColor(5, 150, 105);
      doc.text('Inakuja', margin + 172, y + 6);
    }

    y += rowHeight;
  });

  // Footer notes and stamp
  y += 5;
  if (y < 265) {
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(margin, y, contentWidth, 14, 1.5, 1.5, 'F');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Maelezo Muhimu: Kalenda hii inafuata muongozo wa Wizara ya Elimu, Sayansi na Teknolojia (MoEST) na NECTA. Tarehe zinaweza kubadilika kulingana na maelekezo ya mamlaka.',
      margin + 3,
      y + 5
    );
    doc.text(
      'Wasiliana na Ofisi ya Mkuu wa Taaluma (Academic Master) kwa maswali yoyote kupitia: academic@uombonisec.sc.tz | Simu: +255 745 548 225',
      margin + 3,
      y + 10
    );
  }

  return doc;
}

export function downloadAcademicCalendarPdf(
  events: AcademicCalendarEvent[],
  year = '2026',
  language: 'sw' | 'en' = 'sw'
) {
  const doc = generateAcademicCalendarPdfDoc(events, year, language);
  doc.save(`KALENDA_YA_TAALUMA_UOMBONI_${year}.pdf`);
}

/**
 * Generates and downloads an .ics Calendar file for importing into Google/Apple/Outlook Calendar
 */
export function downloadCalendarIcsFile(
  eventOrEvents: AcademicCalendarEvent | AcademicCalendarEvent[],
  fileName = 'Kalenda_Uomboni_2026.ics'
) {
  const eventsList = Array.isArray(eventOrEvents) ? eventOrEvents : [eventOrEvents];

  const formatDateToIcs = (dateStr: string) => {
    return dateStr.replace(/-/g, '') + 'T080000Z';
  };

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Uomboni Secondary School//Academic Calendar//SW',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Kalenda ya Taaluma - Shule ya Sekondari Uomboni',
  ];

  eventsList.forEach((ev) => {
    const dtStart = formatDateToIcs(ev.startDate);
    const dtEnd = ev.endDate ? formatDateToIcs(ev.endDate) : dtStart;

    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${ev.id}@uombonisec.sc.tz`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${ev.titleSw} (${ev.titleEn})`,
      `DESCRIPTION:${ev.descriptionSw} - ${ev.descriptionEn}`,
      `LOCATION:${ev.location}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });

  icsContent.push('END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Builds and downloads the Official Admission Flyer PDF for Uomboni Secondary School 2026/2027
 */
export function generateOfficialSchoolFlyerPdfDoc(): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;

  // Background frame
  doc.setDrawColor(183, 28, 28); // Crimson Red
  doc.setLineWidth(1.2);
  doc.rect(margin - 2, margin - 2, contentWidth + 4, 275);
  doc.setDrawColor(245, 158, 11); // Amber
  doc.setLineWidth(0.5);
  doc.rect(margin, margin, contentWidth, 271);

  // Top Red Header
  doc.setFillColor(183, 28, 28);
  doc.rect(margin, margin, contentWidth, 36, 'F');

  doc.setTextColor(253, 224, 71); // Amber yellow
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('CATHOLIC DIOCESE OF MOSHI', pageWidth / 2, margin + 8, { align: 'center' });

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(17);
  doc.setFont('helvetica', 'bold');
  doc.text('UOMBONI SECONDARY SCHOOL', pageWidth / 2, margin + 17, { align: 'center' });

  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(254, 240, 138);
  doc.text('Kilimanjaro – Moshi, Marangu', pageWidth / 2, margin + 24, { align: 'center' });

  // Taglines
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(pageWidth / 2 - 40, margin + 27.5, 80, 6, 1.5, 1.5, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ENGLISH MEDIUM • DISCIPLINE & EXCELLENCE', pageWidth / 2, margin + 31.8, { align: 'center' });

  let y = margin + 42;

  // ADMISSION OPEN Banner & Pre Form One Dates
  doc.setFillColor(239, 68, 68);
  doc.roundedRect(margin + 5, y, 45, 8, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('ADMISSION OPEN', margin + 27.5, y + 5.5, { align: 'center' });

  // Pre Form One Box
  doc.setFillColor(183, 28, 28);
  doc.roundedRect(margin + 5, y + 10, 80, 22, 2, 2, 'F');
  doc.setTextColor(253, 224, 71);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('PRE FORM ONE INAANZA:', margin + 45, y + 16, { align: 'center' });
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text('21 / 09 / 2026', margin + 45, y + 26, { align: 'center' });

  // Ada Nafuu Badge
  doc.setFillColor(254, 243, 199);
  doc.setDrawColor(245, 158, 11);
  doc.roundedRect(margin + 5, y + 34, 80, 9, 2, 2, 'FD');
  doc.setTextColor(146, 64, 14);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('ADA NAFUU - ZINALIPWA KWA AWAMU', margin + 45, y + 39.5, { align: 'center' });

  // Right Box: Fomu za Kujiunga Zinapatikana
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin + 90, y, contentWidth - 95, 43, 2, 2, 'FD');

  doc.setTextColor(183, 28, 28);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text('FOMU ZA KUJIUNGA ZINAPATIKANA:', margin + 94, y + 6.5);

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('• Kwenye Ofisi ya Shule (Uomboni Sekondari - Marangu)', margin + 94, y + 14);
  doc.text('• Kwenye Bookshop ya Kanisa Katoliki - Moshi', margin + 94, y + 21);
  doc.text('• Kanisa Katoliki Roman Ngarenaro', margin + 94, y + 28);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(6, 78, 59);
  doc.text('• Pia Omba Mtandaoni kwenye Tovuti Rasmi ya Shule', margin + 94, y + 35);

  y += 48;

  // Section: OUR FEATURES
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setTextColor(183, 28, 28);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('OUR FEATURES  |  SIFA KUU ZA SHULE', pageWidth / 2, y + 5.8, { align: 'center' });

  y += 12;

  const features = [
    {
      title: '1. MTAALA BORA WA KITAIFA',
      desc: 'Kufundisha kwa viwango bora kulingana na mtaala rasmi wa Tanzania na maandalizi thabiti ya mitihani ya NECTA.',
    },
    {
      title: '2. MAABARA NA MAKTABA BORA',
      desc: 'Maabara za kisasa za Fizikia, Kemia, Baiolojia & TEHAMA na maktaba yenye vitabu vya kutosha kwa kujifunza.',
    },
    {
      title: '3. MALEZI NA NIDHAMU',
      desc: 'Malezi ya kiroho, maadili mema, na nidhamu bora kwa maendeleo na ustawi endelevu wa wanafunzi wote.',
    },
    {
      title: '4. MICHEZO NA KLABU MBALIMBALI',
      desc: 'Kukuza vipaji kupitia michezo, skauti, midahalo, klabu za sayansi na safari za kimasomo ndani na nje ya shule kila mwaka.',
    },
    {
      title: '5. MAZINGIRA YA KUSOMEA BORA',
      desc: 'Eneo la kijani, madarasa ya kisasa na mazingira tulivu na rafiki kwa kujifunza kwenye miteremko ya Mlima Kilimanjaro.',
    },
    {
      title: '6. HUDUMA YA AFYA NA USALAMA',
      desc: 'Zahanati ya Uomboni Dispensary, huduma ya kwanza na ulinzi wa masaa 24 kwa ajili ya usalama wa mwanafunzi.',
    },
  ];

  features.forEach((feat, idx) => {
    const col = idx % 2; // 0 or 1
    const row = Math.floor(idx / 2);
    const boxX = col === 0 ? margin + 2 : margin + contentWidth / 2 + 2;
    const boxY = y + row * 22;
    const boxW = contentWidth / 2 - 4;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(boxX, boxY, boxW, 19, 1.5, 1.5, 'FD');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(feat.title, boxX + 3, boxY + 5);

    doc.setTextColor(71, 85, 105);
    doc.setFontSize(6.8);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(feat.desc, boxW - 6);
    doc.text(lines, boxX + 3, boxY + 9.5);
  });

  y += 72;

  // Middle Yellow Notice Banner
  doc.setFillColor(245, 158, 11);
  doc.rect(margin, y, contentWidth, 18, 'F');
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('FOMU ZA KUJIUNGA NA KIDATO CHA KWANZA NA CHA TATU ZINAPATIKANA SASA!', pageWidth / 2, y + 6.5, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(183, 28, 28);
  doc.text('KWA MWAKA WA MASOMO: 2026–2027', pageWidth / 2, y + 13, { align: 'center' });

  y += 22;

  // Bottom Red Contacts & Facebook Footer
  doc.setFillColor(183, 28, 28);
  doc.rect(margin, y, contentWidth, 36, 'F');

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('MAHALI ILIPO:', margin + 6, y + 7);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text('Kilimanjaro – Moshi, Marangu', margin + 6, y + 13);
  doc.setFontSize(7.5);
  doc.setTextColor(254, 240, 138);
  doc.text('Fomu za Kujiunga Zinapatikana Pia Shuleni', margin + 6, y + 19);

  doc.setTextColor(253, 224, 71);
  doc.setFontSize(8);
  doc.text('MAWASILIANO YA SHULE:', margin + contentWidth / 2 + 5, y + 7);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.text('+255 782 558 127', margin + contentWidth / 2 + 5, y + 14);
  doc.text('+255 752 717 191', margin + contentWidth / 2 + 5, y + 20);

  // Bottom copyright & Facebook bar
  doc.setFillColor(127, 29, 29);
  doc.rect(margin, y + 26, contentWidth, 10, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('UKURASA WA FACEBOOK: Uomboni Secondary School', margin + 6, y + 32.5);
  doc.setTextColor(253, 224, 71);
  doc.text('PRAYER • EDUCATION • WORK | TUJIENDELEZE SISI WENYEWE', margin + contentWidth - 6, y + 32.5, { align: 'right' });

  return doc;
}

export function downloadOfficialSchoolFlyerPdf() {
  const doc = generateOfficialSchoolFlyerPdfDoc();
  doc.save('KIPEPERUSHI_UDAHILI_UOMBONI_2026_2027.pdf');
}



