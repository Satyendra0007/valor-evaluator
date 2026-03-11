import { useRef, useEffect } from "react"

const labels = ["Truth", "IF", "Writing", "Verbosity", "Correctness"]

export default function ScoreInputs({ onComplete, resetSignal }) {

  const inputs = useRef([])
  const values = useRef(Array(5).fill(""))

  const handleChange = (e, index) => {
    const val = e.target.value

    if (!/^[1-6]?$/.test(val)) return

    values.current[index] = val
    e.target.value = val

    if (val && index < 4) {
      inputs.current[index + 1].focus()
    }

    if (values.current.every(v => v !== "")) {
      onComplete([...values.current])
    }
  }

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputs.current[index - 1].focus()
    }
  }

  useEffect(() => {
    values.current = Array(5).fill("")

    inputs.current.forEach((input) => {
      if (input) input.value = ""
    })

    inputs.current[0]?.focus()
  }, [resetSignal])

  return (
    <div className="flex justify-center gap-3 sm:gap-4">

      {labels.map((label, index) => (
        <div key={index} className="flex flex-col items-center">

          <input
            type="text"
            maxLength="1"
            ref={(el) => (inputs.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
            text-lg sm:text-xl
            text-center
            font-semibold
            rounded-xl
            border border-gray-300
            bg-white
            shadow-sm
            focus:ring-2 focus:ring-indigo-500
            transition
            "
          />

          <span className="text-[10px] sm:text-xs font-semibold mt-1 text-gray-600">
            {label}
          </span>

        </div>
      ))}

    </div>
  )
}