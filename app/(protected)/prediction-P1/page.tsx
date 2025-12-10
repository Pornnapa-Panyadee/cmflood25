"use client";

import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/Header";
import { WaterLevelChart } from "@/components/WaterLevelChart";
import { ModelSelector } from "@/components/ModelSelector";
import { InputDataEditor } from "@/components/InputDataEditor";
import { PredictionResult } from "@/components/PredictionResult";
import {
  parseP1CSV,
  parseInputCSV,
  WaterLevelData,
} from "@/lib/csvParser";
import {
  predict,
  modelConfigs,
  ModelType,
  NetworkWeights,
} from "@/lib/neuralNetwork";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Index() {
  const { toast } = useToast();
  const [waterData, setWaterData] = useState<WaterLevelData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelType | null>(
    null
  );
  const [inputData, setInputData] = useState<Record<string, number>>({});
  const [inputColumns, setInputColumns] = useState<string[]>([]);
  const [prediction, setPrediction] = useState<{
    label: string;
    value: number;
    hours: number;
  } | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  // Load P1 data
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch("/data_prediction/p1.csv");
        const text = await response.text();
        const data = parseP1CSV(text);
        setWaterData(data);
      } catch (error) {
        console.error("Error loading P1 data:", error);
        toast({
          title: "ข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูล P1 ได้",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [toast]);

  // Load input data when model changes
  const loadInputData = useCallback(
    async (model: ModelType) => {
      const config = modelConfigs[model];
      try {
        const response = await fetch(config.inputFile);
        const text = await response.text();
        const { data } = parseInputCSV(text);

        // Extract only the required columns
        const filtered: Record<string, number> = {};
        config.inputColumns.forEach((col) => {
          const value = data[col];
          if (typeof value === "number") {
            filtered[col] = value;
          }
        });

        setInputData(filtered);
        setInputColumns(config.inputColumns);
        setPrediction(null);
      } catch (error) {
        console.error("Error loading input data:", error);
        toast({
          title: "ข้อผิดพลาด",
          description: `ไม่สามารถโหลดข้อมูล input สำหรับ ${model} ได้`,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const handleModelSelect = (model: ModelType) => {
    setSelectedModel(model);
    loadInputData(model);
  };

  const handleInputChange = (key: string, value: number) => {
    setInputData((prev) => ({ ...prev, [key]: value }));
  };

  const handlePredict = async () => {
    if (!selectedModel) return;

    setIsPredicting(true);
    const config = modelConfigs[selectedModel];

    // Determine prediction hours from model type
    const predictionHours = selectedModel.includes("9") ? 9 : 12;

    try {
      // Load weights
      const weightsResponse = await fetch(config.weightsFile);
      const weights: NetworkWeights = await weightsResponse.json();

      // Prepare inputs in correct order
      const inputs = config.inputColumns.map(
        (col) => inputData[col] || 0
      );

      // Run prediction
      const result = predict(inputs, weights);

      setPrediction({
        label: config.predictionLabel,
        value: result,
        hours: predictionHours,
      });

      toast({
        title: "พยากรณ์สำเร็จ",
        description: `${config.predictionLabel}: ${result.toFixed(
          3
        )} ม.`,
      });
    } catch (error) {
      console.error("Prediction error:", error);
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถคำนวณการพยากรณ์ได้",
        variant: "destructive",
      });
    } finally {
      setIsPredicting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>กำลังโหลดข้อมูล...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* แถวบน: กราฟระดับน้ำ P1 (การ์ดใหญ่เต็มแถว) */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              กราฟระดับน้ำ P1
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({waterData.length.toLocaleString()} รายการ)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <WaterLevelChart data={waterData} prediction={prediction} />
          </CardContent>
        </Card>

        {/* แถวล่าง: layout แบบ 3 คอลัมน์ตามภาพที่แนบ */}
        <section className="grid gap-6 md:grid-cols-4 items-start">
          {/* ซ้าย: เลือก Model พยากรณ์ */}
          <Card className="glass-card md:col-span-1">
            <CardHeader>
              <CardTitle className="text-base">
                เลือก Model พยากรณ์
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ModelSelector
                selectedModel={selectedModel}
                onSelectModel={handleModelSelect}
                isLoading={isPredicting}
              />
            </CardContent>
          </Card>

          {/* กลาง: ข้อมูล Input (แก้ไขได้) */}
          <Card className="glass-card md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">
                ข้อมูล Input (แก้ไขได้)
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {selectedModel && inputColumns.length > 0 ? (
                <InputDataEditor
                  columns={inputColumns}
                  data={inputData}
                  onChange={handleInputChange}
                />
              ) : (
                <div className="text-sm text-muted-foreground text-center py-10">
                  กรุณาเลือก Model พยากรณ์ทางด้านซ้าย
                  เพื่อโหลดข้อมูล Input
                </div>
              )}
            </CardContent>
          </Card>

          {/* ขวา: การ์ดเล็ก 2 ใบ (ปุ่มพยากรณ์ + ผลการพยากรณ์) */}
          <div className="md:col-span-1 space-y-6">
            {/* การ์ดปุ่มพยากรณ์ */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base text-center">
                  พยากรณ์
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="flex justify-center">
                  <Button
                    onClick={handlePredict}
                    disabled={isPredicting || !selectedModel}
                    size="lg"
                    className="px-6 gap-2 w-full"
                  >
                    {isPredicting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        กำลังคำนวณ...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4" />
                        {selectedModel
                          ? `พยากรณ์ ${
                              modelConfigs[selectedModel].predictionLabel
                            }`
                          : "เลือก Model ก่อนพยากรณ์"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* การ์ดผลการพยากรณ์ */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base text-center">
                  ผลการพยากรณ์
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {prediction ? (
                  <PredictionResult
                    label={prediction.label}
                    value={prediction.value}
                    modelName={selectedModel!}
                  />
                ) : (
                  <div className="text-sm text-muted-foreground text-center py-6">
                    ยังไม่มีผลการพยากรณ์
                    <br />
                    กรุณากดปุ่ม “พยากรณ์”
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
