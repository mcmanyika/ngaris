import { Suspense } from "react";

import {
  DashboardContractorsSection,
  DashboardProjectsSection,
} from "@/components/admin/dashboard-lists";
import {
  SpeedometerGauges,
  type SpeedometerMetric,
} from "@/components/admin/speedometer-gauge";
import { listLeads } from "@/lib/firebase/leads";
import { listProjects } from "@/lib/firebase/projects";
import { listProviders } from "@/lib/firebase/providers";
import { getVerifiedSession } from "@/lib/firebase/session";

export const instant = false;

export const metadata = {
  title: "Admin",
  description: "Ngaris Construction admin dashboard.",
};

function gaugeMax(value: number, floor = 5) {
  return Math.max(floor, Math.ceil(value * 1.25) || floor);
}

function StatsFallback() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {["Leads", "Contractors", "Projects"].map((title) => (
        <div
          key={title}
          className="rounded-2xl border border-[#032842]/6 bg-white p-5 shadow-[0_12px_32px_rgba(3,40,66,0.05)]"
        >
          <h2 className="text-center text-base font-semibold">{title}</h2>
          <p className="mt-10 text-center text-sm text-[#032842]/35">Loading…</p>
        </div>
      ))}
    </div>
  );
}

async function DashboardStats() {
  const session = await getVerifiedSession();
  const [leads, providers, projects] = await Promise.all([
    listLeads({ limit: 100 }),
    listProviders({ limit: 100 }),
    listProjects({ limit: 100 }),
  ]);

  const verifiedCount = providers.filter(
    (p) => p.verificationStatus === "verified",
  ).length;
  const openLeads = leads.filter(
    (l) => l.status === "new" || l.status === "contacted",
  ).length;
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const metrics: SpeedometerMetric[] = [
    {
      title: "Leads",
      href: "/admin/leads",
      value: leads.length,
      max: gaugeMax(leads.length),
      detail:
        openLeads > 0
          ? `${openLeads} open`
          : leads.length
            ? "All reviewed"
            : "None yet",
    },
    {
      title: "Contractors",
      href: "/admin/providers",
      value: providers.length,
      max: gaugeMax(providers.length),
      detail:
        verifiedCount > 0
          ? `${verifiedCount} verified`
          : providers.length
            ? "Awaiting review"
            : "None yet",
    },
    {
      title: "Projects",
      href: "/admin/projects",
      value: projects.length,
      max: gaugeMax(projects.length),
      detail:
        activeProjects > 0
          ? `${activeProjects} active`
          : projects.length
            ? "None active"
            : "None yet",
    },
  ];

  const projectItems = projects.map((project) => ({
    id: project.id,
    title: project.title,
    clientName: project.clientName,
    location: project.location,
    status: project.status,
    contractorName: project.contractorName,
  }));

  const contractorItems = providers.map((provider) => ({
    id: provider.id,
    companyName: provider.companyName,
    city: provider.city,
    trade: provider.trade,
    verificationStatus: provider.verificationStatus,
  }));

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Welcome{session?.email ? `, ${session.email.split("@")[0]}` : ""}
      </h1>

      <SpeedometerGauges metrics={metrics} />

      {projectItems.length > 0 || contractorItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {projectItems.length > 0 ? (
            <div className="lg:col-span-6">
              <DashboardProjectsSection items={projectItems} />
            </div>
          ) : null}
          {contractorItems.length > 0 ? (
            <div className="lg:col-span-6">
              <DashboardContractorsSection items={contractorItems} />
            </div>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<StatsFallback />}>
        <DashboardStats />
      </Suspense>
    </div>
  );
}
