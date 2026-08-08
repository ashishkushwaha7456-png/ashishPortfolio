import { DashboardOverview } from "@/components/admin/dashboard-overview";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();

  return (
    <DashboardOverview
      userName={session?.name ?? "there"}
      databaseConfigured={true}
    />
  );
}
