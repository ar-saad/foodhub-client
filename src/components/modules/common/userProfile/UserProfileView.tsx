import { getCurrentUser, getUser } from "@/actions/user.actions";
import { User } from "@/types/user.type";
import { UserRoles } from "@/constants/userRoles";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Mail, Phone, CheckCircle2, XCircle, SquarePen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface UserProfileViewProps {
  userId?: string;
}

export default async function UserProfileViewPage({
  userId,
}: UserProfileViewProps) {
  let user: User | null = null;
  let error: string | null = null;

  try {
    // Fetch user data based on whether userId is provided
    const result = userId ? await getUser(userId) : await getCurrentUser();

    if (result.error || !result.data) {
      error = result.error?.message || "Failed to load user profile";
    } else {
      user = result.data.data;
    }
  } catch (err) {
    error = "An unexpected error occurred";
  }

  if (error || !user) {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-linear-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-6">
        <Card className="p-8 border-red-200 bg-red-50/50 backdrop-blur-sm">
          <p className="text-red-700 font-medium">
            {error || "User profile not found"}
          </p>
        </Card>
      </div>
    );
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case UserRoles.admin:
        return "Administrator";
      case UserRoles.provider:
        return "Restaurant Partner";
      case UserRoles.customer:
      default:
        return "Customer";
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-linear-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="p-8 shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative group">
              {user.image ? (
                <div className="relative">
                  <Image
                    src={user.image}
                    alt={user.name}
                    height={300}
                    width={300}
                    className="w-28 h-28 rounded-2xl object-cover ring-4 ring-slate-200/50 group-hover:ring-slate-300/70 transition-all duration-300 shadow-md"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-slate-200 to-slate-300 flex items-center justify-center ring-4 ring-slate-200/50 shadow-md">
                  <span className="text-4xl font-bold text-slate-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2">
                  {user.name}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{getRoleLabel(user.role)}</Badge>
                  <Badge
                    variant={user.emailVerified ? "default" : "destructive"}
                  >
                    {user.emailVerified ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Email Verified
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" />
                        Email Not Verified
                      </>
                    )}
                  </Badge>
                </div>
                <div className="mt-3">
                  <Link
                    href={
                      user.role === "ADMIN"
                        ? "/admin-dashboard/profile/update"
                        : user.role === "PROVIDER"
                          ? "/provider-dashboard/profile/update"
                          : "/dashboard/profile/update"
                    }
                  >
                    <Button size="xs">
                      Update <SquarePen />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Contact Information */}
        <Card className="p-6 shadow-lg border-slate-200/60 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
            Contact Information
          </h2>
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50/50 transition-colors duration-200">
              <div className="p-2 bg-linear-to-br from-blue-50 to-blue-100 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-slate-900 font-medium break-all">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50/50 transition-colors duration-200">
                <div className="p-2 bg-linear-to-br from-emerald-50 to-emerald-100 rounded-lg">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    Phone
                  </p>
                  <p className="text-slate-900 font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-4 pt-3 mt-3 border-t border-slate-100">
              <div className="flex-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                  Account Status
                </p>
                <Badge variant="outline">{user.status}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* User ID (for reference) */}
        <div className="text-center py-2">
          <p className="text-xs text-slate-400 font-medium">
            User ID:{" "}
            <code className="bg-slate-100 px-3 py-1.5 rounded-md text-slate-600 font-mono">
              {user.id}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
