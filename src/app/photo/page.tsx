"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";

interface Photo {
  id: number;
  x: number;
  y: number;
  rotation: number;
  src: string;
}

export default function PhotoPage() {
  const router = useRouter();

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Массив путей к фоткам в public/photos/
  const photoSources = [
    "/photo/photo1.jpg",
    "/photo/photo2.jpg",
    "/photo/photo3.jpg",
    "/photo/photo4.jpg",
    "/photo/photo5.jpg",
  ];

  useEffect(() => {
    // Останавливаем когда все фотки показали
    if (photoIndex >= photoSources.length) return;

    const interval = setInterval(() => {
      if (photoIndex >= photoSources.length) {
        clearInterval(interval);
        return;
      }

      const getPosition = (index: number) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const photoSize = 150;
        const margin = 40; // отступ от краёв

        // Разные углы поворота для каждой фотки
        const rotations = [-8, 5, -6, 7, 4];

        switch(index) {
          case 0: // Верхний левый угол
            return { x: margin, y: margin, rotation: rotations[0] };
          case 1: // Верхний правый угол
            return { x: viewportWidth - photoSize - margin, y: margin, rotation: rotations[1] };
          case 2: // Нижний левый угол
            return { x: margin, y: viewportHeight - photoSize - margin, rotation: rotations[2] };
          case 3: // Нижний правый угол
            return { x: viewportWidth - photoSize - margin, y: viewportHeight - photoSize - margin, rotation: rotations[3] };
          case 4: // Слева, выше центра
            return { x: margin, y: (viewportHeight - photoSize) / 2 - 200, rotation: rotations[4] };
          default:
            return { x: margin, y: margin, rotation: 0 };
        }
      };

      const position = getPosition(photoIndex);

      setPhotos(prev => [...prev, {
        id: photoIndex,
        x: position.x,
        y: position.y,
        rotation: position.rotation,
        src: photoSources[photoIndex]
      }]);

      setPhotoIndex(prev => prev + 1);
    }, 500);

    return () => clearInterval(interval);
  }, [photoIndex, photoSources.length]);

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .photo-fade-in {
          animation: fadeIn 300ms ease-out forwards;
        }
      `}</style>

      <>
        {/* Текст поздравления в центре */}
        <>
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Наша любимая хозяйка!
          </h1>
          <p className="text-2xl text-gray-700 leading-relaxed">
            У тебя есть три кота, одна собака и я. И все мы обожаем тебя сильнее, чем вкусняшки 💖
          </p>

          <button
            onClick={() => router.push("/song")}
            className="inline-flex items-center justify-center px-6 py-2.5
            rounded-xl bg-gradient-to-r from-green-400 to-blue-500
            text-white text-sm font-semibold shadow-lg
            transition-transform duration-150
            hover:shadow-xl hover:brightness-110
            active:scale-95 active:shadow-md
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
          >
            И Я ВАС ЛЮБЛЮ!!!
          </button>
        </>

        {/* Фотки появляются в фиксированных местах */}
        {photos.map(photo => (
          <div
            key={photo.id}
            className="absolute photo-fade-in z-0"
            style={{
              left: `${photo.x}px`,
              top: `${photo.y}px`,
              width: '150px',
              height: '150px'
            }}
          >
            <div
              className="relative w-full h-full rounded-lg shadow-xl overflow-hidden hover:rotate-0 transition-transform duration-300"
              style={{ transform: `rotate(${photo.rotation}deg)` }}
            >
              <Image
                src={photo.src}
                alt="Фото"
                fill
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </>
    </>
  );
}
