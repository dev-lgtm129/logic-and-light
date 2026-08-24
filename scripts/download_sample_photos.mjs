import fs from 'fs';
import path from 'path';
import https from 'https';

const heroDir = 'd:/Webpage/public/photos/hero-collision';
const galleryDir = 'd:/Webpage/public/photos/gallery';

fs.mkdirSync(heroDir, { recursive: true });
fs.mkdirSync(galleryDir, { recursive: true });

const heroUrls = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop&q=80'
];

const galleryUrls = [
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1511884642898-4c92249e20b6?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1000&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1000&auto=format&fit=crop&q=80'
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
};

async function run() {
  console.log('Downloading hero-collision photos...');
  for (let i = 0; i < heroUrls.length; i++) {
    const dest = path.join(heroDir, `photo-${i + 1}.jpg`);
    await download(heroUrls[i], dest);
  }

  console.log('Downloading gallery photos...');
  for (let i = 0; i < galleryUrls.length; i++) {
    const dest = path.join(galleryDir, `photo-${i + 1}.jpg`);
    await download(galleryUrls[i], dest);
  }

  console.log('All sample photos downloaded successfully!');
}

run().catch(console.error);
