import type { Metadata } from "next";
import "./system-fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bizneed | 사업 준비를 한눈에",
  description: "사업 시작에 필요한 일을 단계별로 확인하고 관리하세요.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
