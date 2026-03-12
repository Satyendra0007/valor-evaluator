import { useRef, useEffect, useState } from "react"

const labels = ["Truth", "IF", "Writing", "Verbosity", "Correctness"]

export default function ScoreInputs({ onComplete, resetSignal, autoFocus }) {

  const inputs = useRef([])
  const [values, setValues] = useState(["", "", "", "", ""])
  const [errors, setErrors] = useState([false, false, false, false, false])

  const handleChange = (e, index) => {

    let val = e.target.value

    // allow empty (for backspace)
    if (val === "") {

      const newValues = [...values]
      newValues[index] = ""
      setValues(newValues)

      const newErrors = [...errors]
      newErrors[index] = false
      setErrors(newErrors)

      return
    }

    // invalid
    if (!/^[1-6]$/.test(val)) {

      const newErrors = [...errors]
      newErrors[index] = true
      setErrors(newErrors)

      return
    }

    // valid
    const newValues = [...values]
    newValues[index] = val
    setValues(newValues)

    const newErrors = [...errors]
    newErrors[index] = false
    setErrors(newErrors)

    // move focus
    if (index < 4) {
      inputs.current[index + 1]?.focus()
    }

    // calculate if all valid
    const filled = newValues.every(v => v !== "")
    const hasError = newErrors.some(e => e)

    if (filled && !hasError) {
      onComplete(newValues)
    }

  }

  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace") {

      // Only move to previous if current input is already empty
      if (e.target.value === "" && index > 0) {
        inputs.current[index - 1]?.focus()
      }

    }

  }

  // reset inputs
  useEffect(() => {

    setValues(["", "", "", "", ""])
    setErrors([false, false, false, false, false])

    inputs.current.forEach(input => {
      if (input) input.value = ""
    })

    if (autoFocus) {
      inputs.current[0]?.focus()
    }

  }, [resetSignal, autoFocus])

  return (

    <div className="flex justify-center gap-3">

      {labels.map((label, index) => {

        const border = errors[index]
          ? "border-red-500"
          : values[index]
            ? "border-green-500"
            : "border-gray-300"

        return (

          <div key={index} className="flex flex-col items-center">

            <input
              type="text"
              maxLength="1"
              onFocus={(e) => e.target.select()}
              ref={(el) => (inputs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`
w-12 h-12
text-center
text-lg
font-semibold
rounded-lg
border-2
${border}
bg-white
focus:ring-2 focus:ring-indigo-500
transition
`}
            />

            <span className="text-[10px] font-semibold mt-1 text-gray-600">
              {label}
            </span>

          </div>

        )

      })}

    </div>

  )

}