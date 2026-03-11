import { useState } from "react"
import ResponseCard from "./components/ResponseCard"

export default function App() {

  const [scoreA, setScoreA] = useState(null)
  const [scoreB, setScoreB] = useState(null)
  const [resetSignal, setResetSignal] = useState(0)

  const getWinner = () => {
    if (scoreA > scoreB) return "Response A"
    if (scoreB > scoreA) return "Response B"
    return "Tie"
  }

  const handleReset = () => {
    setScoreA(null)
    setScoreB(null)
    setResetSignal(prev => prev + 1)
  }

  return (

    <div className="
    min-h-screen
    bg-gradient-to-br
    from-indigo-100
    via-white
    to-purple-100
    px-4
    py-10
    ">

      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-10">

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            Valor Evaluator
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            Multi-Turn Model Response Rating
          </p>

        </div>

        <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
        ">

          <ResponseCard
            title="Response A"
            onScore={setScoreA}
            resetSignal={resetSignal}
          />

          <ResponseCard
            title="Response B"
            onScore={setScoreB}
            resetSignal={resetSignal}
          />

        </div>

        {scoreA && scoreB && (

          <div className="
          mt-10
          bg-white
          rounded-2xl
          shadow-lg
          p-8
          text-center
          ">

            <p className="text-sm text-gray-500">
              Winner
            </p>

            <p className="text-2xl font-bold text-green-600">
              {getWinner()}
            </p>

            <p className="text-sm text-gray-500 mt-4">
              Score Difference
            </p>

            <p className="text-xl font-semibold">
              {Math.abs(scoreA - scoreB).toFixed(2)}
            </p>

            <button
              onClick={handleReset}
              className="
              mt-6
              px-6
              py-3
              rounded-lg
              bg-indigo-600
              text-white
              font-medium
              hover:bg-indigo-700
              transition
              "
            >
              Next Turn
            </button>

          </div>

        )}

      </div>

    </div>
  )
}