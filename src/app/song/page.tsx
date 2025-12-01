"use client";

import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
      <>
        {/* Вставь сюда своё видео */}
        <h1 className="text-4xl font-bold text-gray-800 mb-6">🎶Эта песня для тебя🎶</h1>
        <div className="mb-6">
          <video
            width="100%"
            height="auto"
            controls
            autoPlay
            className="rounded-lg shadow-lg"
          >
            <source src={`${process.env.PAGES_BASE_PATH || ''}/song.mp4`} type="video/mp4" />
            Твой браузер не поддерживает видео.
          </video>
        </div>
        <button
          onClick={() => router.push("/final")}
          className="inline-flex items-center justify-center px-6 py-2.5
            rounded-xl bg-gradient-to-r from-green-400 to-blue-500
            text-white text-sm font-semibold shadow-lg
            transition-transform duration-150
            hover:shadow-xl hover:brightness-110
            active:scale-95 active:shadow-md
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        >
          Любимый, а ты музыкант!
        </button>
    </>
  );
}
