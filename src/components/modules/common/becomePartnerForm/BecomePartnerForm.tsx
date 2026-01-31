"use client";

import { cn } from "@/lib/utils";
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
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";
import ImageUpload, {
  ImageUploadRef,
} from "@/components/ui/image-upload-input";
import { useRef } from "react";
import { createPartnerProfile } from "@/actions/provider.actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, "Restaurant or company name is required"),
  address: z.string().min(1, "Address is required"),
  description: z.string().min(1, "Description is required"),
});

export default function BecomePartnerForm() {
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      address: "",
      description: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Submitting partner application...");
      try {
        // Upload logo first
        const logoUrl = await imageUploadRef.current?.uploadToCloudinary();

        if (!logoUrl) {
          toast.error("Please select a logo", { id: toastId });
          return;
        }

        // Validate the uploaded URL
        try {
          new URL(logoUrl); // Check if it's a valid URL
        } catch {
          toast.error("Invalid logo URL received", { id: toastId });
          return;
        }

        const { data, error } = await createPartnerProfile({
          name: value.name,
          address: value.address,
          description: value.description,
          logo: logoUrl,
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Partner profile created successfully!", { id: toastId });

        router.push("/provider-dashboard");
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message, { id: toastId });
        } else {
          toast.error("Something went wrong, please try again", {
            id: toastId,
          });
        }
        return;
      }
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-3xl">
            Become a Partner
          </CardTitle>
          <CardDescription>
            Join our platform and start serving delicious food to customers
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
              {/* Restaurant/Partner Name field */}
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
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Address field */}
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
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Description field */}
              <form.Field
                name="description"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <textarea
                        id={field.name}
                        name={field.name}
                        aria-invalid={isInvalid}
                        placeholder="Tell us about your restaurant or company..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        rows={4}
                        className={cn(
                          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none resize-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        )}
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

              {/* Logo field */}
              <Field>
                <FieldLabel>Logo</FieldLabel>
                <ImageUpload ref={imageUploadRef} folder="foodhub/partners" />
                <FieldDescription>
                  Upload your restaurant or company logo
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" disabled={form.state.isSubmitting}>
                  {form.state.isSubmitting
                    ? "Submitting..."
                    : "Submit Application"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
