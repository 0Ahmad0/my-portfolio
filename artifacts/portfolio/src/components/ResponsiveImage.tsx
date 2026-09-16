import type { ImgHTMLAttributes } from "react";
import images from "@/assets/images.json";

const optimized = images as Record<
  string,
  { src: string; width: number; height: number }[]
>;

export default function ResponsiveImage({
  src = "",
  alt,
  sizes,
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  const variants = optimized[src];
  const largest = variants?.at(-1);
  return (
    <img
      loading="lazy"
      decoding="async"
      width={largest?.width}
      height={largest?.height}
      {...props}
      src={largest?.src ?? src}
      srcSet={variants
        ?.map((image) => `${image.src} ${image.width}w`)
        .join(", ")}
      sizes={variants ? sizes : undefined}
      alt={alt}
    />
  );
}
