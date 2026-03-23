import { useRef, useEffect, useState } from "react"

const dimensions = [
  { id: "truth", label: "Truth", weight: 25 },
  { id: "if", label: "IF", weight: 25 },
  { id: "writing", label: "Writing", weight: 15 },
  { id: "verbosity", label: "Verb", weight: 15 },
  { id: "correctness", label: "Correct", weight: 20 },
]

export default function ScoreInputs({ onComplete, resetSignal, autoFocus, colorScheme, focusTrigger }) {
  const inputs = useRef([])
  const [values, setValues] = useState(["", "", "", "", ""])
  const [errors, setErrors] = useState([false, false, false, false, false])
  const [focusedIndex, setFocusedIndex] = useState(null)

  const handleChange = (e, index) => {
    const val = e.target.value

    if (val === "") {
      const newValues = [...values]
      newValues[index] = ""
      setValues(newValues)

      const newErrors = [...errors]
      newErrors[index] = false
      setErrors(newErrors)
      return
    }

    if (!/^[1-6]$/.test(val)) {
      const newErrors = [...errors]
      newErrors[index] = true
      setErrors(newErrors)
      return
    }

    const newValues = [...values]
    newValues[index] = val
    setValues(newValues)

    const newErrors = [...errors]
    newErrors[index] = false
    setErrors(newErrors)

    if (index < 4) {
      inputs.current[index + 1]?.focus()
    }

    const filled = newValues.every((value) => value !== "")
    const hasError = newErrors.some((error) => error)

    if (filled && !hasError) {
      onComplete(newValues)
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputs.current[index - 1]?.focus()
    }
  }

  useEffect(() => {
    setValues(["", "", "", "", ""])
    setErrors([false, false, false, false, false])

    inputs.current.forEach((input) => {
      if (input) input.value = ""
    })

    if (autoFocus) {
      setTimeout(() => {
        inputs.current[0]?.focus()
      }, 100)
    }
  }, [resetSignal, autoFocus])

  useEffect(() => {
    if (focusTrigger > 0) {
      setTimeout(() => {
        inputs.current[0]?.focus()
      }, 100)
    }
  }, [focusTrigger])

  const focusRingColor =
    colorScheme === "indigo"
      ? "focus-within:ring-indigo-500/30 focus-within:border-indigo-400"
      : "focus-within:ring-violet-500/30 focus-within:border-violet-400"

  const activeNumberColor = "text-emerald-700 dark:text-emerald-400"

  return (
    <div className="flex justify-between items-end gap-2 sm:gap-4 w-full">
      {dimensions.map((dim, index) => {
        const hasValue = values[index] !== ""
        const hasError = errors[index]

        let borderClass =
          colorScheme === "indigo" ? "border-indigo-100 dark:border-indigo-500/20" : "border-violet-100 dark:border-violet-500/20"
        let bgClass =
          colorScheme === "indigo" ? "bg-indigo-50/20 dark:bg-indigo-500/5" : "bg-violet-50/20 dark:bg-violet-500/5"
        let textColor = "text-slate-800 dark:text-slate-100"

        if (hasError) {
          borderClass = "border-red-500 border-[1.5px] ring-2 ring-red-500/20"
          bgClass = "bg-red-50/50 dark:bg-red-950/30"
          textColor = "text-red-600 dark:text-red-400"
        } else if (hasValue) {
          borderClass = "border-emerald-500 border-[1.5px]"
          bgClass = "bg-emerald-50/40 dark:bg-emerald-950/20"
          textColor = activeNumberColor
        }

        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className="mb-2 text-center h-5 flex flex-col justify-end">
              <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                {dim.label}
              </span>
            </div>

            <div className={`relative w-full aspect-square max-w-[3rem] rounded-lg border transition-all duration-300 shadow-sm ${borderClass} ${bgClass} ${focusRingColor}`}>
              <input
                type="text"
                maxLength="1"
                placeholder="-"
                onFocus={(e) => {
                  e.target.select()
                  setFocusedIndex(index)
                }}
                onBlur={() => setFocusedIndex(null)}
                ref={(el) => {
                  inputs.current[index] = el
                }}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={`w-full h-full absolute inset-0 text-center text-lg sm:text-xl font-semibold bg-transparent outline-none transition-colors placeholder:text-slate-300 dark:placeholder:text-slate-600 ${textColor}`}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
