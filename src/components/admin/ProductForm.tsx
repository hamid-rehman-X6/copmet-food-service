// Admin product form wired with React Hook Form and Zod.
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { productSchema, type ProductSchema, type ProductSchemaInput } from "@/schemas/product.schema";

interface ProductFormProps {
  defaultValues?: ProductSchemaInput;
  onSubmitForm: (values: ProductSchema) => Promise<void>;
}

export function ProductForm({ defaultValues, onSubmitForm }: ProductFormProps) {
  const { handleSubmit, register, formState } = useForm<ProductSchemaInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      isAvailable: true,
      isFeatured: false,
      ...defaultValues,
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(async (values) => {
        await onSubmitForm(productSchema.parse(values));
      })}
    >
      <Input placeholder="Product name" {...register("name")} />
      <Input placeholder="Slug" {...register("slug")} />
      <Input placeholder="Description" {...register("description")} />
      <Input placeholder="Category ID" {...register("categoryId")} />
      <Input placeholder="Category name" {...register("categoryName")} />
      <Input placeholder="Price" step="0.01" type="number" {...register("price", { valueAsNumber: true })} />
      <Input placeholder="Unit label" {...register("unitLabel")} />
      <Input placeholder="Image URL" {...register("imageUrl")} />
      <div className="text-sm text-red-600">
        {Object.values(formState.errors)[0]?.message?.toString()}
      </div>
      <Button className="w-full" type="submit">
        Save Product
      </Button>
    </form>
  );
}
