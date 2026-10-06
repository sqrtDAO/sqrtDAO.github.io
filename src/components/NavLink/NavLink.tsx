import Link from "next/link";
import "@/components/Button/Button.css";

type NavLinkProps = {
  label: string;
  href: string;
  size?: "m" | "l";
  className?: string;
  onClick?: () => void;
};

// Ghost-button-styled link (Figma "button" ghost instances used as nav items).
const NavLink = ({ label, href, size = "m", className = "", onClick }: NavLinkProps) => {
  const external = href.startsWith("http");
  return (
    <Link
      href={href}
      onClick={onClick}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={`sqrt-btn sqrt-btn--ghost sqrt-btn--${size} ${className}`}
    >
      <span className="sqrt-btn__label">{label}</span>
    </Link>
  );
};

export default NavLink;
