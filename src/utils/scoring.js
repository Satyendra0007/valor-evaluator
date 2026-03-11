export const calculateScore = (values) => {
  const truth = Number(values[0])
  const IF = Number(values[1])
  const writing = Number(values[2])
  const verbosity = Number(values[3])
  const correctness = Number(values[4])

  const score =
    IF * 0.25 +
    truth * 0.25 +
    correctness * 0.20 +
    writing * 0.15 +
    verbosity * 0.15

  return Number(score.toFixed(2))
}

export const getRating = (score) => {
  if (score >= 5.5) return { number: 6, label: "Excellent" }
  if (score >= 4.5) return { number: 5, label: "Good" }
  if (score >= 3.5) return { number: 4, label: "Fair" }
  if (score >= 2.5) return { number: 3, label: "Mediocre" }
  if (score >= 1.5) return { number: 2, label: "Poor" }
  return { number: 1, label: "Very Poor" }
}