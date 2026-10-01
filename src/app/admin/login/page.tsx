import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Logo + heading */}
        <div className="mb-8 text-center">
          <img
            src="https://ik.imagekit.io/scmchurch/ChatGPT%20Image%20Oct%201,%202026,%2009_42_33%20AM.png"
            alt="Famous Kitchen"
            className="h-16 w-auto object-contain mx-auto"
          />
          <h1 className="mt-4 text-xl font-bold text-stone-900">Admin sign in</h1>
          <p className="mt-1 text-sm text-stone-500">
            Manage orders, menu and settings.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
          <AdminLoginForm />
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Famous Kitchen · NYSC Camp, Imo State
        </p>

      </div>
    </div>
  );
}
