import { AdminLoginForm } from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="text-base font-semibold text-stone-900">Famous Kitchen</p>
          <h1 className="mt-1 text-xl font-bold text-stone-900">Admin sign in</h1>
          <p className="mt-1 text-sm text-stone-500">
            Sign in to manage orders and menu.
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
