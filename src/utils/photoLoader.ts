// Dynamic Vite glob loader for hero-collision and gallery photos

// Glob all images in public/photos/hero-collision/
const heroGlob = import.meta.glob('/public/photos/hero-collision/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  query: '?url',
  import: 'default',
});

// Glob all images in public/photos/gallery/
const galleryGlob = import.meta.glob('/public/photos/gallery/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG,WEBP,AVIF}', {
  eager: true,
  query: '?url',
  import: 'default',
});

export const getHeroCollisionPhotos = (): string[] => {
  const paths = (Object.values(heroGlob) as string[]).map((p) => p.replace('/public', ''));
  if (paths.length > 0) return paths;

  return [
    '/photos/hero-collision/photo-1.jpg',
    '/photos/hero-collision/photo-2.jpg',
    '/photos/hero-collision/photo-3.jpg',
    '/photos/hero-collision/photo-4.jpg',
    '/photos/hero-collision/photo-5.jpg',
  ];
};

export const getGalleryPhotos = (): string[] => {
  const paths = (Object.values(galleryGlob) as string[]).map((p) => p.replace('/public', ''));
  if (paths.length > 0) return paths;

  return [
    '/photos/gallery/photo-1.jpg',
    '/photos/gallery/photo-2.jpg',
    '/photos/gallery/photo-3.jpg',
    '/photos/gallery/photo-4.jpg',
    '/photos/gallery/photo-5.jpg',
    '/photos/gallery/photo-6.jpg',
    '/photos/gallery/photo-7.jpg',
    '/photos/gallery/photo-8.jpg',
  ];
};
