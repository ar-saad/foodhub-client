"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import Link from "next/link";

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  blogs: "Blogs",
  users: "Users",
  settings: "Settings",
};

function formatSegment(segment: string) {
  return (
    LABEL_MAP[segment] ??
    segment.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())
  );
}

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  let href = "";

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          href += `/${segment}`;
          const isLast = index === segments.length - 1;

          return (
            <div key={href} className="flex items-center">
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{formatSegment(segment)}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>

              {!isLast && <BreadcrumbSeparator />}
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
