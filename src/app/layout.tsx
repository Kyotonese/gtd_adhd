import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GTD Task Manager",
  description: "GTDメソッドに基づいたADHD対応タスク管理アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className="h-full bg-gray-50 dark:bg-gray-900">
        {children}
      </body>
    </html>
  );
}