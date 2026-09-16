import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "SparkAgent · Plans", description: "SparkAgent plans and subscriptions" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
