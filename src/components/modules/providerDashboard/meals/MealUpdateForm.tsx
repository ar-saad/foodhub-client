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
import { Category, Meal } from "@/types";
import { updateMeal } from "@/actions/meal.actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useUser } from "@/contexts/UserContext";

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

export default function MealUpdateForm({
  meal,
  categories,
}: {
  meal: Meal;
  categories: Category[];
}) {
  const { user } = useUser();
  const imageUploadRef = useRef<ImageUploadRef>(null);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: meal.name,
      categoryId: meal.categoryId,
      description: meal.description,
      price: Number(meal.price) || 0,
      isAvailable: meal.isAvailable,
      isFeatured: meal.isFeatured,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      const toastId = toast.loading("Updating meal");
      try {
        // Check if user selected a new image
        let imageUrl = meal.image; // Default to existing image
        const hasNewImage = imageUploadRef.current?.hasFileSelected();

        if (hasNewImage) {
          // Upload new image only if user selected one
          imageUrl =
            (await imageUploadRef.current?.uploadToCloudinary()) || meal.image;

          // Validate the uploaded URL
          try {
            new URL(imageUrl); // Check if it's a valid URL
          } catch {
            toast.error("Invalid image URL received", { id: toastId });
            return;
          }
        }

        const payload = {
          mealId: meal.id,
          providerId: user?.providerProfile?.id || "",
          categoryId: value.categoryId,
          name: value.name,
          description: value.description,
          price: value.price,
          image: imageUrl,
          isAvailable: value.isAvailable,
          isFeatured: value.isFeatured,
        };

        const { data, error } = await updateMeal(payload);

        if (error) {
          toast.error(error.message, { id: toastId });
          return;
        }

        toast.success("Meal updated successfully", { id: toastId });
        router.push("/provider-dashboard/meals");
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong", { id: toastId });
      } finally {
      }
    },
  });

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary">Update Meal</CardTitle>
          <CardDescription>Update your meal information</CardDescription>
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

              <Field>
                <FieldLabel>Current Image</FieldLabel>
                <div className="relative">
                  <Image
                    src={meal?.image}
                    alt="meal photo"
                    width={350}
                    height={250}
                    className="max-h-64 max-w-87 h-auto w-auto object-contain"
                  />
                </div>
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
                {form.state.isSubmitting ? "Updating Meal..." : "Update Meal"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
