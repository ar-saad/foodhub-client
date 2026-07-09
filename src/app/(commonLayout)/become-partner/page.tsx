import BecomePartnerForm from "@/components/modules/common/becomePartnerForm/BecomePartnerForm";

export default async function BecomePartnerPage() {
  return (
    <div className="bg-muted flex min-h-[calc(100svh-72px)] flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <BecomePartnerForm />
      </div>
    </div>
  );
}
