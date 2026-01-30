import { RegisterForm } from "@/components/modules/authentication/register-form";

export default function RegisterPage() {
  return (
    <div className="-mt-18 bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <RegisterForm />
      </div>
    </div>
  );
}
