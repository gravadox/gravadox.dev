const TRUSTED_PREFIXES = [
  "https://www.youtube.com/embed/",
  "https://youtube.com/embed/",
  "https://player.vimeo.com/video/",
  "https://codesandbox.io/embed/",
  "https://codesandbox.io/p/",
  "https://stackblitz.com/edit/",
  "https://stackblitz.com/github/",
  "https://codepen.io/",
  "https://open.spotify.com/embed/",
  "https://w.soundcloud.com/player/",
  "https://www.google.com/maps/embed",
]

function isSafeEmbedUrl(url: string): boolean {
  if (url.startsWith("/")) return true
  return TRUSTED_PREFIXES.some(prefix => url.startsWith(prefix))
}

export default function BlogEmbed({ link, height }: { link: string; height: number | string }) {
  if (!isSafeEmbedUrl(link)) return null

  return (
    <iframe
      height={height}
      className="w-full bg-zinc-950 my-4"
      src={link}
      sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
      referrerPolicy="no-referrer"
      loading="lazy"
    />
  )
}

