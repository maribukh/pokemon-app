'use client';

import Image from 'next/image';

export default function DetailsImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="details-card__image-wrap">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="160px"
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
}
