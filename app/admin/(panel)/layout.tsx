import { AdminSidebar } from '@/components/admin/AdminSidebar';

/** Always fetch fresh orders/stats — never bake admin data in at build time. */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#FBFBFA]">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
