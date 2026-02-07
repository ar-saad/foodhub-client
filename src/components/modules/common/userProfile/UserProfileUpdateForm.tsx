"use client";

import { User } from "@/types/user.type";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateUserProfile } from "@/actions/user.actions";
import { useRouter } from "next/navigation";
import ImageUpload, {
  ImageUploadRef,
} from "@/components/common/image-upload-input";
import { useRef } from "react";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string(),
});

export default function UserProfileUpdateForm() {
  const { user, refetchUser } = useUser();
  const router = useRouter();
  const imageUploadRef = useRef<ImageUploadRef>(null);

  const form = useForm({
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Updating profile...");
      try {
        // Upload image if new one selected
        let imageUrl = user?.image;
        if (imageUploadRef.current?.hasFileSelected()) {
          imageUrl = await imageUploadRef.current.uploadToCloudinary();
        }

        const { data, error } = await updateUserProfile({
          userId: user?.id || "",
          payload: {
            name: value.name,
            phone: value.phone || "",
            image: imageUrl || "",
          },
        });

        if (error) {
          toast.error(error.message || "Failed to update profile", {
            id: toastId,
          });
          return;
        }

        toast.success("Profile updated successfully!", { id: toastId });
        await refetchUser();
        router.push("/dashboard/profile");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong, please try again", { id: toastId });
      }
    },
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-primary">
              Update Profile
            </CardTitle>
            <CardDescription>
              Update your personal information and profile picture
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <FieldGroup>
                {/* Name Field */}
                <form.Field
                  name="name"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          aria-invalid={isInvalid}
                          placeholder="Your full name"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Phone Field */}
                <form.Field
                  name="phone"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>
                          Phone Number (Optional)
                        </FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          aria-invalid={isInvalid}
                          placeholder="+1 (555) 123-4567"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                {/* Image Upload Field */}
                <Field>
                  <FieldLabel>Profile Picture (Optional)</FieldLabel>
                  <ImageUpload ref={imageUploadRef} folder="foodhub/users" />
                  {user?.image && (
                    <Image src={user.image} alt="User profile" fill />
                  )}
                </Field>

                {/* Read-only Email Display */}
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-slate-100 cursor-not-allowed"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Email cannot be changed
                  </p>
                </Field>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={form.state.isSubmitting}
                    className="flex-1"
                  >
                    {form.state.isSubmitting ? "Updating..." : "Update Profile"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={form.state.isSubmitting}
                  >
                    Cancel
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
