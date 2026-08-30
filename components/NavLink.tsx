import Link from "next/link";

interface NavLinkProps {
  label: string;
  href: string;
  active?: boolean;
  onClick?: () => void;
}

export default function NavLink({ label, href, active = false, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`font-sans font-medium text-base leading-6 transition-colors duration-200 hover:text-primary ${
        active ? "text-primary" : "text-text-gray"
      }`}
    >
      {label}
    </Link>
  );
}
