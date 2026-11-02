import Logo from "./Logo";

export default function Footer() {
  return (
    <footer>
      <div className="wrap footer-big">
        <Logo id="logo-foot" className="mega" reveal />
      </div>
      <div className="wrap footer-row">
        <p>© 2026 ScaleMatrix AI. All rights reserved.</p>
        <div>
          <button data-policy="privacy">Privacy Policy</button>
          <span> / </span>
          <button data-policy="terms">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
}
