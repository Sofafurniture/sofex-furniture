import dynamic from 'next/dynamic';

const SofaConfigurator = dynamic(() => import('@/components/SofaConfigurator'), {
  loading: () => (
    <div className="min-h-screen bg-[#FBFBFA] flex items-center justify-center">
      <p className="text-sm text-[#64625D] animate-pulse">Loading configurator…</p>
    </div>
  ),
});

export default function ConfiguratorPage() {
  return <SofaConfigurator />;
}
