"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload, {
  ImageUploadRef,
} from "@/components/common/image-upload-input";
import { Provider } from "@/types";
import { updateProviderProfile } from "@/actions/provider.actions";

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Restaurant or company name is required")
    .max(100, "Name must not exceed 100 characters"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must not exceed 200 characters"),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters"),
  isOpen: z.boolean(),
});

export default function ProviderProfileUpdateForm({
  provider,
}: {
  provider: Provider;
}) {
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: provider.name,
      address: provider.address,
      description: provider.description || "",
      isOpen: provider.isOpen,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Updating provider profile...");
      try {
        // Check if user selected a new image
        let logoUrl = provider.logo || "";
        const hasNewImage = imageUploadRef.current?.hasFileSelected();

        if (hasNewImage) {
          logoUrl =
            (await imageUploadRef.current?.uploadToCloudinary()) ||
            provider.logo ||
            "";

          try {
            new URL(logoUrl);
          } catch {
            toast.error("Invalid logo URL received", { id: toastId });
            return;
          }
        }

        const payload: {
          name: string;
          address: string;
          description?: string;
          logo?: string;
          isOpen: boolean;
        } = {
          name: value.name,
          address: value.address,
          description: value.description,
          isOpen: value.isOpen,
        };

        if (logoUrl) {
          payload.logo = logoUrl;
        }

        const { error } = await updateProviderProfile(provider.id, payload);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Provider profile updated successfully!", {
          id: toastId,
        });
        router.push(`/provider-dashboard/provider-profile/${provider.id}`);
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong", { id: toastId });
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary">
            Update Provider Profile
          </CardTitle>
          <CardDescription>
            Update your restaurant or company information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="space-y-6">
              {/* Name Field */}
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Restaurant or Partner Name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        aria-invalid={isInvalid}
                        placeholder="e.g., Pizza Palace, Burger King"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Address Field */}
              <form.Field
                name="address"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        aria-invalid={isInvalid}
                        placeholder="e.g., 123 Main Street, City, State, ZIP"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Description Field */}
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder="Tell us about your restaurant or company..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={4}
                        maxLength={500}
                      />
                      <FieldDescription>
                        Provide a brief description of your restaurant or
                        company
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Logo Upload Field */}
              <Field>
                <FieldLabel>Logo</FieldLabel>
                <ImageUpload ref={imageUploadRef} folder="foodhub/partners" />
                <FieldDescription>
                  Upload a new logo or keep the existing one
                </FieldDescription>
              </Field>

              {/* Current Logo Preview */}
              {provider.logo && (
                <Field>
                  <FieldLabel>Current Logo</FieldLabel>
                  <div className="relative">
                    <Image
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      width={500}
                      height={350}
                      className="max-h-65 max-w-100 h-auto w-auto object-contain"
                    />
                  </div>
                </Field>
              )}

              {/* isOpen Checkbox */}
              <form.Field
                name="isOpen"
                children={(field) => (
                  <Field>
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <input
                        type="checkbox"
                        id="isOpen"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <FieldLabel
                          htmlFor="isOpen"
                          className="mb-1 cursor-pointer"
                        >
                          Open for Orders
                        </FieldLabel>
                        <FieldDescription className="mt-0">
                          Mark your restaurant as open and accepting orders from
                          customers
                        </FieldDescription>
                      </div>
                    </div>
                  </Field>
                )}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={form.state.isSubmitting}
              >
                {form.state.isSubmitting
                  ? "Updating Profile..."
                  : "Update Profile"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
