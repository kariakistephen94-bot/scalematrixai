export default function SiteDialogs() {
  return (
    <>
      <dialog id="videomodal">
        <button className="close" aria-label="Close video preview">
          ×
        </button>
        <div className="modalicon">▶</div>
        <h2>Your VSL goes here.</h2>
        <p>
          The player is ready for your 4-minute video.
          <br />
          Add your hosted video URL to activate playback.
        </p>
        <a href="#application" className="button" id="videoapply">
          Apply For A Custom Build →
        </a>
      </dialog>
      <dialog id="policy">
        <button className="close" aria-label="Close policy preview">
          ×
        </button>
        <h2 id="policytitle"></h2>
        <p>
          {
            "This is a website preview. Final legal terms and privacy disclosures will be added before public launch. Completed applications are sent to ScaleMatrix AI by email through Resend."
          }
        </p>
      </dialog>
    </>
  );
}
