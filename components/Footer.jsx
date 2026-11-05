import Logo from "./Logo";
import { SOCIALS } from "../lib/seo.js";

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-big">
        <Logo id="logo-foot" className="mega" reveal />
      </div>
      <div className="wrap footer-row">
        <p>© 2026 ScaleMatrix AI. All rights reserved.</p>
        <div>
          {SOCIALS.map(({ name, href }) => (
            <span key={name}>
              <a href={href} target="_blank" rel="me noopener noreferrer">
                {name}
              </a>
              <span> / </span>
            </span>
          ))}
          <button data-policy="privacy">Privacy Policy</button>
          <span> / </span>
          <button data-policy="terms">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
}
