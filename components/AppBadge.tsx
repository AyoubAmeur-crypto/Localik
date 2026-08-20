import Image from "next/image";
import Link from "next/link";

interface AppBadgeProps {
  store: "ios" | "android";
  href: string;
  className?: string;
  width?: number;
  height?: number;
}

export default function AppBadge({ store, href, className, width = 124, height = 37 }: AppBadgeProps) {
  const isIos = store === "ios";
  
  return (
    <Link
      href={href}
      className={`inline-block transition-transform duration-200 hover:scale-105 rounded-badge overflow-hidden ${className || ""}`}
      style={{ width: `${width}px`, height: `${height}px` }}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src={isIos ? "/images/ios-badge-798b80.png" : "/images/android-badge-2dfe86.png"}
        alt={isIos ? "Download on Apple Store" : "Get it on Google Play"}
        width={width}
        height={height}
        className="w-full h-full object-contain"
        priority
      />
    </Link>
  );
}
