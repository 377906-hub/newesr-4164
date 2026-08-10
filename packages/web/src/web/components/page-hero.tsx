import { cn } from "@/lib/utils";
import { Reveal, RevealItem } from "./reveal";

/**
 * Standard top-of-page block for every non-home route.
 * Carries the fixed-nav offset so pages don't have to repeat it.
 */
export function PageHero({
  eyebrow,
  title,
  blurb,
  children,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  blurb?: string;
  children?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden nav-offset",
        className,
      )}
    >
      <div
        className={cn(
          "haze -top-40 h-[440px] w-[680px]",
          align === "center" ? "left-1/2 -translate-x-1/2" : "-left-32",
        )}
      />

      <div className="shell relative pb-10 pt-14 md:pb-14 md:pt-20">
        <Reveal
          viewport={false}
          className={cn(
            "flex flex-col",
            align === "center" ? "items-center text-center" : "items-start",
          )}
        >
          <RevealItem>
            <span className="label-xs inline-flex items-center gap-2 text-acid">
              <span className="block size-1.5 rounded-full bg-acid" />
              {eyebrow}
            </span>
          </RevealItem>

          <RevealItem className="mt-6">
            <h1 className="display-lg max-w-[20ch] text-balance text-bone">{title}</h1>
          </RevealItem>

          {blurb ? (
            <RevealItem className="mt-6">
              <p className="text-ash max-w-[56ch] text-[0.95rem] leading-relaxed md:text-base">
                {blurb}
              </p>
            </RevealItem>
          ) : null}

          {children ? <RevealItem className="mt-9 w-full">{children}</RevealItem> : null}
        </Reveal>
      </div>
    </section>
  );
}
