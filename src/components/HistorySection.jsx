import { Clock } from "lucide-react"
import { Trash2 } from "lucide-react"

export default function HistorySection({ history, deleteItem, deleteAll }) {

  return (

    <div className="max-w-4xl mx-auto">

      <div className="flex justify-between items-center mb-4">


        <h2 className="font-semibold flex items-center gap-2">
          <Clock size={16} className="text-indigo-600" />
          Evaluation History
        </h2>

        <button
          onClick={deleteAll}
          className="text-red-500 text-sm hover:underline"
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

            {/* winner row */}

            <div className="flex justify-between items-center mb-2">

              <span className="text-indigo-600 font-semibold">
                {item.winner}
              </span>

              <span className="text-gray-400">
                Δ {item.difference}
              </span>

            </div>

            {/* scores */}

            <div className="grid grid-cols-2 gap-2">

              <div className="bg-indigo-50 rounded-md p-2">

                <p className="text-gray-500 text-[10px]">
                  Response A
                </p>

                <p className="font-semibold text-indigo-700">
                  Score {item.responseA.score}
                </p>

                <p className="text-[10px] text-gray-500">
                  T:{item.responseA.dimensions.truth}
                  IF:{item.responseA.dimensions.if}
                  W:{item.responseA.dimensions.writing}
                  V:{item.responseA.dimensions.verbosity}
                  C:{item.responseA.dimensions.correctness}
                </p>

              </div>

              <div className="bg-purple-50 rounded-md p-2">

                <p className="text-gray-500 text-[10px]">
                  Response B
                </p>

                <p className="font-semibold text-purple-700">
                  Score {item.responseB.score}
                </p>

                <p className="text-[10px] text-gray-500">
                  T:{item.responseB.dimensions.truth}
                  IF:{item.responseB.dimensions.if}
                  W:{item.responseB.dimensions.writing}
                  V:{item.responseB.dimensions.verbosity}
                  C:{item.responseB.dimensions.correctness}
                </p>

              </div>

            </div>

            {/* footer */}

            <div className="flex justify-between mt-2">

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

    </div>

  )

}