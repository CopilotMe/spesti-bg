import Link from "next/link";
import { Zap, Droplets, Wifi, Flame, Landmark, ShieldCheck, LayoutDashboard, Fuel, Wallet, ShoppingBasket, TrendingUp, BadgeEuro, Globe, Smartphone, Scale, Banknote, Wind, Thermometer, Building2, type LucideIcon } from "lucide-react";

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
};

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export function CategoryCard({
  title,
  description,
  icon,
  href,
}: CategoryCardProps) {
  const Icon = iconMap[icon] || Zap;

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
