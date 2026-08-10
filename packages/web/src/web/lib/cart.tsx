import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface CartLine {
  slug: string;
  name: string;
  priceCents: number;
  image: string;
  size: string;
  quantity: number;
}

const STORAGE_KEY = "gls-cart-v1";

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function readStored(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === "object" &&
        l !== null &&
        typeof (l as CartLine).slug === "string" &&
        typeof (l as CartLine).quantity === "number",
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(readStored);
  const [drawerOpen, setDrawerOpen] = useState(false);
  /* Screen-reader announcement for cart changes — the drawer opening is a
     visual cue only, so state changes get spoken here instead. */
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage unavailable — cart stays in memory */
    }
  }, [lines]);

  const add = useCallback((line: Omit<CartLine, "quantity">, quantity = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.slug === line.slug);
      if (existing) {
        return prev.map((l) =>
          l.slug === line.slug
            ? { ...l, quantity: Math.min(12, l.quantity + quantity) }
            : l,
        );
      }
      return [...prev, { ...line, quantity }];
    });
    setDrawerOpen(true);
    setAnnouncement(`${line.name} added to your bag`);
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.slug !== slug)
        : prev.map((l) =>
            l.slug === slug ? { ...l, quantity: Math.min(12, quantity) } : l,
          ),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((prev) => {
      const line = prev.find((l) => l.slug === slug);
      if (line) setAnnouncement(`${line.name} removed from your bag`);
      return prev.filter((l) => l.slug !== slug);
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotalCents = lines.reduce((n, l) => n + l.priceCents * l.quantity, 0);
    return {
      lines,
      count,
      subtotalCents,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      add,
      setQuantity,
      remove,
      clear,
    };
  }, [lines, drawerOpen, add, setQuantity, remove, clear]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <span aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </span>
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

