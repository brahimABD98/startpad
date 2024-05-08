"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SettingsNavBar() {
  const pathname = usePathname();
  const links = [
    { href: "/dashboard/settings/profile", text: "General", id: 1 },
    { href: "/dashboard/settings/security", text: "Security", id: 2 },
    { href: "#", text: "Integrations", id: 3 },
    { href: "#", text: "Support", id: 4 },
    { href: "/dashboard/settings/advanced", text: "Advanced", id: 5 },
  ];
  return (
    <nav
      className="grid gap-4 text-sm text-muted-foreground"
      x-chunk="dashboard-04-chunk-0"
    >
      {links.map((link) => (
        <Link
          className={
            pathname === link.href ? "font-bold text-primary" : "text-primary"
          }
          key={link.id}
          href={link.href}
        >
          {link.text}
        </Link>
      ))}
    </nav>
  );
}
