// lib/predict.ts
import model from "@/public/model_export.json"

// safe tanh
function tanh(x: number) {
  const e1 = Math.exp(x)
  const e2 = Math.exp(-x)
  return (e1 - e2) / (e1 + e2)
}

// ทำพรีโพรเซส: impute(mean) -> standardize
function preprocess(x: number[]): number[] {
  const fill = (model as any).preprocess.imputer.fill_values as number[]
  const mu   = (model as any).preprocess.scaler.mean as number[]
  const sc   = (model as any).preprocess.scaler.scale as number[]

  // 1) impute (mean)
  const imputed = x.map((v, i) => (Number.isFinite(v) ? v : fill[i]))

  // 2) standardize
  return imputed.map((v, i) => (v - mu[i]) / sc[i])
}

// dense forward: y = W*x + b
function dense(input: number[], W: number[][], b: number[]): number[] {
  const out: number[] = new Array(b.length).fill(0)
  for (let i = 0; i < b.length; i++) {
    let s = b[i]
    for (let j = 0; j < input.length; j++) {
      s += W[j][i] * input[j]  // sklearn: shape is (in_features, out_features)
    }
    out[i] = s
  }
  return out
}

export function predict(inputFeatures: number[]): number {
  const m: any = model
  const X = preprocess(inputFeatures)

  const coefs: number[][][] = m.mlp.coefs
  const intercepts: number[][] = m.mlp.intercepts
  const activation: string = m.mlp.activation  // "tanh"

  // hidden layer(s)
  let a: number[] = X.slice()
  for (let L = 0; L < coefs.length - 1; L++) {
    let z = dense(a, coefs[L], intercepts[L])
    a = activation === "tanh" ? z.map(tanh) : z.map(v => Math.max(0, v)) // เผื่อกรณี "relu"
  }
  // output layer = linear
  const out = dense(a, coefs[coefs.length - 1], intercepts[intercepts.length - 1])
  return out[0]
}
