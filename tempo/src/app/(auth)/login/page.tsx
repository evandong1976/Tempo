import { signIn } from "@/auth";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const DAYS = Array.from({ length: 35 }, (_, i) => i + 1);
const LEADING_EMPTY_CELLS = 3;
const SOFT_HIGHLIGHT_DAYS = [3, 8, 11, 12, 19, 20, 21, 26];
const STRONG_HIGHLIGHT_DAY = 6;

export default function Login() {
  return (
    <div className="min-h-screen bg-[#2d2b2a] text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1fr_1fr]">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}

function LeftPanel() {
  return (
    <div className="relative overflow-hidden bg-[#031510] px-10 py-12 sm:px-14 lg:px-20 lg:py-24">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(23,86,62,0.24)_1px,transparent_1px),linear-gradient(90deg,rgba(23,86,62,0.24)_1px,transparent_1px)] bg-[size:96px_96px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(27,135,96,0.08),transparent_32%),radial-gradient(circle_at_65%_55%,rgba(27,135,96,0.06),transparent_30%)]" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#178b67] shadow-[0_12px_30px_rgba(0,0,0,0.18)]">
            <svg width="26" height="26" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="5" height="5" rx="1.25" fill="white" opacity="0.95" />
              <rect x="9" y="2" width="5" height="5" rx="1.25" fill="white" opacity="0.55" />
              <rect x="2" y="9" width="5" height="5" rx="1.25" fill="white" opacity="0.55" />
              <rect x="9" y="9" width="5" height="5" rx="1.25" fill="white" opacity="0.78" />
            </svg>
          </div>
          <span className="font-serif text-[clamp(1.6rem,2.2vw,2.4rem)] font-semibold tracking-[-0.04em] text-white">
            Tempo
          </span>
        </div>

        <div className="relative mt-12 w-full max-w-[560px] sm:mt-16 lg:mt-10 lg:ml-0">
          <CalendarPreview />

          <div className="absolute left-3 top-[11.5rem] max-w-[420px] sm:left-4 sm:top-[12.5rem] lg:left-4 lg:top-[15.25rem]">
            <h1 className="font-serif text-[clamp(2.4rem,4.5vw,3.6rem)] leading-[0.9] tracking-[-0.06em] text-white">
              <span className="block">Your time,</span>
              <span className="mt-1 block font-normal italic text-[#49c8a0]">beautifully</span>
              <span className="mt-1 block">organized.</span>
            </h1>

            <p className="mt-20 max-w-[360px] text-[clamp(1rem,1.2vw,1.3rem)] font-medium leading-[1.35] text-white/55">
              A smarter calendar that adapts to how you actually work.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#23b287]" />
              <span className="h-3 w-3 rounded-full bg-white/25" />
              <span className="h-3 w-3 rounded-full bg-white/25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CalendarPreview() {
  return (
    <div className="relative mx-auto max-w-[560px] opacity-45">
      <div className="grid grid-cols-7 gap-[14px]">
        {WEEKDAYS.map((day, index) => (
          <div
            key={`${day}-${index}`}
            className="flex aspect-square items-center justify-center text-[clamp(0.95rem,1.1vw,1.2rem)] font-medium text-white/16"
          >
            {day}
          </div>
        ))}

        {DAYS.map((cell) => {
          const day = cell - LEADING_EMPTY_CELLS;
          const isBlank = day <= 0 || day > 30;
          const isStrong = day === STRONG_HIGHLIGHT_DAY;
          const isSoft = SOFT_HIGHLIGHT_DAYS.includes(day);

          return (
            <div
              key={cell}
              className={[
                "flex aspect-square items-center justify-center rounded-[16px] border text-[clamp(1rem,1.2vw,1.3rem)] font-medium backdrop-blur-[1px]",
                isBlank
                  ? "border-transparent bg-transparent text-transparent"
                  : isStrong
                    ? "border-[#1aa373] bg-[#1a8f68] text-white shadow-[0_0_0_1px_rgba(26,163,115,0.15)]"
                    : isSoft
                      ? "border-[#176d54] bg-[rgba(25,123,89,0.18)] text-[#57c8a2]"
                      : "border-white/[0.08] bg-white/[0.03] text-white/24",
              ].join(" ")}
            >
              {!isBlank ? day : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RightPanel() {
  return (
    <div className="flex items-center justify-center bg-[#2d2b2a] px-8 py-12 sm:px-12 lg:px-16">
      <div className="w-full max-w-[520px]">
        <h2 className="font-serif text-[clamp(2.2rem,3.5vw,3rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#f4f0ea]">
          Welcome back
        </h2>
        <p className="mt-5 text-[clamp(1rem,1.2vw,1.3rem)] leading-relaxed text-[#c9c2b8]">
          Sign in to access your calendar
        </p>

        <div className="mt-20 space-y-10">
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <AuthButton icon={<GoogleIcon />} label="Continue with Google" />
          </form>

          <div className="flex items-center gap-6 text-[clamp(0.9rem,1vw,1.05rem)] text-[#9e968d]">
            <div className="h-px flex-1 bg-[#5a554f]" />
            <span>new to Tempo?</span>
            <div className="h-px flex-1 bg-[#5a554f]" />
          </div>

          <form
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <AuthButton icon={<GitHubIcon />} label="Continue with GitHub" />
          </form>
        </div>

        <p className="mt-16 text-center text-[clamp(0.85rem,0.95vw,1rem)] leading-[1.8] text-[#b6aea3]">
          By continuing, you agree to our{" "}
          <a href="#" className="font-semibold text-[#e7e1d8] underline underline-offset-4">
            Terms of Service
          </a>
          <br className="hidden sm:block" />
          <span className="sm:hidden"> </span>
          and{" "}
          <a href="#" className="font-semibold text-[#e7e1d8] underline underline-offset-4">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

function AuthButton({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="submit"
      className="flex w-full items-center justify-center gap-5 rounded-[20px] border border-[#605a54] bg-transparent px-8 py-6 text-[clamp(1rem,1.2vw,1.3rem)] font-semibold text-[#f5f1eb] transition hover:bg-white/[0.03]"
    >
      <span className="shrink-0">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 2C6.477 2 2 6.59 2 12.252c0 4.529 2.865 8.372 6.839 9.728.5.095.682-.223.682-.495 0-.244-.009-.89-.014-1.747-2.782.617-3.37-1.37-3.37-1.37-.455-1.18-1.11-1.494-1.11-1.494-.908-.638.069-.625.069-.625 1.004.072 1.532 1.055 1.532 1.055.892 1.565 2.341 1.113 2.91.851.091-.665.349-1.113.635-1.369-2.221-.259-4.555-1.14-4.555-5.074 0-1.121.39-2.038 1.03-2.757-.103-.26-.447-1.306.098-2.724 0 0 .84-.277 2.75 1.053A9.303 9.303 0 0112 6.844a9.27 9.27 0 012.504.35c1.909-1.33 2.748-1.053 2.748-1.053.546 1.418.202 2.464.1 2.724.64.719 1.028 1.636 1.028 2.757 0 3.944-2.338 4.812-4.566 5.066.359.319.679.947.679 1.909 0 1.378-.012 2.488-.012 2.826 0 .274.18.594.688.494C19.138 20.62 22 16.779 22 12.252 22 6.59 17.523 2 12 2Z"
        fill="#F1EDE7"
      />
    </svg>
  );
}
