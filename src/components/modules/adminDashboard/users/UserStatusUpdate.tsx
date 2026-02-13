"use client";

import { updateUserStatus } from "@/actions/user.actions";
import ConfirmationDialog from "@/components/common/ConfirmationDialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function UserStatusUpdateForm({ userId }: { userId: string }) {
  const [status, setStatus] = useState<string>();
  const router = useRouter();

  const handleUserStatusUpdate = async () => {
    if (!status) {
      toast.error("Please select a status to continue");
      return;
    }

    try {
      const toastId = toast.loading("Updating user status...");
      const res = await updateUserStatus({ userId, status });

      if (res?.error) {
        toast.error(res.error.message || "Failed to update user status.", {
          id: toastId,
        });
      } else {
        toast.success(`User status updated to ${status}.`, {
          id: toastId,
        });
        router.refresh();
        setStatus("");
      }
    } catch {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="max-w-xl mx-auto -mt-45 border border-primary p-5 rounded">
      <h1 className="text-center font-semibold text-primary">Admin Control</h1>
      <Field className="mb-2">
        <FieldLabel>Update Status</FieldLabel>
        <Select
          onValueChange={(value) => setStatus(value)}
          value={status || ""}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ACTIVE">ACTIVE</SelectItem>
            <SelectItem value="SUSPENDED">SUSPEND</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <ConfirmationDialog
        title="Confirm"
        description="Are you sure you want to update this user's account status?"
        actionFunction={handleUserStatusUpdate}
        triggerText="Confirm"
        disabled={!status}
      />
    </div>
  );
}
