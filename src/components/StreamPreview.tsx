export default function StreamPreview() {
    return (
      <div class="rounded-md overflow-hidden border border-white/10">
        <img
          src={`http://${window.location.hostname}/preview`}
          alt="Live Preview"
          className="w-full max-w-full"
        />
      </div>
    )
  }
