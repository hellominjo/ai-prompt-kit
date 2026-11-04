"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import logo from "@/app/image/logo.png";

const NAV = [
  { href: "/", label: "Home" }
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="topbar">
      <div className="wrap">
        <Link href="/" className="logo">
          <Image src={logo} alt="프롬프트 레시피" className="logo-img" loading="eager" />
           <small>AI 프롬프트 레시피북</small>
        </Link>
        <nav className="nav" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}