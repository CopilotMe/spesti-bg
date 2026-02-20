import Link from "next/link";
import { Zap, Droplets, Wifi, Flame, Landmark, ShieldCheck, LayoutDashboard, Fuel, Wallet, ShoppingBasket, TrendingUp, BadgeEuro, Globe, Smartphone, Scale, Banknote, Wind, Thermometer, Building2, Receipt, Sun, Car, UserCircle, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap,
  Droplets,
  Wifi,
  Flame,
  Landmark,
  ShieldCheck,
  LayoutDashboard,
  Fuel,
  Wallet,
  ShoppingBasket,
  TrendingUp,
  BadgeEuro,
  Globe,
  Smartphone,
  Scale,
  Banknote,
  Wind,
  Thermometer,
  Building2,
  Receipt,
  Sun,
  Car,
  UserCircle,
};

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
  featured?: boolean;
}

export function CategoryCard({
  title,
  description,
  icon,
  href,
  featured = false,
}: CategoryCardProps) {
  const Icon = iconMap[icon] || Zap;

  if (featured) {
    return (
      <Link
        href={href}
        className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 to-primary/10 p-6 text-center shadow-sm transition-all hover:border-primary hover:shadow-lg"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-white transition-colors group-hover:bg-primary-dark">
          <Icon className="h-7 w-7" />
        </div>
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        <p className="text-sm text-muted">{description}</p>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-6 text-center shadow-sm transition-all hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold text-text">{title}</h3>
      <p className="text-sm text-muted">{description}</p>
    </Link>
  );
}
