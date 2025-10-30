import model from "@/public/model/network_weights_biases_9B.json"

function tanh(x: number) {
  const e1 = Math.exp(x)
  const e2 = Math.exp(-x)
  return (e1 - e2) / (e1 + e2)
}

// simple dense layer (vector dot product)
function dense(input: number[], weights: number[], bias: number): number {
  if (input.length !== weights.length) {
    throw new Error(`Input length ${input.length} != weights length ${weights.length}`)
  }
  let sum = bias
  for (let i = 0; i < input.length; i++) {
    sum += weights[i] * input[i]
  }
  return sum
}

export function predict(inputFeatures: number[]): number {
  console.log(">> received input:", inputFeatures)

  const m: any = model
  const w1 = m.Layer1.InputWeights.map(Number)
  const b1 = Number(m.Layer1.Biases)
  const w2 = Number(m.Layer2.LayerWeights)
  const b2 = Number(m.Layer2.Biases)

  const z1 =
    w1.reduce((sum: number, w: number, i: number) => sum + w * (inputFeatures[i] ?? 0), b1)
  const a1 = Math.tanh(z1)
  const y = w2 * a1 + b2

  console.log("✅ Prediction output:", y)
  return y
}


// 🔬 Test
console.log(
  "Prediction:",
  predict([
    1.92, 1.91, 1.87, 1.88, 1.73, 1.67, 1.46, 1.47, 1.41, 1.26,
    1.73, 1.74, 1.65, 1.63, 1.01, 1.01, 1.00, 1.03, 0.96, 2.10,
    2.10, 2.10, 1.97
  ])
)
