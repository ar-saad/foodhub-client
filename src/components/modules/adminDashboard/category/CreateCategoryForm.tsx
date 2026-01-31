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
import { createCategory } from "@/actions/category.actions";
import { useRouter } from "next/navigation";
import ImageUpload, {
  ImageUploadRef,
} from "@/components/ui/image-upload-input";
import { useRef } from "react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  emoji: z.string().min(1, "Emoji is required"),
});

export function CreateCategoryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const imageUploadRef = useRef<ImageUploadRef>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      emoji: "",
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating category...");
      try {
        // Upload image first
        const imageUrl = await imageUploadRef.current?.uploadToCloudinary();

        if (!imageUrl) {
          toast.error("Please select an image", { id: toastId });
          return;
        }

        // Validate the uploaded URL
        try {
          new URL(imageUrl); // Check if it's a valid URL
        } catch {
          toast.error("Invalid image URL received", { id: toastId });
          return;
        }

        // Create category with uploaded URL
        const { data, error } = await createCategory({
          name: value.name,
          emoji: value.emoji,
          image: imageUrl,
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Category created successfully", { id: toastId });
        router.push("/admin-dashboard/categories");
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          toast.error(error.message, { id: toastId }); // Show actual error
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-3xl">
            Create New Category
          </CardTitle>
          <CardDescription>
            Add a new category to organize your food items
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
              {/* Name field */}
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>
                        Category Name
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        aria-invalid={isInvalid}
                        placeholder="e.g., Pizza, Burgers, Desserts"
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

              {/* Emoji field */}
              <form.Field
                name="emoji"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Emoji</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="text"
                        aria-invalid={isInvalid}
                        placeholder="e.g., 🍕, 🍔, 🍰"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldDescription>
                        Enter a single emoji to represent this category
                      </FieldDescription>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Image field */}

              <Field>
                <FieldLabel>Category Image</FieldLabel>
                <ImageUpload ref={imageUploadRef} folder="foodhub/categories" />
                <FieldDescription>
                  Select an image for this category
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" disabled={form.state.isSubmitting}>
                  {form.state.isSubmitting ? "Creating..." : "Create Category"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
