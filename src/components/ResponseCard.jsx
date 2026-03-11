import { useState, useEffect } from "react"
import ScoreInputs from "./ScoreInputs"
import { calculateScore, getRating } from "../utils/scoring"

export default function ResponseCard({ title, onScore, resetSignal }) {

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

    const formulaText =
      `${IF}×0.25 + ${truth}×0.25 + ${correctness}×0.20 + ${writing}×0.15 + ${verbosity}×0.15 = ${result}`

    setScore(result)
    setRating(r)
    setFormula(formulaText)

    onScore(result)
  }

  // RESET RESULT WHEN NEXT TURN CLICKED
  useEffect(() => {
    setScore(null)
    setRating(null)
    setFormula("")
  }, [resetSignal])

  return (
    <div className="
    rounded-xl
    bg-white
    p-5
    shadow-md
    border border-gray-100
    ">

      <h2 className="text-lg font-semibold text-center mb-5">
        {title}
      </h2>

      <ScoreInputs onComplete={handleComplete} resetSignal={resetSignal} />

      {score && (

        <div className="mt-5">

          <p className="text-xs text-gray-500 text-center">
            Calculation
          </p>

          <p className="text-xs text-center font-medium text-gray-700 mt-1 break-words">
            {formula}
          </p>

          <div className="
          mt-4
          grid
          grid-cols-2
          gap-4
          text-center
          ">

            <div className="bg-gray-50 rounded-lg p-3">

              <p className="text-xs text-gray-500">
                Score
              </p>

              <p className="text-lg font-bold text-indigo-600">
                {score}
              </p>

            </div>

            <div className="bg-gray-50 rounded-lg p-3">

              <p className="text-xs text-gray-500">
                Overall Rating
              </p>

              <p className="text-lg font-semibold">
                {rating.number} ({rating.label})
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  )
}