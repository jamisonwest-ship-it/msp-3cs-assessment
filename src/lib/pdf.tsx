import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  renderToBuffer,
} from "@react-pdf/renderer";
import type { Grade } from "./scoring";
import { GUIDANCE } from "./guidance";

const BRAND = {
  primary: "#000033",
  blue: "#0071BD",
  green: "#4BAA42",
  gray: "#6B7280",
  lightGray: "#F3F4F6",
  white: "#FFFFFF",
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: BRAND.primary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    paddingBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: BRAND.blue,
  },
  logo: {
    width: 120,
    height: 40,
  },
  logoPlaceholder: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: BRAND.primary,
  },
  headerRight: {
    textAlign: "right",
  },
  date: {
    fontSize: 9,
    color: BRAND.gray,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: BRAND.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: BRAND.gray,
    marginBottom: 25,
  },
  personName: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: BRAND.primary,
    marginBottom: 20,
  },
  scoresRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  scoreBox: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: BRAND.lightGray,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 9,
    color: BRAND.gray,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  scoreValue: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
  },
  resultSection: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 25,
    padding: 16,
    backgroundColor: BRAND.lightGray,
    borderRadius: 8,
  },
  ratingBox: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },
  ratingValue: {
    fontSize: 36,
    fontFamily: "Helvetica-Bold",
    color: BRAND.primary,
  },
  ratingLabel: {
    fontSize: 9,
    color: BRAND.gray,
    marginTop: 2,
  },
  gradeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  gradeText: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: BRAND.white,
  },
  guidanceSection: {
    marginTop: 10,
  },
  guidanceTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: BRAND.primary,
    marginBottom: 8,
  },
  guidanceText: {
    fontSize: 11,
    color: BRAND.gray,
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 8,
    color: BRAND.gray,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },
});

const gradeColors: Record<Grade, string> = {
  "A+": "#16A34A",
  A: "#22C55E",
  B: "#EAB308",
  C: "#F97316",
  D: "#EF4444",
};

export interface PersonPDFProps {
  personName: string;
  culture: number;
  competence: number;
  commitment: number;
  finalRating: number;
  grade: Grade;
  assessorEmail: string;
  dateTime: string;
  logoBase64?: string;
}

export function PersonPDF({
  personName,
  culture,
  competence,
  commitment,
  finalRating,
  grade,
  assessorEmail,
  dateTime,
  logoBase64,
}: PersonPDFProps) {
  const guidance = GUIDANCE[grade];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {logoBase64 ? (
            <Image src={logoBase64} style={styles.logo} />
          ) : (
            <Text style={styles.logoPlaceholder}>MSP+</Text>
          )}
          <View style={styles.headerRight}>
            <Text style={styles.date}>{dateTime}</Text>
            <Text style={styles.date}>{assessorEmail}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>3Cs Assessment Report</Text>
        <Text style={styles.subtitle}>Individual Scorecard</Text>

        {/* Person name */}
        <Text style={styles.personName}>{personName}</Text>

        {/* Scores */}
        <View style={styles.scoresRow}>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Culture</Text>
            <Text style={[styles.scoreValue, { color: BRAND.blue }]}>
              {culture}/10
            </Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Competence</Text>
            <Text style={[styles.scoreValue, { color: BRAND.green }]}>
              {competence}/5
            </Text>
          </View>
          <View style={styles.scoreBox}>
            <Text style={styles.scoreLabel}>Commitment</Text>
            <Text style={[styles.scoreValue, { color: BRAND.primary }]}>
              {commitment}/3
            </Text>
          </View>
        </View>

        {/* Final Rating + Grade */}
        <View style={styles.resultSection}>
          <View style={styles.ratingBox}>
            <Text style={styles.ratingValue}>{finalRating}</Text>
            <Text style={styles.ratingLabel}>Final Rating</Text>
          </View>
          <View style={{ justifyContent: "center", flex: 1 }}>
            <View
              style={[
                styles.gradeBadge,
                { backgroundColor: gradeColors[grade] },
              ]}
            >
              <Text style={styles.gradeText}>Grade: {grade}</Text>
            </View>
            <Text
              style={{
                fontSize: 13,
                fontFamily: "Helvetica-Bold",
                color: BRAND.primary,
                marginTop: 8,
              }}
            >
              {guidance.label}
            </Text>
          </View>
        </View>

        {/* Guidance */}
        <View style={styles.guidanceSection}>
          <Text style={styles.guidanceTitle}>Assessment Guidance</Text>
          <Text style={styles.guidanceText}>{guidance.detail}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          MSP+ 3Cs Assessment Report &bull; Confidential &bull; Generated{" "}
          {dateTime}
        </Text>
      </Page>
    </Document>
  );
}

/**
 * Render a person's PDF to a Buffer.
 * This helper avoids TypeScript generic mismatches with renderToBuffer.
 */
export async function renderPersonPDFToBuffer(
  props: PersonPDFProps
): Promise<Buffer> {
  const element = React.createElement(PersonPDF, props);
  const pdfBuffer = await renderToBuffer(
    element as React.ReactElement<React.ComponentProps<typeof Document>>
  );
  return Buffer.from(pdfBuffer);
}
