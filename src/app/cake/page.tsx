"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Cake() {
  const router = useRouter();
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true]);
  const [isListening, setIsListening] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.3;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsListening(true);
      detectBlow();
    } catch (err) {
      console.error(err);
      alert("Нужен доступ к микрофону для задувания свечей!");
    }
  };

  const detectBlow = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const checkVolume = () => {
      if (!analyserRef.current) return;

      analyserRef.current.getByteTimeDomainData(dataArray);

      let max = 0;
      for (let i = 0; i < bufferLength; i++) {
        const value = Math.abs(dataArray[i] - 128);
        if (value > max) max = value;
      }

      console.log("Volume:", max);

      if (max > 20) {
        setCandlesLit(prev => {
          const litIndexes = prev.map((lit, i) => lit ? i : -1).filter(i => i !== -1);
          if (litIndexes.length > 0) {
            const randomIndex = litIndexes[Math.floor(Math.random() * litIndexes.length)];
            const newCandles = [...prev];
            newCandles[randomIndex] = false;
            return newCandles;
          }
          return prev;
        });
      }

      animationFrameRef.current = requestAnimationFrame(checkVolume);
    };

    checkVolume();
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsListening(false);
  };

  const allCandlesOut = candlesLit.every(lit => !lit);

  // Редирект когда все свечи погасли
  useEffect(() => {
    if (allCandlesOut) {
      router.push("/photo");
    }
  }, [allCandlesOut]);

  useEffect(() => {
    // Диагностика при загрузке
    console.log("User Agent:", navigator.userAgent);
    console.log("MediaDevices доступен:", !!navigator.mediaDevices);
    console.log("getUserMedia доступен:", !!navigator.mediaDevices?.getUserMedia);

    // Проверяем разрешения (если API доступен)
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as PermissionName })
        .then(result => {
          alert(`Статус разрешения микрофона: ${ result.state }`,);
        })
        .catch(err => {
          alert(`Не удалось проверить разрешения: ${err}`,);
        });
    }
    return () => {
      stopListening();
    }
  }, []);

  return (
    <>

      <h1 className="text-4xl font-bold text-gray-800 mb-10">
        {isListening ? 'ДУЙ! РТОМ!' : 'Загадай желание и задуй огоньки!'}
      </h1>

      <div className="relative mb-10 flex flex-col items-center">
        <div className="flex items-end gap-3 mb-2">
          {candlesLit.map((isLit, i) => (
            <div key={i} className={`flex flex-col items-center candle-${i}`}>
              <div className={`text-3xl transition-opacity duration-300 ${isLit ? 'opacity-100 flame' : 'opacity-0'}`}>
                🔥
              </div>
            </div>
          ))}
        </div>

        <div className="text-[200px] leading-none">
          🎂
        </div>

        {allCandlesOut && (
          <p className="text-3xl font-bold text-pink-600 animate-bounce mt-6">
            С днём рождения! 🎉✨🎈
          </p>
        )}
      </div>

      <button
        onClick={startListening}
        disabled={isListening}
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white text-sm font-semibold shadow-lg transition-transform duration-150 hover:shadow-xl hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        💨 Дунуть
      </button>
    </>
  );
}
