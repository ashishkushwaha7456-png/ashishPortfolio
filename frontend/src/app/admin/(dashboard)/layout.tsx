import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

/**
 * Second guard behind the middleware. The middleware handles the redirect for
 * speed; this one guarantees no admin page can render without a verified
 * session even if the matcher is ever changed.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  return <AdminShell user={session}>{children}</AdminShell>;
}
