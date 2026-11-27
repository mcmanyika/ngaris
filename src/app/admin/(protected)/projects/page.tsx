import { Suspense } from "react";

import {
  ProjectCreateForm,
  type ContractorOption,
} from "@/components/admin/project-create-form";
import {
  ProjectsList,
  type ProjectListItem,
} from "@/components/admin/projects-list";
import { listProjects } from "@/lib/firebase/projects";
import { listProviders } from "@/lib/firebase/providers";

export const instant = false;

export const metadata = {
  title: "Projects",
  description: "Manage construction projects.",
};

function formatDate(millis: number | undefined) {
  if (!millis) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(millis));
}

function ListFallback() {
  return (
    <div className="rounded-2xl border border-[#032842]/8 bg-white px-6 py-10 text-sm text-[#032842]/45">
      Loading…
    </div>
  );
}

async function ProjectsContent() {
  const [projects, providers] = await Promise.all([
    listProjects({ limit: 100 }),
    listProviders({ limit: 100 }),
  ]);

  const contractors: ContractorOption[] = providers
    .filter((p) => p.verificationStatus === "verified")
    .map((p) => ({
      id: p.id,
      companyName: p.companyName,
      city: p.city,
    }));

  const items: ProjectListItem[] = projects.map((project) => ({
    id: project.id,
    title: project.title,
    location: project.location,
    clientName: project.clientName,
    clientEmail: project.clientEmail,
    clientPhone: project.clientPhone,
    contractorId: project.contractorId,
    contractorName: project.contractorName,
    status: project.status,
    notes: project.notes,
    createdLabel: formatDate(project.createdAt?.toMillis?.()),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <ProjectCreateForm contractors={contractors} />
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#032842]/15 bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-[#032842]">No projects yet</p>
        </div>
      ) : (
        <ProjectsList items={items} contractors={contractors} />
      )}
    </div>
  );
}

export default function AdminProjectsPage() {
  return (
    <div className="space-y-8">
      <Suspense fallback={<ListFallback />}>
        <ProjectsContent />
      </Suspense>
    </div>
  );
}
