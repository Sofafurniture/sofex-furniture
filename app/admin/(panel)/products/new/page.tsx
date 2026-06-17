import { ProductForm } from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div className="p-8 lg:p-12">
      <div className="mb-10">
        <h1 className="text-3xl font-light tracking-tight">Add Product</h1>
        <p className="text-sm text-[#64625D] mt-1">Create a new sofa with images, description and reviews</p>
      </div>
      <ProductForm />
    </div>
  );
}
