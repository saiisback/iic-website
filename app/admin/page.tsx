import type { Metadata } from "next";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, validSession } from "@/lib/admin/auth";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = { title: "Applications · IIC Admin", robots: { index: false, follow: false } };

export default async function AdminPage() {
  const authenticated = validSession((await cookies()).get(ADMIN_COOKIE)?.value);
  return <AdminDashboard initialAuthenticated={authenticated} />;
}
