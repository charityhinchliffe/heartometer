import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import type { AlcoholStatus, Gender } from "@/lib/estimate";

export type ScoreCardResult = {
  signature: string;
  chance: number;
  heartDisease: boolean;
  age: number;
  systolic: number;
  sugarMmol: number;
  alcohol: AlcoholStatus;
  gender: Gender;
};

const pine: [number, number, number] = [14, 122, 70];
const pineDeep: [number, number, number] = [8, 78, 46];
const ink: [number, number, number] = [16, 33, 23];
const muted: [number, number, number] = [61, 86, 72];
const line: [number, number, number] = [213, 232, 220];
const mist: [number, number, number] = [243, 250, 246];
const white: [number, number, number] = [255, 255, 255];

const genderLabel: Record<Gender, string> = { female: "Female", male: "Male" };
const alcoholLabel: Record<AlcoholStatus, string> = {
  none: "None",
  occasional: "Occasional",
  regular: "Regular",
};

export async function buildScoreCard(result: ScoreCardResult, verifyUrl: string): Promise<ArrayBuffer> {
  const qr = await QRCode.toDataURL(verifyUrl, {
    errorCorrectionLevel: "H",
    margin: 1,
    width: 640,
    color: { dark: "#084e2e", light: "#ffffff" },
  });

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(...pine);
  doc.rect(0, 0, pageWidth, 96, "F");
  doc.setFillColor(47, 191, 120);
  doc.circle(pageWidth - 18, 8, 54, "F");
  doc.setFillColor(...pineDeep);
  doc.circle(pageWidth - 70, 78, 22, "F");

  doc.setTextColor(...white);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Heartometer", 40, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Score card", 40, 68);

  const qrSize = 268;
  const qrX = (pageWidth - qrSize) / 2;
  const qrY = 132;
  doc.setFillColor(...mist);
  doc.roundedRect(qrX - 22, qrY - 22, qrSize + 44, qrSize + 44, 22, 22, "F");
  doc.setDrawColor(...line);
  doc.setLineWidth(1);
  doc.roundedRect(qrX - 22, qrY - 22, qrSize + 44, qrSize + 44, 22, 22, "S");
  doc.addImage(qr, "PNG", qrX, qrY, qrSize, qrSize);

  doc.setTextColor(...pineDeep);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Scan to verify this result", pageWidth / 2, qrY + qrSize + 52, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.text(result.signature, pageWidth / 2, qrY + qrSize + 70, { align: "center" });

  const boxX = 36;
  const boxY = 530;
  const boxWidth = pageWidth - 72;
  const boxHeight = 246;
  doc.setFillColor(...white);
  doc.setDrawColor(...line);
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 18, 18, "FD");

  doc.setTextColor(...pine);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("REPORT", boxX + 22, boxY + 28);

  doc.setTextColor(...ink);
  doc.setFontSize(36);
  doc.text(`${result.chance}%`, boxX + 22, boxY + 70);

  const classification = result.heartDisease
    ? "Classified as heart disease."
    : "Classified as no heart disease.";
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...muted);
  doc.text(classification, boxX + 22, boxY + 92);

  const barX = boxX + 22;
  const barY = boxY + 108;
  const barWidth = boxWidth - 44;
  doc.setFillColor(231, 246, 238);
  doc.roundedRect(barX, barY, barWidth, 8, 4, 4, "F");
  doc.setFillColor(...pine);
  doc.roundedRect(barX, barY, Math.max(8, (barWidth * result.chance) / 100), 8, 4, 4, "F");

  const details = [
    ["Gender", genderLabel[result.gender]],
    ["Alcohol status", alcoholLabel[result.alcohol]],
    ["Blood pressure", `${Math.round(result.systolic)} mmHg`],
    ["Sugar level", `${result.sugarMmol.toFixed(1)} mmol/L`],
    ["Age", `${Math.round(result.age)} years`],
  ];
  details.forEach((detail, index) => {
    const column = index % 2;
    const row = Math.floor(index / 2);
    const x = boxX + 22 + column * 250;
    const y = boxY + 146 + row * 28;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.text(detail[0], x, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...ink);
    doc.text(detail[1], x + 108, y);
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("An informational estimate from these inputs. Not a medical diagnosis.", pageWidth / 2, 802, {
    align: "center",
  });

  return doc.output("arraybuffer");
}

export async function downloadScoreCard(result: ScoreCardResult, verifyUrl: string) {
  const bytes = await buildScoreCard(result, verifyUrl);
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `heartometer-${result.signature}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
}
