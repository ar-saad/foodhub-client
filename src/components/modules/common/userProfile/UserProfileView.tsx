import { getCurrentUser, getUser } from "@/actions/user.actions";
import { User } from "@/types/user.type";
import { UserRoles } from "@/constants/userRoles";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  XCircle,
  SquarePen,
} from "lucide-react";
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
      <div className="min-h-[calc(100vh-6rem)] bg-background flex items-center justify-center p-6">
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
    <div className="min-h-[calc(100vh-6rem)] bg-background">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Header */}
        <Card className="p-8 shadow-lg border-slate-200/60 bg-background/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
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
                    className="w-28 h-28 rounded-2xl object-cover ring-4 ring-border group-hover:ring-border/80 transition-all duration-300 shadow-md"
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-secondary flex items-center justify-center ring-4 ring-border shadow-md">
                  <span className="text-4xl font-bold text-muted-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 min-w-0 space-y-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-2">
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
        <Card className="p-6 shadow-lg border-border/60 bg-background/80 backdrop-blur-sm hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
            <div className="w-1 h-6 bg-linear-to-b from-blue-500 to-blue-600 rounded-full"></div>
            Contact Information
          </h2>
          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                  Email
                </p>
                <p className="text-foreground font-medium break-all">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Phone */}
            {user.phone && (
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Phone
                  </p>
                  <p className="text-foreground font-medium">{user.phone}</p>
                </div>
              </div>
            )}

            {/* Address */}
            {user.address && (
              <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200">
                <div className="p-2 bg-amber-500/10 rounded-lg">
                  <MapPin className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                    Address
                  </p>
                  <p className="text-foreground font-medium">{user.address}</p>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-4 pt-3 mt-3 border-t border-border">
              <div className="flex-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                  Account Status
                </p>
                <Badge variant="outline">{user.status}</Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* User ID (for reference) */}
        <div className="text-center py-2">
          <p className="text-xs text-muted-foreground font-medium">
            User ID:{" "}
            <code className="bg-muted px-3 py-1.5 rounded-md text-muted-foreground font-mono">
              {user.id}
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}
