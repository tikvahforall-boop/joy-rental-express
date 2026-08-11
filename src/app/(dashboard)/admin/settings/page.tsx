"use client";

import { useEffect, useState, useCallback } from "react";
import { Shield, Save, CheckCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { PLATFORM_FEE_OPTIONS } from "@/lib/constants";

interface ConfigItem {
  id: string;
  key: string;
  value: unknown;
  category: string;
}

interface FormValues {
  host_fee_rate: string;
  renter_fee_rate: string;
  tax_rate: string;
  insurance_enabled: boolean;
  sandbox_mode: boolean;
}

const FEE_SELECT_OPTIONS = PLATFORM_FEE_OPTIONS.map((v) => ({
  value: String(v),
  label: `${v}%`,
}));

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [configs, setConfigs] = useState<ConfigItem[]>([]);
  const [formValues, setFormValues] = useState<FormValues>({
    host_fee_rate: "12",
    renter_fee_rate: "10",
    tax_rate: "0",
    insurance_enabled: false,
    sandbox_mode: false,
  });
  const [initialValues, setInitialValues] = useState<FormValues>({
    host_fee_rate: "12",
    renter_fee_rate: "10",
    tax_rate: "0",
    insurance_enabled: false,
    sandbox_mode: false,
  });

  const getConfigValue = useCallback(
    (items: ConfigItem[], key: string, fallback: unknown) => {
      const item = items.find((c) => c.key === key);
      return item ? item.value : fallback;
    },
    []
  );

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const session = await res.json();
        if (!session?.user || session.user.role !== "ADMIN") {
          setAuthorized(false);
          setLoading(false);
          return;
        }
        setAuthorized(true);
        fetchConfig();
      } catch {
        setAuthorized(false);
        setLoading(false);
      }
    }

    async function fetchConfig() {
      try {
        const res = await fetch("/api/admin/config");
        if (!res.ok) throw new Error("Failed to load configuration");
        const data: ConfigItem[] = await res.json();
        setConfigs(data);
        const values: FormValues = {
          host_fee_rate: String(getConfigValue(data, "host_fee_rate", "12")),
          renter_fee_rate: String(
            getConfigValue(data, "renter_fee_rate", "10")
          ),
          tax_rate: String(getConfigValue(data, "tax_rate", "0")),
          insurance_enabled: Boolean(
            getConfigValue(data, "insurance_enabled", false)
          ),
          sandbox_mode: Boolean(getConfigValue(data, "sandbox_mode", false)),
        };
        setFormValues(values);
        setInitialValues(values);
      } catch {
        setFormValues({
          host_fee_rate: "12",
          renter_fee_rate: "10",
          tax_rate: "0",
          insurance_enabled: false,
          sandbox_mode: false,
        });
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [getConfigValue]);

  const getCategoryForKey = (key: string): string => {
    const item = configs.find((c) => c.key === key);
    if (item) return item.category;
    if (key.includes("fee") || key.includes("rate")) return "fees";
    if (key.includes("tax")) return "tax";
    return "features";
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccessMessage("");

    const changes: { key: string; value: unknown; category: string }[] = [];

    if (formValues.host_fee_rate !== initialValues.host_fee_rate) {
      changes.push({
        key: "host_fee_rate",
        value: Number(formValues.host_fee_rate),
        category: getCategoryForKey("host_fee_rate"),
      });
    }
    if (formValues.renter_fee_rate !== initialValues.renter_fee_rate) {
      changes.push({
        key: "renter_fee_rate",
        value: Number(formValues.renter_fee_rate),
        category: getCategoryForKey("renter_fee_rate"),
      });
    }
    if (formValues.tax_rate !== initialValues.tax_rate) {
      changes.push({
        key: "tax_rate",
        value: Number(formValues.tax_rate),
        category: getCategoryForKey("tax_rate"),
      });
    }
    if (formValues.insurance_enabled !== initialValues.insurance_enabled) {
      changes.push({
        key: "insurance_enabled",
        value: formValues.insurance_enabled,
        category: getCategoryForKey("insurance_enabled"),
      });
    }
    if (formValues.sandbox_mode !== initialValues.sandbox_mode) {
      changes.push({
        key: "sandbox_mode",
        value: formValues.sandbox_mode,
        category: getCategoryForKey("sandbox_mode"),
      });
    }

    try {
      for (const change of changes) {
        const res = await fetch("/api/admin/config", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(change),
        });
        if (!res.ok) throw new Error(`Failed to update ${change.key}`);
      }
      setInitialValues({ ...formValues });
      setSuccessMessage("Settings saved successfully");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err) {
      setSuccessMessage("");
      alert(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (authorized === false) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <Card className="max-w-md text-center">
          <CardHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              You do not have permission to access platform settings.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div>
          <Skeleton className="mb-1 h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure fees, taxes, and platform features
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3">
          <CheckCircle className="h-4 w-4 shrink-0 text-neutral-800" />
          <p className="text-sm font-medium text-black">
            {successMessage}
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Fee Settings</CardTitle>
          <CardDescription>
            Configure platform fee rates for hosts and renters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Select
              label="Host Fee Rate"
              options={FEE_SELECT_OPTIONS}
              value={formValues.host_fee_rate}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  host_fee_rate: e.target.value,
                }))
              }
            />
            <Select
              label="Renter Fee Rate"
              options={FEE_SELECT_OPTIONS}
              value={formValues.renter_fee_rate}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  renter_fee_rate: e.target.value,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tax Settings</CardTitle>
          <CardDescription>
            Set the tax rate applied to bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs">
            <Input
              label="Tax Rate (%)"
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={formValues.tax_rate}
              onChange={(e) =>
                setFormValues((prev) => ({
                  ...prev,
                  tax_rate: e.target.value,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature Toggles</CardTitle>
          <CardDescription>
            Enable or disable platform features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Insurance Enabled
                </p>
                <p className="text-xs text-gray-500">
                  Allow renters to purchase insurance coverage
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formValues.insurance_enabled}
                onClick={() =>
                  setFormValues((prev) => ({
                    ...prev,
                    insurance_enabled: !prev.insurance_enabled,
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  formValues.insurance_enabled ? "bg-neutral-800" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow ring-0 transition-transform ${
                    formValues.insurance_enabled
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Sandbox Mode
                </p>
                <p className="text-xs text-gray-500">
                  Enable test mode for payment processing
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={formValues.sandbox_mode}
                onClick={() =>
                  setFormValues((prev) => ({
                    ...prev,
                    sandbox_mode: !prev.sandbox_mode,
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                  formValues.sandbox_mode ? "bg-neutral-800" : "bg-gray-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 translate-y-0.5 rounded-full bg-white shadow ring-0 transition-transform ${
                    formValues.sandbox_mode
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} loading={saving}>
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
