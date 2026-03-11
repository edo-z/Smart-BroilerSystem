"use client";

import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
  Children,
  HTMLAttributes,
  ReactNode,
} from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "motion/react";
import {
  FaUser,
  FaIndustry,
  FaEnvelope,
  FaLock,
  FaCheck,
  FaArrowRight,
  FaEye,
  FaEyeSlash,
  FaExclamationCircle,
} from "react-icons/fa";
import { registerUser } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────

interface FormValues {
  name: string;
  farmName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreed: boolean;
}

type StepErrors = Partial<Record<keyof FormValues, string>>;

// ─────────────────────────────────────────────────────────────────
// Validation
// ─────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateStep(step: number, v: FormValues): StepErrors {
  const e: StepErrors = {};
  if (step === 1) {
    if (!v.name.trim()) e.name = "Nama lengkap wajib diisi";
    else if (v.name.trim().length < 3) e.name = "Minimal 3 karakter";
    if (!v.farmName.trim()) e.farmName = "Nama peternakan wajib diisi";
  }
  if (step === 2) {
    if (!v.email) e.email = "Email wajib diisi";
    else if (!EMAIL_RE.test(v.email)) e.email = "Format email tidak valid";
    if (!v.password) e.password = "Kata sandi wajib diisi";
    else if (v.password.length < 8) e.password = "Minimal 8 karakter";
    if (!v.confirmPassword) e.confirmPassword = "Ulangi kata sandi";
    else if (v.password !== v.confirmPassword) e.confirmPassword = "Kata sandi tidak cocok";
  }
  if (step === 3) {
    if (!v.agreed) e.agreed = "Anda harus menyetujui syarat & ketentuan";
  }
  return e;
}

// ─────────────────────────────────────────────────────────────────
// Password strength
// ─────────────────────────────────────────────────────────────────

interface Strength { score: number; label: string; color: string; textColor: string }

