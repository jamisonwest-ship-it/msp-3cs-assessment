import type { Grade } from "./scoring";
import { generateGuidance } from "./guidance";

const BRAND = {
  primary: "#000033",
  blue: "#0071BD",
  green: "#4BAA42",
};

const gradeColors: Record<Grade, string> = {
  "A+": "#16A34A",
  A: "#22C55E",
  B: "#EAB308",
  C: "#F97316",
  D: "#EF4444",
};

interface PersonResult {
  name: string;
  culture: number;
  competence: number;
  commitment: number;
  finalRating: number;
  grade: Grade;
}

interface EmailTemplateOptions {
  assessorEmail: string;
  people: PersonResult[];
  sessionToken: string;
  appUrl: string;
  dateTime: string;
}

export function buildAssessmentEmailHTML(options: EmailTemplateOptions): string {
  const { people, sessionToken, appUrl, dateTime } = options;

  const rows = people
    .map(
      (p) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; font-weight: 500;">${p.name}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">${p.culture}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">${p.competence}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">${p.commitment}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: center; font-weight: 700; font-size: 16px;">${p.finalRating}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; text-align: center;">
          <span style="display: inline-block; padding: 2px 10px; border-radius: 12px; background: ${gradeColors[p.grade]}; color: white; font-weight: 700; font-size: 13px;">${p.grade}</span>
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E5E7EB; font-size: 12px; color: #6B7280;">${generateGuidance(p.culture, p.competence, p.commitment, p.grade).summary}</td>
      </tr>`
    )
    .join("");

  const historyUrl = `${appUrl}/history/${sessionToken}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background: #F3F4F6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <div style="max-width: 700px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background: ${BRAND.primary}; padding: 24px 32px; text-align: center;">
      <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700;">MSP+ 3Cs Assessment Results</h1>
    </div>

    <!-- Body -->
    <div style="padding: 32px;">
      <p style="color: ${BRAND.primary}; font-size: 14px; margin-bottom: 4px;">Assessment completed on <strong>${dateTime}</strong></p>
      <p style="color: #6B7280; font-size: 13px; margin-bottom: 24px;">${people.length} person${people.length > 1 ? "s" : ""} assessed. Individual PDF reports are attached.</p>

      <!-- Summary Table -->
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: ${BRAND.primary};">
          <thead>
            <tr style="background: #F9FAFB;">
              <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #6B7280; border-bottom: 2px solid ${BRAND.blue};">Name</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #6B7280; border-bottom: 2px solid ${BRAND.blue};">Culture</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #6B7280; border-bottom: 2px solid ${BRAND.blue};">Comp.</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #6B7280; border-bottom: 2px solid ${BRAND.blue};">Commit.</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #6B7280; border-bottom: 2px solid ${BRAND.blue};">Rating</th>
              <th style="padding: 10px 12px; text-align: center; font-size: 11px; text-transform: uppercase; color: #6B7280; border-bottom: 2px solid ${BRAND.blue};">Grade</th>
              <th style="padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #6B7280; border-bottom: 2px solid ${BRAND.blue};">Guidance</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      </div>

      <!-- History link -->
      <div style="margin-top: 28px; padding: 16px; background: #F0F9FF; border-radius: 8px; border-left: 4px solid ${BRAND.blue};">
        <p style="margin: 0 0 8px 0; font-size: 13px; color: ${BRAND.primary}; font-weight: 600;">View & Download Reports</p>
        <p style="margin: 0; font-size: 12px; color: #6B7280;">Access your assessment history and download individual PDFs:</p>
        <a href="${historyUrl}" style="display: inline-block; margin-top: 8px; color: ${BRAND.blue}; font-size: 13px; font-weight: 500;">${historyUrl}</a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #F9FAFB; padding: 16px 32px; text-align: center; border-top: 1px solid #E5E7EB;">
      <p style="margin: 0; font-size: 11px; color: #9CA3AF;">MSP+ 3Cs Assessment &bull; Confidential</p>
    </div>
  </div>
</body>
</html>`;
}
