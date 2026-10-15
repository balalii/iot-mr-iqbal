import Image, { type ImageProps } from "next/image"

/**
 * Bungkus next/image untuk foto dari internet & unggahan siswa.
 * `unoptimized` dipakai karena sumbernya beragam (Unsplash, randomuser, /api/files).
 */
export function Photo(props: Omit<ImageProps, "unoptimized">) {
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image unoptimized {...props} />
}
