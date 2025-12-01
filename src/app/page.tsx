"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
      <>
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Привет, Руфина 🎉</h1>
        <button
          onClick={() => router.push("/video")}
          className="inline-flex items-center justify-center px-6 py-2.5
            rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            text-white text-sm font-semibold shadow-lg
            transition-transform duration-150
            hover:shadow-xl hover:brightness-110
            active:scale-95 active:shadow-md
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400"
        >
          Привет, любимый!
        </button>
      </>
  );
}
