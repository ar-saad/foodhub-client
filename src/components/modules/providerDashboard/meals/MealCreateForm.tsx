"use client";

import { useRef } from "react";
import { useForm } from "@tanstack/react-form";
import * as z from "zod";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Category } from "@/types";
import { createMeal } from "@/actions/meal.actions";
import { User } from "@/types/user.type";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must not exceed 100 characters"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  price: z
    .number()
    .positive("Price must be greater than 0")
    .max(10000, "Price seems too high"),
  isAvailable: z.boolean(),
  isFeatured: z.boolean(),
});

export default function MealCreateForm({
  categories,
  user,
}: {
  categories: Category[];
  user: User;
}) {
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      price: 0,
      isAvailable: true,
      isFeatured: false,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Creating meal");
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

        const payload = {
          providerId: user?.providerProfile?.id || "",
          categoryId: value.categoryId,
          name: value.name,
          description: value.description,
          price: value.price,
          image: imageUrl,
          isAvailable: value.isAvailable,
          isFeatured: value.isFeatured,
        };

        const { data, error } = await createMeal(payload);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Meal created successfully", { id: toastId });
        router.push("/provider-dashboard/meals");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong", { id: toastId });
      } finally {
      }
    },
  });

  console.log(user);

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Create Meal</CardTitle>
          <CardDescription>Add a new meal to your menu</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <FieldGroup className="space-y-6">
              {/* Category Field with Select */}
              <form.Field
                name="categoryId"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel>Category</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) => field.handleChange(value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.emoji} {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Name Field */}
              <form.Field
                name="name"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Meal Name</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        placeholder="e.g., Margherita Pizza, Caesar Salad"
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
                  const charCount = field.state.value.length;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder="Describe your meal, including ingredients, preparation method, and what makes it special..."
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        rows={4}
                        maxLength={500}
                      />

                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Price Field */}
              <form.Field
                name="price"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Price (৳)</FieldLabel>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                          ৳
                        </span>
                        <Input
                          id={field.name}
                          name={field.name}
                          placeholder="499"
                          type="number"
                          step="1"
                          min="1"
                          value={field.state.value || ""}
                          onChange={(e) =>
                            field.handleChange(Number(e.target.value))
                          }
                          onBlur={field.handleBlur}
                          className="pl-7"
                        />
                      </div>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />

              {/* Image Upload Field */}
              <Field>
                <FieldLabel>Image</FieldLabel>
                <ImageUpload ref={imageUploadRef} folder="foodhub/meals" />
              </Field>

              {/* isAvailable Checkbox */}
              <form.Field
                name="isAvailable"
                children={(field) => (
                  <Field>
                    <div className="flex items-start gap-3 rounded-lg border p-4">
                      <input
                        type="checkbox"
                        id="isAvailable"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <FieldLabel
                          htmlFor="isAvailable"
                          className="mb-1 cursor-pointer"
                        >
                          Available for Orders
                        </FieldLabel>
                        <FieldDescription className="mt-0">
                          Mark this meal as available for customers to order
                          right now
                        </FieldDescription>
                      </div>
                    </div>
                  </Field>
                )}
              />

              {/* isFeatured Checkbox */}
              <form.Field
                name="isFeatured"
                children={(field) => (
                  <Field>
                    <div className="flex items-start gap-3 rounded-lg border p-4 bg-muted/30">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={field.state.value}
                        onChange={(e) => field.handleChange(e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-gray-300"
                      />
                      <div className="flex-1">
                        <FieldLabel
                          htmlFor="isFeatured"
                          className="mb-1 cursor-pointer"
                        >
                          Featured Meal
                        </FieldLabel>
                        <FieldDescription className="mt-0">
                          Highlight this meal on your restaurant's homepage and
                          featured sections
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
                {form.state.isSubmitting ? "Creating Meal..." : "Create Meal"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
