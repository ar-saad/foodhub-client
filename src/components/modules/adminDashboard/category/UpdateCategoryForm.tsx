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
import { updateCategory } from "@/actions/category.actions";
import { useRouter } from "next/navigation";
import ImageUpload, {
  ImageUploadRef,
} from "@/components/common/image-upload-input";
import { useRef } from "react";
import { Category } from "@/types";
import Image from "next/image";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  emoji: z.string().min(1, "Emoji is required"),
});

export function UpdateCategoryForm({
  category,
  className,
  ...props
}: { category: Category } & React.ComponentProps<"div">) {
  const router = useRouter();
  const imageUploadRef = useRef<ImageUploadRef>(null);

  const form = useForm({
    defaultValues: {
      name: category.name,
      emoji: category.emoji,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Updating category...");
      try {
        // Keep existing image by default
        let imageUrl = category.image;

        // Only upload if user selected a new image
        const hasNewImage = imageUploadRef.current?.hasFileSelected();
        if (hasNewImage) {
          imageUrl =
            (await imageUploadRef.current?.uploadToCloudinary()) ||
            category.image;
        }

        // Validate the image URL
        try {
          new URL(imageUrl);
        } catch {
          toast.error("Invalid image URL", { id: toastId });
          return;
        }

        const { data, error } = await updateCategory({
          id: category.id,
          name: value.name,
          emoji: value.emoji,
          image: imageUrl,
        });

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Category updated successfully", { id: toastId });
        router.push("/admin-dashboard/categories");
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary text-3xl">
            Update Category
          </CardTitle>
          <CardDescription>
            Edit the details of the &quot;{category.name}&quot; category
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

              {/* Current Image Preview */}
              {category.image && (
                <Field>
                  <FieldLabel>Current Image</FieldLabel>
                  <div className="relative aspect-video w-full max-w-sm overflow-hidden rounded-lg border">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                </Field>
              )}

              {/* Image Upload field */}
              <Field>
                <FieldLabel>
                  {category.image ? "Replace Image" : "Category Image"}
                </FieldLabel>
                <ImageUpload ref={imageUploadRef} folder="foodhub/categories" />
                <FieldDescription>
                  {category.image
                    ? "Select a new image to replace the current one, or leave empty to keep it"
                    : "Select an image for this category"}
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" disabled={form.state.isSubmitting}>
                  {form.state.isSubmitting ? "Updating..." : "Update Category"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
