export interface WaterLevelData {
  date: string;
  hour: number;
  level: number;
  timestamp: Date;
}

export function parseP1CSV(csvText: string): WaterLevelData[] {
  const lines = csvText.trim().split('\n');
  const data: WaterLevelData[] = [];
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const parts = line.split(',');
    if (parts.length < 3) continue;
    
    const dateStr = parts[0].trim();
    const hour = parseInt(parts[1].trim(), 10);
    const level = parseFloat(parts[2].trim());
    
    if (isNaN(hour) || isNaN(level)) continue;
    
    // Parse date (format: DD/MM/YYYY)
    const dateParts = dateStr.split('/');
    if (dateParts.length !== 3) continue;
    
    const day = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const year = parseInt(dateParts[2], 10);
    
    const timestamp = new Date(year, month, day, hour);
    
    data.push({
      date: dateStr,
      hour,
      level,
      timestamp,
    });
  }
  
  // Sort by timestamp (oldest to newest)
  data.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  
  return data;
}

export interface InputData {
  [key: string]: number | string;
}

export function parseInputCSV(csvText: string): { headers: string[]; data: InputData } {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { headers: [], data: {} };
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/^\uFEFF/, ''));
  const values = lines[1].split(',').map(v => v.trim());
  
  const data: InputData = {};
  headers.forEach((header, index) => {
    const value = values[index];
    const numValue = parseFloat(value);
    data[header] = isNaN(numValue) ? value : numValue;
  });
  
  return { headers, data };
}
