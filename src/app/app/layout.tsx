"use client";

import { usePathname } from "next/navigation";
import { NavigationSidebarComponent } from "@rodrigo-barraza/components-library";
import { NAV_ITEMS } from "@/constants";
import styles from "./layout.module.css";

export default function AppLayout({ children }: { children: any }) {
  const pathname = usePathname();

  const navItems = NAV_ITEMS.map((item) => ({
    ...item,
    active: pathname === item.path || pathname.startsWith(item.path + "/"),
  }));

  return (
    <div className={styles.appShell}>
      <NavigationSidebarComponent
        items={navItems}
        title="Gauge"
        storageKey="gauge:sidebar"
      />
      <main className={styles.mainContent}>{children}</main>
    </div>
  );
}