function getStrength(pw: string): Strength {
  if (!pw) return { score: 0, label: "", color: "", textColor: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const c = Math.min(s, 4) as 0 | 1 | 2 | 3 | 4;
  const map = {
    0: { label: "", color: "", textColor: "" },
    1: { label: "Lemah", color: "bg-red-400", textColor: "text-red-500" },
    2: { label: "Cukup", color: "bg-orange-400", textColor: "text-orange-500" },
    3: { label: "Kuat", color: "bg-yellow-400", textColor: "text-yellow-600" },
    4: { label: "Sangat Kuat", color: "bg-emerald-500", textColor: "text-emerald-600" },
  };
  return { score: c, ...map[c] };
}

// ─────────────────────────────────────────────────────────────────
// Stepper internals
// ─────────────────────────────────────────────────────────────────

const stepVariants: Variants = {
  enter: (d: number) => ({ x: d >= 0 ? "-100%" : "100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: (d: number) => ({ x: d >= 0 ? "50%" : "-50%", opacity: 0 }),
};

function SlideTransition({
  children,
  direction,
  onHeightReady,
}: {
  children: ReactNode;
  direction: number;
  onHeightReady: (h: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (ref.current) onHeightReady(ref.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={ref}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

function StepContentWrapper({
  isCompleted, currentStep, direction, children, className = "",
}: {
  isCompleted: boolean; currentStep: number; direction: number;
  children: ReactNode; className?: string;
}) {
  const [height, setHeight] = useState(0);
  const onHeightReady = useCallback((h: number) => setHeight(h), []);

  return (
    <motion.div
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : height }}
      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={onHeightReady}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StepConnector({ isComplete }: { isComplete: boolean }) {
  return (
    <div className="relative mx-2 h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200">
      <motion.div
        className="absolute inset-y-0 left-0 bg-slate-900"
        initial={false}
        animate={{ width: isComplete ? "100%" : "0%" }}
        transition={{ duration: 0.38, ease: "easeInOut" }}
      />
    </div>
  );
}

function StepIndicator({
  step, currentStep, onClickStep, disableStepIndicators,
}: {
  step: number; currentStep: number;
  onClickStep: (s: number) => void; disableStepIndicators: boolean;
}) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";
  return (
    <motion.div
      onClick={() => !disableStepIndicators && step !== currentStep && onClickStep(step)}
      className="relative cursor-pointer"
      animate={status}
      initial={false}
    >
      <motion.div
        variants={{
          inactive: { backgroundColor: "#e2e8f0", color: "#94a3b8" },
          active: { backgroundColor: "#0f172a", color: "#ffffff" },
          complete: { backgroundColor: "#0f172a", color: "#ffffff" },
        }}
        transition={{ duration: 0.22 }}
        className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold"
      >
        {status === "complete" ? (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.05, duration: 0.25, ease: "easeOut" }}
              strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"
            />
          </svg>
        ) : <span>{step}</span>}
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Stepper (public API — with onNextAttempt gate)
// ─────────────────────────────────────────────────────────────────

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onFinalStepCompleted?: () => void;
  /** Return false to block advancement */
  onNextAttempt?: (step: number) => boolean;
  contentClassName?: string;
  footerClassName?: string;
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>;
  backButtonText?: string;
  nextButtonText?: string;
  disableStepIndicators?: boolean;
}

function Stepper({
  children, initialStep = 1,
  onStepChange = () => {}, onFinalStepCompleted = () => {},
  onNextAttempt,
  contentClassName = "", footerClassName = "",
  backButtonProps = {}, nextButtonProps = {},
  backButtonText = "Kembali", nextButtonText = "Lanjut",
  disableStepIndicators = false,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const total = stepsArray.length;
  const isCompleted = currentStep > total;
  const isLast = currentStep === total;

  const updateStep = useCallback((n: number) => {
    setCurrentStep(n);
    if (n > total) onFinalStepCompleted();
    else onStepChange(n);
  }, [total, onFinalStepCompleted, onStepChange]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) { setDirection(-1); updateStep(currentStep - 1); }
  }, [currentStep, updateStep]);

  const advance = useCallback(() => {
    if (onNextAttempt && !onNextAttempt(currentStep)) return;
    if (isLast) { setDirection(1); updateStep(total + 1); }
    else { setDirection(1); updateStep(currentStep + 1); }
  }, [currentStep, isLast, total, onNextAttempt, updateStep]);

  return (
    <div className="flex flex-col" {...rest}>
      {/* Indicators */}
      <div className="flex w-full items-center px-8 pt-8 pb-5">
        {stepsArray.map((_, i) => {
          const sn = i + 1;
          return (
            <React.Fragment key={sn}>
              <StepIndicator
                step={sn} currentStep={currentStep}
                disableStepIndicators={disableStepIndicators}
                onClickStep={(c) => { setDirection(c > currentStep ? 1 : -1); updateStep(c); }}
              />
              {i < total - 1 && <StepConnector isComplete={currentStep > sn} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Content */}
      <StepContentWrapper
        isCompleted={isCompleted} currentStep={currentStep}
        direction={direction} className={`px-8 ${contentClassName}`}
      >
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>

      {/* Footer */}
      {!isCompleted && (
        <div className={`px-8 pb-8 ${footerClassName}`}>
          <div className={`mt-7 flex ${currentStep !== 1 ? "justify-between" : "justify-end"}`}>
            {currentStep !== 1 && (
              <button
                type="button" onClick={handleBack}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200"
                {...backButtonProps}
              >
                {backButtonText}
              </button>
            )}
            <button
              type="button" onClick={advance}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white
                hover:bg-slate-700 active:scale-95 transition-all duration-150 shadow-md
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              {...nextButtonProps}
            >
              {isLast
                ? <><span>Daftar Sekarang</span><FaCheck className="text-[10px]" /></>
                : <><span>{nextButtonText}</span><FaArrowRight className="text-[10px]" /></>
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Field wrapper
// ─────────────────────────────────────────────────────────────────

function Field({ icon, label, hint, error, children }: {
  icon: ReactNode; label: string; hint?: string; error?: string; children: ReactNode;
}) {
  const hasErr = Boolean(error);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-700">{label}</label>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
      <label className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 cursor-text
        ${hasErr
          ? "border-red-300 bg-red-50/50 ring-2 ring-red-100"
          : "border-slate-200 bg-slate-50 focus-within:border-slate-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10"
        }`}>
        <span className={`text-sm shrink-0 ${hasErr ? "text-red-400" : "text-slate-400"}`}>
          {icon}
        </span>
        {children}
      </label>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 text-xs text-red-500 font-medium"
          >
            <FaExclamationCircle className="shrink-0 text-[11px]" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

const inputCls = "grow bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none w-full";

// ─────────────────────────────────────────────────────────────────
// Password input with show/hide
// ─────────────────────────────────────────────────────────────────

function PasswordInput({ value, onChange, placeholder, minLength }: {
  value: string; onChange: (v: string) => void; placeholder?: string; minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex items-center w-full gap-2">
      <input
        className={inputCls} type={show ? "text" : "password"}
        placeholder={placeholder} value={value}
        onChange={(e) => onChange(e.target.value)} minLength={minLength}
        autoComplete="new-password"
      />
      <button
        type="button" tabIndex={-1}
        onClick={() => setShow((s) => !s)}
        className="text-slate-400 hover:text-slate-700 transition-colors shrink-0"
        aria-label={show ? "Sembunyikan sandi" : "Tampilkan sandi"}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Password strength bar
// ─────────────────────────────────────────────────────────────────

function StrengthBar({ password }: { password: string }) {
  const { score, label, color, textColor } = useMemo(() => getStrength(password), [password]);
  if (!password) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
      className="space-y-1.5 -mt-1"
    >
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= score ? color : "bg-slate-200"}`} />
        ))}
      </div>
      {label && <p className={`text-xs font-medium ${textColor}`}>Kekuatan sandi: {label}</p>}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Animated checkbox
// ─────────────────────────────────────────────────────────────────

function AnimatedCheckbox({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="relative shrink-0 mt-0.5">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <motion.div
        onClick={() => onChange(!checked)}
        animate={checked ? "checked" : "unchecked"}
        variants={{
          unchecked: { backgroundColor: "#fff", borderColor: "#cbd5e1", scale: 1 },
          checked: { backgroundColor: "#0f172a", borderColor: "#0f172a", scale: 1 },
        }}
        whileTap={{ scale: 0.85 }}
        transition={{ duration: 0.15 }}
        className="w-4 h-4 rounded border-2 flex items-center justify-center cursor-pointer"
      >
        <AnimatePresence>
          {checked && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.12 }}
            >
              <FaCheck className="text-white text-[7px]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Sidebar step config
// ─────────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Profil", sub: "Nama & peternakan" },
  { label: "Akun", sub: "Email & kata sandi" },
  { label: "Konfirmasi", sub: "Periksa & daftar" },
];

// ─────────────────────────────────────────────────────────────────
// Step heading helper
// ─────────────────────────────────────────────────────────────────

function StepHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="mb-1">
      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Langkah {step}</p>
      <p className="text-base font-semibold text-slate-800 mt-0.5">{title}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<StepErrors>({});
  const [formValues, setFormValues] = useState<FormValues>({
    name: "", farmName: "", email: "", password: "", confirmPassword: "", agreed: false,
  });

  const setField = useCallback(<K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setStepErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev }; delete next[key]; return next;
    });
  }, []);

  const handleNextAttempt = useCallback((step: number): boolean => {
    const errs = validateStep(step, formValues);
    if (Object.keys(errs).length > 0) { setStepErrors(errs); return false; }
    setStepErrors({});
    return true;
  }, [formValues]);

  const handleFinalSubmit = useCallback(async () => {
    setIsLoading(true);
    setServerError(null);
    const fd = new FormData();
    Object.entries(formValues).forEach(([k, v]) => {
      if (k !== "agreed") fd.append(k, v as string);
    });
    const result = await registerUser(fd);
    if (result?.error) { setServerError(result.error); setIsLoading(false); }
    else router.push("/login");
  }, [formValues, router]);

  const summaryRows = useMemo(() => [
    { label: "Nama", value: formValues.name || "—" },
    { label: "Peternakan", value: formValues.farmName || "—" },
    { label: "Email", value: formValues.email || "—" },
    { label: "Sandi", value: formValues.password ? "••••••••" : "—" },
  ], [formValues.name, formValues.farmName, formValues.email, formValues.password]);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex w-3xl bg-slate-900 flex-col relative overflow-hidden">
        

        <div className="relative z-10 flex flex-col justify-between h-full px-10 py-14 xl:px-14 text-white">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
              
            </div>
          </div>

          {/* Dynamic headline */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}
              >
                <p className="text-lg font-semibold tracking-widest text-slate-500 uppercase mb-2">
                  Langkah {currentStep} dari 3
                </p>
                <h1 className="text-5xl font-bold leading-snug">
                  {currentStep === 1 && <><span className="text-slate-400">Kenalkan</span><br />diri Anda.</>}
                  {currentStep === 2 && <><span className="text-slate-400">Buat</span><br />kredensial.</>}
                  {currentStep === 3 && <><span className="text-slate-400">Tinggal</span><br />satu langkah.</>}
                </h1>
              </motion.div>
            </AnimatePresence>

            {/* Step list */}
            <div className="space-y-3">
              {STEPS.map(({ label, sub }, i) => {
                const s = i + 1;
                const isDone = currentStep > s;
                const isActive = currentStep === s;
                return (
                  <motion.div key={s} className="flex items-center gap-3"
                    animate={{ opacity: isDone || isActive ? 1 : 0.4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold shrink-0 transition-all duration-300 ${
                      isDone ? "bg-white text-slate-900" : isActive ? "bg-white/20 text-white border border-white/40" : "bg-white/5 text-slate-600 border border-white/10"
                    }`}>
                      {isDone ? <FaCheck className="text-[15px]" /> : s}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-lg font-semibold leading-none ${isActive ? "text-white" : isDone ? "text-slate-400" : "text-slate-600"}`}>{label}</p>
                      <p className="text-2sm  text-slate-600 mt-0.5">{sub}</p>
                    </div>
                    {isDone && <span className="text-xs text-emerald-500 font-medium">✓</span>}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div>
            <p className="text-xs text-slate-600"></p>
          </div>
        </div>
      </div>

      {/* ── RIGHT FORM ── */}
      <div className="flex-1 flex items-center justify-center p-6 py-12 lg:py-8">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white rounded-xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">

            <div className="px-10 pt-10 pb-2">
              <h2 className="text-xl font-bold text-slate-900">Buat Akun Baru</h2>
              <p className="text-sm text-slate-500 mt-1">Daftarkan peternakan Anda dalam 3 langkah mudah.</p>
            </div>

            {/* Server error */}
            <AnimatePresence>
              {serverError && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }} className="mx-8 mt-4 overflow-hidden"
                >
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    <FaExclamationCircle className="shrink-0" />
                    {serverError}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Stepper
              initialStep={1}
              onStepChange={(s) => { setCurrentStep(s); setServerError(null); }}
              onFinalStepCompleted={handleFinalSubmit}
              onNextAttempt={handleNextAttempt}
              nextButtonProps={{ disabled: isLoading }}
            >
              {/* Step 1 */}
              <div className="space-y-4 px-10 pt-10 pb-8 flex flex-col gap-6">
                <StepHeading step={1} title="Siapa Anda?" />
                <Field icon={<FaUser />} label="Nama Lengkap" error={stepErrors.name}>
                  <input className={inputCls} type="text" placeholder="Contoh: Budi Santoso"
                    value={formValues.name} onChange={(e) => setField("name", e.target.value)}
                    autoComplete="name"
                  />
                </Field>
                <Field icon={<FaIndustry />} label="Nama Peternakan" error={stepErrors.farmName}>
                  <input className={inputCls} type="text" placeholder="Contoh: UD. Berkah Tani"
                    value={formValues.farmName} onChange={(e) => setField("farmName", e.target.value)}
                    autoComplete="organization"
                  />
                </Field>
              </div>

              {/* Step 2 */}
              <div className="space-y-4 px-10 pt-10 pb-8 flex flex-col gap-6">
                <StepHeading step={2} title="Data masuk Anda" />
                <Field icon={<FaEnvelope />} label="Alamat Email" error={stepErrors.email}>
                  <input className={inputCls} type="email" placeholder="email@contoh.com"
                    value={formValues.email} onChange={(e) => setField("email", e.target.value)}
                    autoComplete="email"
                  />
                </Field>
                <Field icon={<FaLock />} label="Kata Sandi" hint="Min. 8 karakter" error={stepErrors.password}>
                  <PasswordInput value={formValues.password} onChange={(v) => setField("password", v)}
                    placeholder="Buat kata sandi kuat" minLength={8}
                  />
                </Field>
                <StrengthBar password={formValues.password} />
                <Field icon={<FaLock />} label="Ulangi Kata Sandi" error={stepErrors.confirmPassword}>
                  <PasswordInput value={formValues.confirmPassword} onChange={(v) => setField("confirmPassword", v)}
                    placeholder="Ketik ulang kata sandi"
                  />
                </Field>
              </div>

              {/* Step 3 */}
              <div className="space-y-5 px-10 pt-10 pb-8 flex flex-col gap-6">
                <StepHeading step={3} title="Periksa & selesaikan" />

                <div className="rounded-xl border border-slate-100 bg-slate-50 divide-y divide-slate-100 overflow-hidden text-sm">
                  {summaryRows.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-slate-500 font-medium">{label}</span>
                      <span className="text-slate-800 font-semibold truncate max-w-45">{value}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <AnimatedCheckbox checked={formValues.agreed} onChange={(v) => setField("agreed", v)} />
                    <span className="text-xs text-slate-600 leading-relaxed">
                      Saya setuju dengan{" "}
                      <a href="#" className="text-slate-900 font-semibold underline underline-offset-2 hover:text-slate-600 transition-colors">
                        Syarat &amp; Ketentuan
                      </a>{" "}
                      serta Kebijakan Privasi AVESIS.
                    </span>
                  </label>
                  <AnimatePresence>
                    {stepErrors.agreed && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                        className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-1.5 ml-7"
                      >
                        <FaExclamationCircle className="shrink-0 text-[11px]" />
                        {stepErrors.agreed}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {isLoading && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-2 text-sm text-slate-500 py-1"
                    >
                      <svg className="animate-spin h-4 w-4 text-slate-700" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Mendaftarkan akun Anda...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Stepper>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-bold text-slate-900 hover:underline">Masuk disini</Link>
          </p>
        </div>
      </div>
    </div>
  );
}