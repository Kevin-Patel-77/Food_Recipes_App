import { useState } from "react";

const Test = () => {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <div className="center text-center p-5">
        <h1 className="font-bold text-2xl">Testing ClassPresso</h1>
      </div>

      <div className="border-2 border-gray-200 rounded-lg p-6 max-w-sm mx-auto shadow-lg">
        <h1 className="text-xl font-semibold text-center mb-4">
          Count: <span className="text-black">{count}</span>
        </h1>

        <div className="flex justify-center gap-4">
          <button
            onClick={increment}
            className="px-5 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 active:scale-95 transition"
          >
            Increment
          </button>

          <button
            onClick={decrement}
            className="px-5 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 active:scale-95 transition"
          >
            Decrement
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test;
