import Link from "next/link";
import { ReactNode } from "react";

interface ButtonProps {
  label?: string;
  children?: ReactNode;
  variant?: "primary" | "link";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
  href?: string;
}

export default function Button({
  label,
  children,
  variant = "primary",
  size = "md",
  onClick,
  className = "",
  href,
}: ButtonProps) {
  const content = children || label;

  const baseStyles = "font-sans font-medium transition-all duration-200 inline-flex items-center justify-center cursor-pointer";
  
  const variantStyles =
    variant === "primary"
      ? "bg-primary text-white rounded-button hover:bg-blue-600 shadow-sm"
      : "bg-transparent text-text-gray hover:text-primary";

  const sizeStyles =
    variant === "link"
      ? "text-base leading-6"
      : size === "sm"
      ? "py-2 px-4 text-sm rounded-sm"
      : size === "lg"
      ? "py-4 px-8 text-lg"
      : "py-4 px-8 text-base leading-6"; // Standard md padding from figma 16px 32px

  const combinedClasses = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClasses} type="button">
      {content}
    </button>
  );
}
