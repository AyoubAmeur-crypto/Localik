import Link from "next/link";

interface NavLinkProps {
  label: string;
  href: string;
  active?: boolean;
}

export default function NavLink({ label, href, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`font-sans font-medium text-base leading-6 transition-colors duration-200 hover:text-primary ${
        active ? "text-primary" : "text-text-gray"
      }`}
    >
      {label}
    </Link>
  );
}
