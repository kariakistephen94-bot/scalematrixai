export default function Footer() {
  return (
    <footer className="wrap">
      <div className="brand">
        <img
          className="wordmark"
          src="logo.svg"
          alt="ScaleMatrix AI"
          width="270"
          height="28"
        />
      </div>
      <p>© 2026 ScaleMatrix AI. All rights reserved.</p>
      <div>
        <button data-policy="privacy">Privacy Policy</button>
        <span> / </span>
        <button data-policy="terms">Terms of Service</button>
      </div>
    </footer>
  );
}
