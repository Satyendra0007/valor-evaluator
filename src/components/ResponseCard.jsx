import { useState, useEffect } from "react"
import ScoreInputs from "./ScoreInputs"
import { calculateScore, getRating } from "../utils/scoring"

export default function ResponseCard({ title, onScore, resetSignal, autoFocus, colorScheme = "indigo", focusTrigger }) {

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

    // Creating the single line calculation string
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

  const themeAccent = colorScheme === "indigo"
    ? "from-indigo-500 to-indigo-600"
    : "from-violet-500 to-violet-600"

  const badgeColors = colorScheme === "indigo"
    ? "bg-indigo-50/50 border-indigo-100"
    : "bg-violet-50/50 border-violet-100"

  const borderHover = colorScheme === "indigo"
    ? "hover:border-indigo-200"
    : "hover:border-violet-200"

  return (
    <div className={`bg-white/80 backdrop-blur-xl border border-white/60 rounded-[1.5rem] shadow-sm hover:shadow-md ${borderHover} transition-all duration-300 p-6 md:p-8 relative overflow-hidden h-full flex flex-col items-center group`}>

      {/* Subtle Top Accent Line */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${themeAccent} opacity-80`}></div>

      <div className="flex w-full justify-between items-center mb-8">
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${themeAccent}`}></span>
          {title}
        </h2>
        {score !== null && (
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Scored
          </span>
        )}
      </div>

      <div className="w-full mb-8">
        <ScoreInputs
          onComplete={handleComplete}
          resetSignal={resetSignal}
          autoFocus={autoFocus}
          colorScheme={colorScheme}
          focusTrigger={focusTrigger}
        />
      </div>

      {score !== null && (
        <div className="w-full mt-auto animate-fade-in-up duration-300 pt-3 border-t border-slate-100">

          <div className="flex flex-col gap-4">

            {/* Calculation Single Line without "Calc" label */}
            <p className="text-[11px] text-center font-medium text-slate-500 font-mono tracking-tighter w-full">
              {formula}
            </p>

            {/* Original Layout: Score & Rating Side by Side */}
            <div className="grid grid-cols-2 gap-3 mt-1">

              <div className={`rounded-xl p-2.5 text-center border shadow-sm transition-colors ${badgeColors}`}>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Score</p>
                <p className="text-xl font-bold text-slate-800 mt-0.5">{score}</p>
              </div>

              <div className={`rounded-xl p-2.5 text-center border shadow-sm transition-colors ${badgeColors}`}>
                <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">Rating</p>
                <p className="text-[15px] font-bold text-slate-800 mt-1.5 tracking-tight">
                  {rating.number} <span className="opacity-70 text-sm">({rating.label})</span>
                </p>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}