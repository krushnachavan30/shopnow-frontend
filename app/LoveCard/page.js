"use client";
import Navbar from '../../components/Navbar'
export default function LoveCard() {
  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-200 to-red-100 p-6">
      
      <div className="relative w-full max-w-4xl rounded-3xl bg-white/30 backdrop-blur-lg shadow-2xl border border-white overflow-hidden p-10">

        {/* Floating Hearts */}
        <div className="absolute top-6 left-8 text-pink-500 text-3xl animate-bounce">
          ❤️
        </div>

        <div className="absolute bottom-6 right-8 text-red-500 text-3xl animate-pulse">
          💕
        </div>

        <h1 className="text-center text-5xl font-bold text-rose-700 mb-10">
          Krushna ❤️ Chhaku
        </h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12">

          {/* Krushna */}
          <div className="text-center">
            <img
              src="/img2.jpeg"
              alt="Krushna"
              className="w-56 h-56 rounded-full object-cover border-8 border-pink-400 shadow-xl"
            />

            <h2 className="text-3xl font-bold mt-5 text-rose-700">
              Krushna
            </h2>
          </div>

          <div className="text-7xl animate-pulse">
            ❤️
          </div>

          {/* Chhaku */}
          <div className="text-center">
            <img
              src="/wife.jpeg"
              alt="Chhaku"
              className="w-56 h-56 rounded-full object-cover border-8 border-pink-400 shadow-xl"
            />

            <h2 className="text-3xl font-bold mt-5 text-rose-700">
              Chhaku
            </h2>
          </div>
        </div>

        <p className="text-center mt-12 text-xl text-rose-800 italic">
          "Every heartbeat whispers your name,
          <br />
          and every moment becomes beautiful because of you. ❤️"
        </p>

        <div className="flex justify-center mt-10 text-4xl gap-4">
          🌹 ❤️ 🌹 💕 🌹 ❤️ 🌹
        </div>
      </div>
    </div>
  </>
  );
}