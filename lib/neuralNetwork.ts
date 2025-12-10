export interface NetworkWeights {
  Layer1: {
    InputWeights: number[];
    Biases: number;
  };
  Layer2: {
    LayerWeights: number;
    Biases: number;
  };
}

// Sigmoid activation function
function sigmoid(x: number): number {
  return 1 / (1 + Math.exp(-x));
}

// Predict using 2-layer neural network
export function predict(inputs: number[], weights: NetworkWeights): number {
  const { Layer1, Layer2 } = weights;
  
  // Layer 1: weighted sum + bias, then sigmoid
  let sum = 0;
  for (let i = 0; i < inputs.length; i++) {
    sum += inputs[i] * (Layer1.InputWeights[i] || 0);
  }
  sum += Layer1.Biases;
  const hiddenOutput = sigmoid(sum);
  
  // Layer 2: weighted sum + bias
  const output = Layer2.LayerWeights * hiddenOutput + Layer2.Biases;
  
  return output;
}

export type ModelType = 'B9hr' | 'B12hr' | 'C9hr' | 'C12hr';

export const modelConfigs: Record<ModelType, {
  weightsFile: string;
  inputFile: string;
  predictionLabel: string;
  inputColumns: string[];
}> = {
  B9hr: {
    weightsFile: '/model/network_weights_biases_9B.json',
    inputFile: '/data_prediction/B9hr.csv',
    predictionLabel: 'P1+9hr',
    inputColumns: ['P1', 'P1mv4', 'P1mv11', 'P1t-5', 'P1t-13', 'P1t-23', 'P75', 'P75t-14', 'P75t-17', 'P75t-24', 'P67', 'P67mv5', 'P67mv19', 'P67t-12', 'P20', 'P20mv3', 'P20mv24', 'P20t-3', 'P20t-15', 'P.21', 'P21mv5', 'P21t-4', 'P21t-17'],
  },
  B12hr: {
    weightsFile: '/model/network_weights_biases_12B1.json',
    inputFile: '/data_prediction/B12hr.csv',
    predictionLabel: 'P1+12hr',
    inputColumns: ['P1', 'P1mv4', 'P1t-13', 'P1t-23', 'P75', 'P75mv18', 'P75t-24', 'P67', 'P67mv5', 'P67mv13', 'P67t-18', 'P20', 'P20mv3', 'P20t-3', 'P20t-13', 'P20t-20', 'P20t-23', 'P20t-24', 'P.21', 'P21mv5', 'P21t-4', 'P21t-12'],
  },
  C9hr: {
    weightsFile: '/model/network_weights_biases_9C.json',
    inputFile: '/data_prediction/C9hr.csv',
    predictionLabel: 'P1+9hr',
    inputColumns: ['P1', 'P1mv3', 'P1t-5', 'P1t-8', 'P1t-13', 'P75', 'P75mv15', 'P67', 'P67mv5', 'P67t-22', 'P67t-24', 'P20', 'P20mv2', 'P20mv24', 'P20t-9', 'P.21', 'P21t-1', 'P21t-12', 'P.103', 'P103t-1', 'P103t-13', 'P103t-24'],
  },
  C12hr: {
    weightsFile: '/model/network_weights_biases_12C1.json',
    inputFile: '/data_prediction/C12hr.csv',
    predictionLabel: 'P1+12hr',
    inputColumns: ['P1', 'P1mv3', 'P1t-5', 'P1t-11', 'P75', 'P75mv18', 'P75t-22', 'P75t-24', 'P67', 'P67mv3', 'P67t-9', 'P67t-23', 'P67t-24', 'P20', 'P20mv20', 'P20mv22', 'P20t-1', 'P.21', 'P21mv24', 'P21t-1', 'P21t-11', 'P.103', 'P103t-1', 'P103t-14', 'P103t-24'],
  },
};
