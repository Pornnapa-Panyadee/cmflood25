// app/predictor/page.tsx
"use client"

import { useState } from "react"
import { predict } from "@/lib/predictMatlab"

export default function PredictorPage() {
  const FEATURE_GROUPS: Record<string, string[]> = {
    P1: ["P1", "P1mv4", "P1mv11", "P1t-5", "P1t-13", "P1t-23"],
    P75: ["P75", "P75t-14", "P75t-17", "P75t-24"],
    P67: ["P67", "P67mv5", "P67mv19", "P67t-12"],
    P20: ["P20", "P20mv3", "P20mv24", "P20t-3", "P20t-15"],
    P21: ["P.21", "P21mv5", "P21t-4", "P21t-17"],
  }

  const FEATURE_NAMES = Object.values(FEATURE_GROUPS).flat()
  const [inputs, setInputs] = useState<number[]>(Array(FEATURE_NAMES.length).fill(NaN))
  const [y, setY] = useState<number | null>(null)
  const [mode, setMode] = useState<"form" | "text">("form")
  const [textInput, setTextInput] = useState("")

  // สำหรับฟอร์ม
  const handleFormChange = (i: number, value: string) => {
    const arr = [...inputs]
    arr[i] = value === "" ? NaN : parseFloat(value)
    setInputs(arr)
  }

  // สำหรับ text mode
  const handleTextSubmit = () => {
    const tokens = textInput
      .split(/[\s,]+/) // ตัดช่องว่างหรือคอมม่า
      .filter((t) => t.length > 0)
      .map((t) => parseFloat(t))
    const arr = Array(FEATURE_NAMES.length).fill(NaN)
    for (let i = 0; i < Math.min(tokens.length, arr.length); i++) arr[i] = tokens[i]
    setInputs(arr)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold text-center">
        🧠 MLP Prediction (MATLAB → Python → Next.js)
      </h1>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 border-b pb-2">
        <button
          onClick={() => setMode("form")}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            mode === "form"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Form Mode
        </button>
        <button
          onClick={() => setMode("text")}
          className={`px-4 py-2 font-medium rounded-t-lg ${
            mode === "text"
              ? "bg-blue-600 text-white"
              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Text Mode
        </button>
      </div>

      {/* Form Mode */}
      {mode === "form" && (
        <div className="space-y-8">
          {Object.entries(FEATURE_GROUPS).map(([group, features]) => (
            <div key={group} className="border rounded-xl p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-blue-700 mb-3">{group}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {features.map((name) => {
                  const index = FEATURE_NAMES.indexOf(name)
                  return (
                    <div key={name} className="flex flex-col space-y-1">
                      <label className="text-sm font-medium text-gray-700">{name}</label>
                      <input
                        type="number"
                        step="any"
                        placeholder={name}
                        className="border rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => handleFormChange(index, e.target.value)}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Text Mode */}
      {mode === "text" && (
        <div className="space-y-4">
          <textarea
            rows={6}
            placeholder="ใส่ค่าฟีเจอร์ทั้งหมด เช่น 1.23, 2.5, 3.7 ... หรือคั่นด้วยช่องว่าง"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleTextSubmit}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
          >
            ใช้ค่าจาก Text
          </button>
        </div>
      )}

      {/* ปุ่ม Predict + ผลลัพธ์ */}
      <div className="flex flex-col items-center space-y-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md"
          onClick={() => setY(predict(inputs))}
        >
          Predict
        </button>

        {y !== null && (
          <div className="text-lg font-semibold">
            Prediction: <span className="text-blue-700">{y.toFixed(6)}</span>
          </div>
        )}
      </div>
    </div>
  )
}
