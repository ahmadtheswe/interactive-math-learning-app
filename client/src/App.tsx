import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-[1280px] mx-auto p-8 text-center">
      <div className="flex justify-center items-center gap-8">
        <a href="https://vite.dev" target="_blank" className="transition-all">
          <img 
            src={viteLogo} 
            className="h-24 p-6 transition-all hover:drop-shadow-[0_0_2em_#646cffaa]" 
            alt="Vite logo" 
          />
        </a>
        <a href="https://react.dev" target="_blank" className="transition-all">
          <img 
            src={reactLogo} 
            className="h-24 p-6 transition-all hover:drop-shadow-[0_0_2em_#61dafbaa]"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-5xl font-bold leading-tight mt-8">Vite + React</h1>
      <div className="mt-8">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="rounded-lg border border-transparent px-5 py-2 bg-[#1a1a1a] font-medium cursor-pointer transition-colors hover:border-[#646cff]"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code className="font-mono bg-[#1a1a1a] p-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-8 text-[#888]">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
