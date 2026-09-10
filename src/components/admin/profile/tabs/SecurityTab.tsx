import { useState } from 'react';
import { KeyRound, Eye, EyeOff, Check, CheckCircle2, X } from 'lucide-react';
import { updateAdminProfileClient } from '@/lib/services/admin-profile.client';
import { SettingsFooter } from '../SettingsFooter';

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Validation Rules
  const hasLength = newPassword.length >= 8;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

  const requirementCount = [
    hasLength,
    hasUpper,
    hasLower,
    hasNumber,
    hasSpecial
  ].filter(Boolean).length;

  const isRequirementsMet =
    hasLength && hasUpper && hasLower && hasNumber && hasSpecial;

  const passwordsMatch =
    newPassword === confirmPassword && newPassword.length > 0;

  const isPasswordValid = !newPassword || (isRequirementsMet && passwordsMatch);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (!isRequirementsMet) {
      setError(
        'Please ensure your new password meets all security requirements.'
      );
      return;
    }
    if (!passwordsMatch) {
      setError('New password and confirm password do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await updateAdminProfileClient({ currentPassword, newPassword });
      setSuccess('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsPasswordFocused(false);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        {/* Header */}
        <div className="border-b border-[var(--border)] px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
              <KeyRound size={17} />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-[var(--text-primary)] sm:text-base">
                Password & security
              </h2>
              <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">
                Update your password to keep your administrator account secure.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* Left Column: Form Fields */}
          <div className="px-5 py-6 sm:px-7 sm:py-8">
            <div className="max-w-xl space-y-6">
              <PasswordField
                id="current-password"
                label="Current password"
                value={currentPassword}
                onChange={setCurrentPassword}
                visible={showCurrentPassword}
                onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                placeholder="Enter your current password"
              />

              <div className="h-px bg-[var(--border)]" />

              <div>
                <PasswordField
                  id="new-password"
                  label="New password"
                  value={newPassword}
                  onChange={setNewPassword}
                  visible={showNewPassword}
                  onToggle={() => setShowNewPassword(!showNewPassword)}
                  placeholder="Create a new password"
                  onFocus={() => setIsPasswordFocused(true)}
                  invalid={newPassword.length > 0 && !isRequirementsMet}
                />

                {/* Mobile View Requirements (Hidden on Desktop) */}
                {(isPasswordFocused || newPassword.length > 0) && (
                  <div className="mt-4 block lg:hidden">
                    <RequirementsPanel
                      hasLength={hasLength}
                      hasUpper={hasUpper}
                      hasLower={hasLower}
                      hasNumber={hasNumber}
                      hasSpecial={hasSpecial}
                      requirementCount={requirementCount}
                      isRequirementsMet={isRequirementsMet}
                      className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]/15 p-4"
                    />
                  </div>
                )}
              </div>

              {newPassword.length > 0 && (
                <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                  <PasswordField
                    id="confirm-password"
                    label="Confirm new password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    visible={showConfirmPassword}
                    onToggle={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    placeholder="Re-enter your new password"
                    invalid={confirmPassword.length > 0 && !passwordsMatch}
                    valid={confirmPassword.length > 0 && passwordsMatch}
                  />
                  {confirmPassword.length > 0 && (
                    <div
                      className={`mt-2 flex items-center gap-1.5 text-[11px] font-semibold ${
                        passwordsMatch ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                    >
                      {passwordsMatch ? (
                        <>
                          <CheckCircle2 size={13} /> Passwords match
                        </>
                      ) : (
                        <>
                          <X size={13} /> Passwords do not match
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar: Desktop Requirements */}
          <div className="border-t border-[var(--border)] bg-[var(--surface-muted)]/10 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="hidden lg:block sticky top-6">
              <RequirementsPanel
                hasLength={hasLength}
                hasUpper={hasUpper}
                hasLower={hasLower}
                hasNumber={hasNumber}
                hasSpecial={hasSpecial}
                requirementCount={requirementCount}
                isRequirementsMet={isRequirementsMet}
                className="bg-transparent border-none p-0"
              />
            </div>
          </div>
        </div>

        <SettingsFooter
          isLoading={isLoading}
          error={error}
          success={success}
          disabled={
            newPassword.length > 0 && (!isPasswordValid || !currentPassword)
          }
        />
      </div>
    </form>
  );
}

// ----------------------------------------------------------------------
// Typed Helper Components
// ----------------------------------------------------------------------

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
  placeholder: string;
  onFocus?: () => void;
  invalid?: boolean;
  valid?: boolean;
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
  placeholder,
  onFocus,
  invalid = false,
  valid = false
}: PasswordFieldProps) {
  const borderClass = invalid
    ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/10'
    : valid
      ? 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/10'
      : 'border-[var(--border)] focus:border-[var(--accent)] focus:ring-[var(--accent)]/10';

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2.5 block text-xs font-bold text-[var(--text-secondary)]"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          className={`h-12 w-full rounded-xl border bg-[var(--surface-muted)]/20 px-3.5 pr-11 text-sm font-medium text-[var(--text-primary)] outline-none transition-all placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)]/40 focus:bg-[var(--surface)] focus:ring-4 ${borderClass}`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--text-primary)]"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

interface RequirementsPanelProps {
  hasLength: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  requirementCount: number;
  isRequirementsMet: boolean;
  className?: string;
}

function RequirementsPanel({
  hasLength,
  hasUpper,
  hasLower,
  hasNumber,
  hasSpecial,
  requirementCount,
  isRequirementsMet,
  className = ''
}: RequirementsPanelProps) {
  return (
    <div className={className}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-secondary)]">
          Password strength
        </p>
        <span
          className={`text-[10px] font-bold ${
            isRequirementsMet
              ? 'text-emerald-500'
              : requirementCount >= 3
                ? 'text-[var(--accent)]'
                : 'text-[var(--text-muted)]'
          }`}
        >
          {isRequirementsMet
            ? 'Strong'
            : requirementCount >= 3
              ? 'Almost there'
              : 'Needs improvement'}
        </span>
      </div>

      <div className="mb-5 grid grid-cols-5 gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`h-1.5 rounded-full transition-colors ${
              requirementCount >= level
                ? isRequirementsMet
                  ? 'bg-emerald-500'
                  : 'bg-[var(--accent)]'
                : 'bg-[var(--border)]'
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
        <PasswordCheck met={hasLength} label="8+ characters" />
        <PasswordCheck met={hasUpper} label="Uppercase letter" />
        <PasswordCheck met={hasLower} label="Lowercase letter" />
        <PasswordCheck met={hasNumber} label="Number" />
        <PasswordCheck met={hasSpecial} label="Special symbol" />
      </div>
    </div>
  );
}

function PasswordCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div
      className={`flex items-center gap-2.5 text-[11px] transition-colors ${
        met ? 'text-emerald-500' : 'text-[var(--text-muted)]'
      }`}
    >
      <span
        className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
          met
            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500'
            : 'border-[var(--border)] bg-[var(--surface-muted)] text-transparent'
        }`}
      >
        <Check size={11} className="stroke-[3]" />
      </span>
      <span className={met ? 'font-semibold' : ''}>{label}</span>
    </div>
  );
}
