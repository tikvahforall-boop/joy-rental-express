"use client";

import { useState, useEffect } from "react";
import {
  Camera,
  Upload,
  CheckCircle2,
  Shield,
  FileText,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";

type VerificationStatus = "NOT_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";

type Profile = {
  id: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  avatarUrl: string | null;
  dateOfBirth: string | null;
  role: string;
  identityVerification: { status: VerificationStatus; createdAt: string } | null;
  driverLicenseVerification: {
    status: VerificationStatus;
    expirationDate: string | null;
    createdAt: string;
  } | null;
};

function getVerificationBadge(status: VerificationStatus) {
  switch (status) {
    case "APPROVED":
      return <Badge variant="success">Approved</Badge>;
    case "PENDING":
      return <Badge variant="warning">Pending</Badge>;
    case "REJECTED":
      return <Badge variant="error">Rejected</Badge>;
    default:
      return <Badge variant="outline">Not Submitted</Badge>;
  }
}

function ProfileSkeleton() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <div>
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-4 w-64" />
      </div>
      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-28" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-56" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-32" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/users/profile");
        if (res.ok) {
          const data = await res.json();
          const user = data.data || data;
          setProfile(user);
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setPhone(user.phone || "");
          setDateOfBirth(
            user.dateOfBirth
              ? new Date(user.dateOfBirth).toISOString().split("T")[0]
              : ""
          );
        }
      } catch {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phone: phone || undefined,
          dateOfBirth: dateOfBirth || undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const updated = data.data || data;
        setProfile((prev) => (prev ? { ...prev, ...updated } : prev));
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError("Failed to save profile");
      }
    } catch {
      setError("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  const fullName = `${firstName} ${lastName}`.trim();
  const licenseStatus: VerificationStatus =
    profile?.driverLicenseVerification?.status || "NOT_SUBMITTED";
  const identityStatus: VerificationStatus =
    profile?.identityVerification?.status || "NOT_SUBMITTED";

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal information and verification documents.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
          <div className="relative">
            {profile?.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={fullName}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">
                {getInitials(fullName || "U")}
              </div>
            )}
            <button className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-600 text-white transition-colors hover:bg-green-700">
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold text-gray-900">
              {fullName || "Your Name"}
            </p>
            {profile?.email && (
              <p className="text-sm text-gray-500">{profile.email}</p>
            )}
            <Button variant="outline" size="sm" className="mt-2">
              <Camera className="mr-1.5 h-3.5 w-3.5" />
              Upload Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details below.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
            />
            <Input
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
            />
          </div>
          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            type="tel"
          />
          <Input
            label="Date of Birth"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            type="date"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-500" />
                Driver License
              </CardTitle>
              <CardDescription className="mt-1">
                Upload a valid driver license for verification.
              </CardDescription>
            </div>
            {getVerificationBadge(licenseStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-green-400">
            <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG or PDF up to 10MB
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Select File
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-gray-500" />
                Identity Verification
              </CardTitle>
              <CardDescription className="mt-1">
                Upload a government-issued ID for identity verification.
              </CardDescription>
            </div>
            {getVerificationBadge(identityStatus)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center transition-colors hover:border-green-400">
            <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
            <p className="text-sm font-medium text-gray-700">
              Click to upload or drag and drop
            </p>
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG or PDF up to 10MB
            </p>
            <Button variant="outline" size="sm" className="mt-4">
              Select File
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={handleSave} loading={saving}>
          Save Changes
        </Button>
        {saved && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            Profile updated successfully
          </div>
        )}
        {error && (
          <p className="text-sm font-medium text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
