import { useState, useEffect } from "react"
import ResponseCard from "./components/ResponseCard"
import { BarChart3 } from "lucide-react"
import { History, LayoutDashboard } from "lucide-react"
import { Trophy } from "lucide-react"
import { Trash2 } from "lucide-react"
import { Clock } from "lucide-react"

export default function App() {

  const [responseA, setResponseA] = useState(null)
  const [responseB, setResponseB] = useState(null)

  const [resetSignal, setResetSignal] = useState(0)
  const [history, setHistory] = useState([])

  // NEW: view switch
  const [view, setView] = useState("evaluate")

  // load history
  useEffect(() => {
    const saved = localStorage.getItem("vindex-history")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  const getWinner = () => {

    if (responseA.score > responseB.score) return "Response A"
    if (responseB.score > responseA.score) return "Response B"

    return "Tie"
  }

  const handleReset = () => {

    if (responseA && responseB) {

      const newEntry = {
        id: Date.now(),

        responseA,
        responseB,

        winner: getWinner(),

        difference: Math.abs(
          responseA.score - responseB.score
        ).toFixed(2),

        time: new Date().toLocaleTimeString()
      }

      const updated = [newEntry, ...history]

      setHistory(updated)

      localStorage.setItem(
        "vindex-history",
        JSON.stringify(updated)
      )
    }

    setResponseA(null)
    setResponseB(null)

    setResetSignal(prev => prev + 1)
  }

  const deleteItem = (id) => {

    const filtered = history.filter(h => h.id !== id)

    setHistory(filtered)

    localStorage.setItem(
      "vindex-history",
      JSON.stringify(filtered)
    )
  }

  const deleteAll = () => {

    setHistory([])

    localStorage.removeItem("vindex-history")
  }

  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-100 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-2 flex items-center justify-center gap-2 text-gray-800">
        <BarChart3 size={28} className="text-indigo-600" />
        Vindex Evaluator
      </h1>

      <p className="text-center text-sm text-gray-500 mb-8">
        Response Evaluation Dashboard
      </p>

      {/* Tabs */}

      <div className="flex justify-center gap-3 mb-10">

        <button
          onClick={() => setView("evaluate")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
${view === "evaluate"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white border hover:bg-gray-50"}
`}
        >
          <LayoutDashboard size={16} />
          Evaluation
        </button>

        <button
          onClick={() => setView("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
${view === "history"
              ? "bg-indigo-600 text-white shadow-md"
              : "bg-white border hover:bg-gray-50"}
`}
        >
          <History size={16} />
          History
        </button>

      </div>

      {/* ---------------- EVALUATION VIEW ---------------- */}

      {view === "evaluate" && (

        <>
          <div className="grid md:grid-cols-2 justify-center gap-6 max-w-4xl mx-auto">

            <ResponseCard
              title="Response A"
              onScore={setResponseA}
              resetSignal={resetSignal}
              autoFocus
            />

            <ResponseCard
              title="Response B"
              onScore={setResponseB}
              resetSignal={resetSignal}
            />

          </div>

          {responseA && responseB && (



            <div className="mt-8 max-w-sm mx-auto bg-white border rounded-xl p-6 shadow-md">

              <div className="flex justify-center mb-4">

                <div className="bg-indigo-100 p-2 rounded-full">
                  <Trophy size={18} className="text-indigo-600" />
                </div>

              </div>

              <div className="grid grid-cols-2 text-center">

                <div>

                  <p className="text-xs text-gray-500">
                    Winner
                  </p>

                  <p className="font-bold text-indigo-700 text-lg">
                    {getWinner()}
                  </p>

                </div>

                <div>

                  <p className="text-xs text-gray-500">
                    Difference
                  </p>

                  <p className="font-semibold text-purple-700 text-lg">
                    {Math.abs(responseA.score - responseB.score).toFixed(2)}
                  </p>

                </div>

              </div>

              <button
                onClick={handleReset}
                className="mt-5 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                Next Turn
              </button>

            </div>

          )}

        </>
      )}

      {/* ---------------- HISTORY VIEW ---------------- */}

      {view === "history" && (

        <div className="max-w-4xl mx-auto">

          {history.length > 0 ? (

            <>
              <div className="flex justify-between mb-4">

                <h2 className="font-semibold flex items-center gap-2">
                  <Clock size={16} className="text-indigo-600" />
                  Evaluation History
                </h2>

                <button
                  onClick={deleteAll}
                  className="text-red-500 text-sm"
                >
                  Delete All
                </button>

              </div>

              <div className="grid md:grid-cols-2 gap-3">

                {history.map(item => (

                  <div
                    key={item.id}
                    className="bg-white border rounded-xl p-3 shadow-sm text-xs hover:shadow-md transition"
                  >

                    {/* Winner + Difference */}
                    <div className="flex justify-between items-center mb-2">

                      <span className="px-2 py-[2px] rounded-md bg-indigo-100 text-indigo-700 font-semibold">
                        {item.winner}
                      </span>

                      <span className="text-gray-500 font-medium">
                        Δ {item.difference}
                      </span>

                    </div>

                    {/* Response Scores */}
                    <div className="grid grid-cols-2 gap-2">

                      {/* Response A */}
                      <div className="bg-indigo-50 rounded-lg p-2">

                        <p className="text-[10px] text-gray-500 mb-1">
                          Response A
                        </p>

                        <p className="font-bold text-indigo-700 mb-1">
                          Score {item.responseA.score}
                        </p>

                        <div className="flex flex-wrap gap-1">

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            T {item.responseA.dimensions.truth}
                          </span>

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            IF {item.responseA.dimensions.if}
                          </span>

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            W {item.responseA.dimensions.writing}
                          </span>

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            V {item.responseA.dimensions.verbosity}
                          </span>

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            C {item.responseA.dimensions.correctness}
                          </span>

                        </div>

                      </div>

                      {/* Response B */}
                      <div className="bg-purple-50 rounded-lg p-2">

                        <p className="text-[10px] text-gray-500 mb-1">
                          Response B
                        </p>

                        <p className="font-bold text-purple-700 mb-1">
                          Score {item.responseB.score}
                        </p>

                        <div className="flex flex-wrap gap-1">

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            T {item.responseB.dimensions.truth}
                          </span>

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            IF {item.responseB.dimensions.if}
                          </span>

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            W {item.responseB.dimensions.writing}
                          </span>

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            V {item.responseB.dimensions.verbosity}
                          </span>

                          <span className="px-1.5 py-[2px] bg-white border rounded">
                            C {item.responseB.dimensions.correctness}
                          </span>

                        </div>

                      </div>

                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-2">

                      <span className="text-gray-400 text-[10px]">
                        {item.time}
                      </span>

                      <button
                        onClick={() => deleteItem(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            </>

          ) : (

            <p className="text-center text-gray-400">
              No history yet
            </p>

          )}

        </div>

      )}

    </div>
  )
}