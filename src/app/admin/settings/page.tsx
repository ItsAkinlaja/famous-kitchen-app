import { createServiceClient } from "@/lib/supabase/server";
import { parseSettings } from "@/lib/settings";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSettingsForm } from "@/components/admin/AdminSettingsForm";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const supabase = await createServiceClient();
  const { data: settingsRows } = await supabase.from("settings").select("*");
  const settings = parseSettings(settingsRows ?? []);

  return (
    <AdminShell>
      <div className="p-6">
        <h1 className="text-xl font-bold text-stone-900">Settings</h1>
        <p className="mt-0.5 text-sm text-stone-500">
          Configure business details, fees, and delivery options.
        </p>
        <div className="mt-6 max-w-2xl">
          <AdminSettingsForm initialSettings={settings} />
        </div>
      </div>
    </AdminShell>
  );
}
