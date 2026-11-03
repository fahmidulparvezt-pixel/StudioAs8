// Renders the image when a URL is given, otherwise a clearly marked blank slot.
export default function SmartImage({ src, alt = "", className = "", label = "Image placeholder" }) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt || label}
        className={`flex items-center justify-center border-2 border-dashed border-base-content/30 bg-base-200 text-center text-xs text-base-content/50 ${className}`}
      >
        {label}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" className={`object-cover ${className}`} />;
}
