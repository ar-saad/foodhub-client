"use client";

import { Meal } from "@/types/meal.type";
import MealCard from "./MealCard";

interface RelatedMealsProps {
  meals: Meal[];
  title: string;
}

export default function RelatedMeals({ meals, title }: RelatedMealsProps) {
  if (meals.length === 0) return null;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {meals.map((meal) => (
          <MealCard meal={meal} key={meal.id} />
        ))}
      </div>
    </div>
  );
}
