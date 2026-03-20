import { useState, useEffect } from "react"
import ResponseCard from "./components/ResponseCard"
import { BarChart3, History, LayoutDashboard, Trophy, Trash2, Clock, CheckCircle2 } from "lucide-react"

export default function App() {

  const [responseA, setResponseA] = useState(null)
  const [responseB, setResponseB] = useState(null)

  const [focusBTrigger, setFocusBTrigger] = useState(0)

  const handleScoreA = (data) => {
    setResponseA(data)
    setFocusBTrigger(prev => prev + 1)
  }

  const [resetSignal, setResetSignal] = useState(0)
  const [history, setHistory] = useState([])

  const [view, setView] = useState("evaluate")

  useEffect(() => {
    const saved = localStorage.getItem("valor-history")
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
        difference: Math.abs(responseA.score - responseB.score).toFixed(2),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      const updated = [newEntry, ...history]
      setHistory(updated)
      localStorage.setItem("valor-history", JSON.stringify(updated))
    }
    setResponseA(null)
    setResponseB(null)
    setResetSignal(prev => prev + 1)
  }

  const deleteItem = (id) => {
    const filtered = history.filter(h => h.id !== id)
    setHistory(filtered)
    localStorage.setItem("valor-history", JSON.stringify(filtered))
  }

  const deleteAll = () => {
    setHistory([])
    localStorage.removeItem("valor-history")
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto flex flex-col items-center">

      {/* Header */}
      <div className="text-center mb-8 w-full max-w-xl px-4 mt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 flex items-center justify-center gap-3 text-slate-800 tracking-tight">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 sm:p-2.5 rounded-xl shadow-[0_4px_10px_rgb(99,102,241,0.3)] border border-indigo-400">
            <BarChart3 size={24} className="text-white" strokeWidth={2.5} />
          </div>
          Valor Evaluator
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-wide">
          Response Evaluation Dashboard
        </p>
      </div>

      {/* Segmented Control */}
      <div className="bg-indigo-50/50 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-indigo-100/50 mb-10 flex items-center w-max mx-auto">
        <button
          onClick={() => setView("evaluate")}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${view === "evaluate"
            ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
            : "text-slate-500 hover:text-indigo-600 hover:bg-white/40"
            }`}
        >
          <LayoutDashboard size={16} strokeWidth={2.5} />
          Evaluation
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${view === "history"
            ? "bg-white text-indigo-700 shadow-sm border border-indigo-100"
            : "text-slate-500 hover:text-indigo-600 hover:bg-white/40"
            }`}
        >
          <History size={16} strokeWidth={2.5} />
          History
        </button>
      </div>

      {/* ---------------- EVALUATION VIEW ---------------- */}
      {view === "evaluate" && (
        <div className="w-full flex-1 flex flex-col justify-between items-center">

          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 w-full mx-auto">
            <div className="flex-1 w-full max-w-[480px]">
              <ResponseCard
                title="Response A"
                onScore={handleScoreA}
                resetSignal={resetSignal}
                autoFocus
                colorScheme="indigo"
              />
            </div>

            <div className="flex-1 w-full max-w-[480px]">
              <ResponseCard
                title="Response B"
                onScore={setResponseB}
                resetSignal={resetSignal}
                colorScheme="violet"
                focusTrigger={focusBTrigger}
              />
            </div>
          </div>

          {/* Winner Banner */}
          {responseA && responseB && (
            <div className="mt-8 max-w-[480px] w-full bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-2.5 rounded-lg border border-amber-200 shadow-sm">
                    <Trophy size={20} className="text-amber-600" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                      Winner
                    </p>
                    <p className="font-bold text-slate-800 text-lg">
                      {getWinner()}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                    Score Differece
                  </p>
                  <p className="font-bold text-slate-700 text-lg">
                    {Math.abs(responseA.score - responseB.score).toFixed(2)}
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold py-3.5 rounded-lg hover:from-slate-700 hover:to-slate-800 transition-all shadow-md active:scale-[0.99]"
              >
                Evaluate Next Pair
                <CheckCircle2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          )}

        </div>
      )}

      {/* ---------------- HISTORY VIEW ---------------- */}
      {view === "history" && (
        <div className="w-full max-w-4xl mx-auto pb-8">
          {history.length > 0 ? (
            <>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Clock size={18} className="text-indigo-500" strokeWidth={2.5} />
                    Evaluation History
                  </h2>
                </div>
                <button
                  onClick={deleteAll}
                  className="text-slate-400 hover:text-red-500 text-sm font-semibold transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-md"
                >
                  <Trash2 size={14} />
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {history.map(item => (
                  <div
                    key={item.id}
                    className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all relative"
                  >
                    {/* Header: Winner + Difference */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100 shadow-sm flex items-center gap-1.5">
                        <Trophy size={12} className="text-indigo-500" strokeWidth={2.5} />
                        Winner: {item.winner}
                      </span>
                      <span className="text-indigo-600 font-black text-[11px] bg-white px-2 py-1 rounded shadow-sm border border-slate-100">
                        Δ {item.difference}
                      </span>
                    </div>

                    {/* Scores Comparison */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Response A */}
                      <div className="bg-indigo-50/20 rounded-lg p-2.5 border border-indigo-100/50">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Response A</p>
                        <p className="font-extrabold text-slate-800 text-base mb-2">{item.responseA.score}</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">T {item.responseA.dimensions.truth}</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">IF {item.responseA.dimensions.if}</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">W {item.responseA.dimensions.writing}</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">V {item.responseA.dimensions.verbosity}</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">C {item.responseA.dimensions.correctness}</span>
                        </div>
                      </div>

                      {/* Response B */}
                      <div className="bg-violet-50/20 rounded-lg p-2.5 border border-violet-100/50">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1">Response B</p>
                        <p className="font-extrabold text-slate-800 text-base mb-2">{item.responseB.score}</p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">T {item.responseB.dimensions.truth}</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">IF {item.responseB.dimensions.if}</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">W {item.responseB.dimensions.writing}</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">V {item.responseB.dimensions.verbosity}</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm">C {item.responseB.dimensions.correctness}</span>
                        </div>
                      </div>
                    </div>

                    {/* Footer - Delete single card explicitly visible */}
                    <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-2.5">
                      <span className="text-[10px] text-slate-400 font-semibold">{item.time}</span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-2.5 py-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase shadow-sm"
                        title="Delete this record"
                      >
                        <Trash2 size={12} strokeWidth={2.5} />
                        Delete
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white/40 border-2 border-slate-200 border-dashed rounded-2xl">
              <History className="text-slate-300 mx-auto mb-3" size={28} />
              <h3 className="text-base font-bold text-slate-600 mb-1">No history</h3>
              <p className="text-sm text-slate-400 font-medium">Complete an evaluation to see it here.</p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}