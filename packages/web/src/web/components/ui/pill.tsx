import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const pillVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-bold tracking-[0.02em] transition-all duration-200 select-none outline-none focus-visible:ring-2 focus-visible:ring-acid/60 focus-visible:ring-offset-2 focus-visible:ring-offset-void disabled:pointer-events-none disabled:opacity-45 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 cursor-pointer",
  {
    variants: {
      variant: {
        acid: "bg-acid text-void hover:bg-[#8ff0bb] active:bg-acid-dim",
        bone: "bg-bone text-void hover:bg-white",
        ghost:
          "border border-line text-bone hover:bg-panel-2 hover:border-bone/25",
        dark: "bg-panel-2 text-bone hover:bg-[#262626] border border-line",
        link: "text-acid underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-4 text-[0.75rem]",
        md: "h-11 px-6 text-[0.8125rem]",
        lg: "h-[52px] px-8 text-sm",
        icon: "size-11 px-0",
        "icon-sm": "size-9 px-0",
      },
    },
    defaultVariants: { variant: "acid", size: "md" },
  },
);

export function Pill({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof pillVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="pill"
      className={cn(pillVariants({ variant, size, className }))}
      {...props}
    />
  );
}
