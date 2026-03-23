import { useState, useEffect } from "react"
import ResponseCard from "./components/ResponseCard"
import {
  BarChart3,
  History,
  LayoutDashboard,
  Trophy,
  Trash2,
  Clock,
  CheckCircle2,
  Moon,
  Sun,
} from "lucide-react"

export default function App() {
  const [responseA, setResponseA] = useState(null)
  const [responseB, setResponseB] = useState(null)
  const [focusBTrigger, setFocusBTrigger] = useState(0)
  const [resetSignal, setResetSignal] = useState(0)
  const [history, setHistory] = useState([])
  const [view, setView] = useState("evaluate")
  const [theme, setTheme] = useState(() => localStorage.getItem("valor-theme") || "light")

  const handleScoreA = (data) => {
    setResponseA(data)
    setFocusBTrigger((prev) => prev + 1)
  }

  useEffect(() => {
    const saved = localStorage.getItem("valor-history")
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("valor-theme", theme)
  }, [theme])

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
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }
      const updated = [newEntry, ...history]
      setHistory(updated)
      localStorage.setItem("valor-history", JSON.stringify(updated))
    }
    setResponseA(null)
    setResponseB(null)
    setResetSignal((prev) => prev + 1)
  }

  const deleteItem = (id) => {
    const filtered = history.filter((entry) => entry.id !== id)
    setHistory(filtered)
    localStorage.setItem("valor-history", JSON.stringify(filtered))
  }

  const deleteAll = () => {
    setHistory([])
    localStorage.removeItem("valor-history")
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 w-full max-w-6xl mx-auto flex flex-col items-center text-slate-900 transition-colors dark:text-slate-100">
      <div className="text-center mb-4 md:mb-8 w-full max-w-xl px-4 mt-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 flex items-center justify-center gap-3 text-slate-800 tracking-tight dark:text-slate-100">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 sm:p-2.5 rounded-xl shadow-[0_4px_10px_rgb(99,102,241,0.3)] border border-indigo-400">
            <BarChart3 size={24} className="text-white" strokeWidth={2.5} />
          </div>
          Valor Evaluator
        </h1>
        <p className="text-sm text-slate-500 font-medium tracking-wide dark:text-slate-400">
          Response Evaluation Dashboard
        </p>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:border-slate-300 hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-900"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={14} strokeWidth={2.5} /> : <Sun size={14} strokeWidth={2.5} />}
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>
        </div>
      </div>

      <div className="bg-indigo-50/50 backdrop-blur-md p-1.5 rounded-xl shadow-sm border border-indigo-100/50 mb-10 flex items-center w-max mx-auto dark:bg-slate-900/60 dark:border-slate-700/80">
        <button
          onClick={() => setView("evaluate")}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
            view === "evaluate"
              ? "bg-white text-indigo-700 shadow-sm border border-indigo-100 dark:bg-slate-800 dark:text-indigo-300 dark:border-slate-700"
              : "text-slate-500 hover:text-indigo-600 hover:bg-white/40 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-slate-800/60"
          }`}
        >
          <LayoutDashboard size={16} strokeWidth={2.5} />
          Evaluation
        </button>
        <button
          onClick={() => setView("history")}
          className={`flex items-center gap-2 px-5 sm:px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
            view === "history"
              ? "bg-white text-indigo-700 shadow-sm border border-indigo-100 dark:bg-slate-800 dark:text-indigo-300 dark:border-slate-700"
              : "text-slate-500 hover:text-indigo-600 hover:bg-white/40 dark:text-slate-400 dark:hover:text-indigo-300 dark:hover:bg-slate-800/60"
          }`}
        >
          <History size={16} strokeWidth={2.5} />
          History
        </button>
      </div>

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

          {responseA && responseB && (
            <div className="mt-8 max-w-[480px] w-full bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900/70 dark:border-slate-700">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="bg-amber-100 p-2.5 rounded-lg border border-amber-200 shadow-sm">
                    <Trophy size={20} className="text-amber-600" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5 dark:text-slate-500">
                      Winner
                    </p>
                    <p className="font-bold text-slate-800 text-lg dark:text-slate-100">{getWinner()}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5 dark:text-slate-500">
                    Score Differece
                  </p>
                  <p className="font-bold text-slate-700 text-lg dark:text-slate-200">
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

      {view === "history" && (
        <div className="w-full max-w-4xl mx-auto pb-8">
          {history.length > 0 ? (
            <>
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Clock size={18} className="text-indigo-500" strokeWidth={2.5} />
                    Evaluation History
                  </h2>
                </div>
                <button
                  onClick={deleteAll}
                  className="text-slate-400 hover:text-red-500 text-sm font-semibold transition-colors flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-md dark:text-slate-500 dark:hover:bg-red-950/40"
                >
                  <Trash2 size={14} />
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/80 backdrop-blur-md border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all relative dark:bg-slate-900/70 dark:border-slate-700 dark:hover:border-slate-600"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-100 shadow-sm flex items-center gap-1.5 dark:bg-indigo-500/10 dark:text-indigo-300 dark:border-indigo-500/20">
                        <Trophy size={12} className="text-indigo-500" strokeWidth={2.5} />
                        Winner: {item.winner}
                      </span>
                      <span className="text-indigo-600 font-black text-[11px] bg-white px-2 py-1 rounded shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 dark:text-indigo-300">
                        Δ {item.difference}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-indigo-50/20 rounded-lg p-2.5 border border-indigo-100/50 dark:bg-indigo-500/5 dark:border-indigo-500/10">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 dark:text-slate-400">
                          Response A
                        </p>
                        <p className="font-extrabold text-slate-800 text-base mb-2 dark:text-slate-100">
                          {item.responseA.score}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            T {item.responseA.dimensions.truth}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            IF {item.responseA.dimensions.if}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            W {item.responseA.dimensions.writing}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            V {item.responseA.dimensions.verbosity}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            C {item.responseA.dimensions.correctness}
                          </span>
                        </div>
                      </div>

                      <div className="bg-violet-50/20 rounded-lg p-2.5 border border-violet-100/50 dark:bg-violet-500/5 dark:border-violet-500/10">
                        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 dark:text-slate-400">
                          Response B
                        </p>
                        <p className="font-extrabold text-slate-800 text-base mb-2 dark:text-slate-100">
                          {item.responseB.score}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            T {item.responseB.dimensions.truth}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            IF {item.responseB.dimensions.if}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            W {item.responseB.dimensions.writing}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            V {item.responseB.dimensions.verbosity}
                          </span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-semibold text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300">
                            C {item.responseB.dimensions.correctness}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2 border-t border-slate-100 pt-2.5 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-semibold dark:text-slate-500">
                        {item.time}
                      </span>
                      <button
                        onClick={() => deleteItem(item.id)}
                        className="px-2.5 py-1.5 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase shadow-sm dark:bg-red-950/40 dark:hover:bg-red-950/60"
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
            <div className="text-center py-20 bg-white/40 border-2 border-slate-200 border-dashed rounded-2xl dark:bg-slate-900/40 dark:border-slate-700">
              <History className="text-slate-300 mx-auto mb-3 dark:text-slate-600" size={28} />
              <h3 className="text-base font-bold text-slate-600 mb-1 dark:text-slate-300">No history</h3>
              <p className="text-sm text-slate-400 font-medium dark:text-slate-500">
                Complete an evaluation to see it here.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
