'use client';

import { useState } from 'react';
import {
  ShieldCheck,
  CircleUserRound,
  LockKeyhole,
  Database,
  ChevronRight,
  Settings2
} from 'lucide-react';
import { AdminUser } from '@/types/admin';

// Import sub-components
import { AccountTab } from './tabs/AccountTab';
import { SecurityTab } from './tabs/SecurityTab';
import { MaintenanceTab } from './tabs/MaintenanceTab';

interface ProfileClientViewProps {
  admin: AdminUser;
  initialPendingCount: number;
}

type SettingsTab = 'account' | 'security' | 'maintenance';

export function ProfileClientView({
  admin,
  initialPendingCount
}: ProfileClientViewProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [pendingCount, setPendingCount] = useState(initialPendingCount);

  const tabs = [
    {
      id: 'account' as const,
      label: 'Account',
      description: 'Profile information',
      icon: CircleUserRound
    },
    {
      id: 'security' as const,
      label: 'Security',
      description: 'Password & access',
      icon: LockKeyhole
    },
    {
      id: 'maintenance' as const,
      label: 'Maintenance',
      shortLabel: 'Storage',
      description: 'Storage cleanup',
      icon: Database
    }
  ];

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[var(--accent)]">
            <Settings2 size={14} />
            <span>Administration</span>
            <ChevronRight size={13} className="opacity-40" />
            <span className="text-[var(--text-muted)]">Settings</span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)] sm:text-3xl">
                Profile Settings
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
                Manage your administrator account, security credentials, and
                system maintenance.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-[var(--text-secondary)]">
                Account active
              </span>
            </div>
          </div>
        </div>

        {/* Status Card Header */}
        <div className="mb-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-4 p-4 sm:p-5">
              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/10 text-lg font-bold text-[var(--accent)] ring-1 ring-inset ring-[var(--accent)]/20">
                {admin.username.charAt(0).toUpperCase()}
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-emerald-500" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[var(--text-primary)] sm:text-base">
                  {admin.username}
                </p>
                <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-emerald-500">
                  <ShieldCheck size={14} />
                  <span>Full Admin Privileges</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 border-t border-[var(--border)] sm:border-l sm:border-t-0">
              <div className="border-r border-[var(--border)] px-5 py-4 sm:px-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Status
                </p>
                <p className="mt-1 text-xs font-bold text-emerald-500">
                  Active
                </p>
              </div>
              <div className="px-5 py-4 sm:px-6">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                  Pending
                </p>
                <p className="mt-1 text-xs font-bold text-[var(--text-primary)]">
                  {pendingCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-5 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] sm:mb-6">
          <div className="grid grid-cols-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`relative flex min-w-0 items-center justify-center gap-2 px-2 py-3.5 transition-colors sm:justify-start sm:gap-3 sm:px-5 sm:py-4 ${
                    isActive
                      ? 'bg-[var(--accent)]/[0.07] text-[var(--accent)]'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)]/50 hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon
                    size={17}
                    className="shrink-0 sm:h-[18px] sm:w-[18px]"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-bold sm:text-sm">
                      <span className="sm:hidden">
                        {tab.shortLabel || tab.label}
                      </span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </span>
                    <span className="mt-0.5 hidden truncate text-[10px] text-[var(--text-muted)] md:block">
                      {tab.description}
                    </span>
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-[var(--accent)] sm:left-4 sm:right-4" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Views */}
        {activeTab === 'account' && <AccountTab admin={admin} />}
        {activeTab === 'security' && <SecurityTab />}
        {activeTab === 'maintenance' && (
          <MaintenanceTab
            pendingCount={pendingCount}
            onUpdateCount={setPendingCount}
          />
        )}
      </div>
    </div>
  );
}
