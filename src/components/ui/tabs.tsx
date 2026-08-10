"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = React.useContext(TabsContext);
  if (!context) throw new Error("Tab components must be used within a Tabs provider");
  return context;
}

export interface TabsProps {
  defaultTab: string;
  value?: string;
  onChange?: (tab: string) => void;
  children: React.ReactNode;
  className?: string;
}

function Tabs({ defaultTab, value, onChange, children, className }: TabsProps) {
  const [internalTab, setInternalTab] = React.useState(defaultTab);
  const activeTab = value ?? internalTab;

  const setActiveTab = React.useCallback(
    (id: string) => {
      if (!value) setInternalTab(id);
      onChange?.(id);
    },
    [value, onChange]
  );

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {}

function TabList({ className, ...props }: TabListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex border-b border-gray-200",
        className
      )}
      {...props}
    />
  );
}

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

function Tab({ value, className, children, ...props }: TabProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      className={cn(
        "relative px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
        isActive
          ? "text-green-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-green-600"
          : "text-gray-500 hover:text-gray-700",
        className
      )}
      onClick={() => setActiveTab(value)}
      {...props}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

function TabPanel({ value, className, children, ...props }: TabPanelProps) {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn("pt-4", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { Tabs, TabList, Tab, TabPanel };
