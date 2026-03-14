import { useState, useEffect } from "react"
import ScoreInputs from "./ScoreInputs"
import { calculateScore, getRating } from "../utils/scoring"

export default function ResponseCard({ title, onScore, resetSignal, autoFocus }) {

  const [score, setScore] = useState(null)
  const [rating, setRating] = useState(null)
  const [formula, setFormula] = useState("")

  const handleComplete = (values) => {

    const result = calculateScore(values)
    const r = getRating(result)

    const truth = values[0]
    const IF = values[1]
    const writing = values[2]
    const verbosity = values[3]
    const correctness = values[4]

    const formulaText = `${IF}×0.25 + ${truth}×0.25 + ${correctness}×0.20 + ${writing}×0.15 + ${verbosity}×0.15 = ${result}`

    setScore(result)
    setRating(r)
    setFormula(formulaText)

    onScore({
      score: result,
      dimensions: {
        truth,
        if: IF,
        writing,
        verbosity,
        correctness
      }
    })

  }

  useEffect(() => {
    setScore(null)
    setRating(null)
    setFormula("")
  }, [resetSignal])

  return (

    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition p-6">

      <h2 className="text-lg font-semibold text-center mb-5">
        {title}
      </h2>

      <ScoreInputs
        onComplete={handleComplete}
        resetSignal={resetSignal}
        autoFocus={autoFocus}
      />

      {score && (

        <div className="mt-4 space-y-3">

          <p className="text-xs text-gray-500 text-center">
            Calculation
          </p>

          <p className="text-xs text-center text-gray-700 font-medium">
            {formula}
          </p>

          <div className="grid grid-cols-2 gap-3">

            <div className="bg-indigo-50 rounded-lg p-3 text-center">

              <p className="text-[11px] text-gray-500">
                Score
              </p>

              <p className="text-lg font-bold text-indigo-700">
                {score}
              </p>

            </div>

            <div className="bg-purple-50 rounded-lg p-3 text-center">

              <p className="text-[11px] text-gray-500">
                Rating
              </p>

              <p className="text-sm font-semibold text-purple-700">
                {rating.number} ({rating.label})
              </p>

            </div>

          </div>

        </div>

      )}

    </div>

  )

}