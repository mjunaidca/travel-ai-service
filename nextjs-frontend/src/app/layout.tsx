import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Travel AI Assistant",
  description: "An OpenAI Assistant Microservice Frontend",
};

const navigation = [
  {
    id: 1,
    title: "Home",
    url: "/",
  },
  {
    id: 2,
    title: "Features",
    url: "/#services",
  },
  {
    id: 3,
    title: "Try it out",
    url: "/try",
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <nav className="mx-auto w-fit hidden my-3 items-center space-x-6 rounded-full border border-vh-700/5 bg-opacity-40 bg-gradient-to-r from-vh-700/5 from-5% via-vh-700/10 via-50% to-vh-700/5 px-6 py-3 text-xs text-vh-700 md:flex md:space-x-8 lg:text-sm">
          {navigation.map((item) => {
            return (
              <Link key={item.id} href={item.url} className="hover:underline">
                {item.title}
              </Link>
            );
          })}
        </nav> */}
        {children}
      </body>
    </html>
  );
}
