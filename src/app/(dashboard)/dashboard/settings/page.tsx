"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Mail,
  Lock,
  Bell,
  Trash2,
  AlertTriangle,
  Eye,
  EyeOff,
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type NotificationPreference = {
  id: string;
  label: string;
  description: string;
  email: boolean;
  sms: boolean;
  inApp: boolean;
};

const DEFAULT_NOTIFICATIONS: NotificationPreference[] = [
  {
    id: "booking_updates",
    label: "Booking Updates",
    description: "Notifications about booking confirmations, changes, and cancellations",
    email: true,
    sms: true,
    inApp: true,
  },
  {
    id: "messages",
    label: "Messages",
    description: "New messages from hosts or renters",
    email: true,
    sms: false,
    inApp: true,
  },
  {
    id: "promotions",
    label: "Promotions & Offers",
    description: "Special deals and promotional offers",
    email: true,
    sms: false,
    inApp: false,
  },
  {
    id: "reviews",
    label: "Reviews",
    description: "When someone leaves a review for you",
    email: true,
    sms: false,
    inApp: true,
  },
  {
    id: "reminders",
    label: "Trip Reminders",
    description: "Reminders about upcoming pickups and returns",
    email: true,
    sms: true,
    inApp: true,
  },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-800 focus:ring-offset-2",
        checked ? "bg-neutral-800" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [notifications, setNotifications] = useState<NotificationPreference[]>(
    DEFAULT_NOTIFICATIONS
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handlePasswordChange = () => {
    setPasswordError("");
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 3000);
  };

  const toggleNotification = (
    id: string,
    channel: "email" | "sms" | "inApp"
  ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, [channel]: !n[channel] } : n
      )
    );
  };

  const email = session?.user?.email || "";

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-16" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account preferences and security.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-500" />
            Email Address
          </CardTitle>
          <CardDescription>
            Your email is used for login and notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Input
            value={email}
            disabled
            label="Email"
            helperText="Contact support to change your email address."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-gray-500" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              label="Current Password"
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="relative">
            <Input
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              helperText="Must be at least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
          />
          {passwordError && (
            <p className="text-sm text-red-600">{passwordError}</p>
          )}
          {passwordSuccess && (
            <p className="text-sm text-neutral-800">
              Password updated successfully.
            </p>
          )}
          <Button onClick={handlePasswordChange}>Update Password</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-500" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left text-sm font-medium text-gray-500">
                    Notification
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-500">
                    Email
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-500">
                    SMS
                  </th>
                  <th className="pb-3 text-center text-sm font-medium text-gray-500">
                    In-App
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {notifications.map((pref) => (
                  <tr key={pref.id}>
                    <td className="py-4 pr-4">
                      <p className="text-sm font-medium text-gray-900">
                        {pref.label}
                      </p>
                      <p className="mt-0.5 text-xs text-gray-500">
                        {pref.description}
                      </p>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center">
                        <Toggle
                          checked={pref.email}
                          onChange={() =>
                            toggleNotification(pref.id, "email")
                          }
                        />
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center">
                        <Toggle
                          checked={pref.sms}
                          onChange={() =>
                            toggleNotification(pref.id, "sms")
                          }
                        />
                      </div>
                    </td>
                    <td className="py-4 text-center">
                      <div className="flex justify-center">
                        <Toggle
                          checked={pref.inApp}
                          onChange={() =>
                            toggleNotification(pref.id, "inApp")
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible actions that affect your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Delete Account
              </p>
              <p className="text-xs text-gray-500">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogHeader onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>
        <DialogContent>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-900">
                Are you sure you want to delete your account? This action is
                permanent and cannot be undone.
              </p>
              <p className="mt-2 text-sm text-gray-500">
                All your data including bookings, reviews, and messages will be
                permanently removed.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setDeleteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button variant="destructive">Delete My Account</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
