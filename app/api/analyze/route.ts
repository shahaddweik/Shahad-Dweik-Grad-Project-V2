import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import * as XLSX from 'xlsx';
import { DashboardData } from '@/types/dashboard';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not set.' }, { status: 500 });
    }

    const groq = new Groq({
      apiKey: apiKey,
    });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const customPrompt = formData.get('customPrompt') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // 1. Parse Excel/CSV to JSON string
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'array' });
    if (!workbook.SheetNames.length) {
      return NextResponse.json({ error: 'The uploaded file contains no sheets.' }, { status: 400 });
    }
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const allData = XLSX.utils.sheet_to_json(sheet);

    // Send a sample of data to the AI
    // Reverted to 35 records to respect Groq Free Tier limits (approx 12k tokens/min).
    const promptData = allData.slice(0, 35);
    const dataString = JSON.stringify(promptData);

    // 2. Prepare Detailed Prompt
    const isAdditive = customPrompt?.includes('(ADDITIVE REQUEST)');

    let objectivesSection = '';
    if (isAdditive) {
      objectivesSection = `
       OBJECTIVES (REFIMEMENT MODE - STRICT):
       1. **EXECUTE USER REQUEST ONLY**: You are updating an existing dashboard. You must ONLY generate what the user specifically asked for.
       2. **REMOVALS & REPLACEMENTS**: 
          - If the user asks to **REMOVE** an item, add its exact Title/Label to the "removals" list.
          - If the user asks to **REPLACE** an item (e.g., "Change Gender Bar Chart to Pie Chart"), add the OLD item's Title to "removals" and generate the NEW item in "dynamicCharts".
       3. **ZERO UNREQUESTED CONTENT**: 
          - Did the user ask for Metrics? If NO -> Return "keyMetrics": []
          - Did the user ask for Charts? If NO -> Return "dynamicCharts": []
          - Did the user ask for Insights? If NO -> Return "keyInsights": []
          - Did the user ask for Recommendations? If NO -> Return "recommendations": []
       4. **PRESERVE CONTEXT**: Use the provided sample data to generate the *requested* items accurately.
       `;
    } else {
      objectivesSection = `
       OBJECTIVES:
       1. **Infer Domain**: Figure out what this data represents.
       2. **Key Metrics**: Calculate 4 vital high-level metrics.
       3. **Dynamic Visualization**: Design 4-6 charts.
          - **VERIFY**: Check the keys. Do you see "Date", "Year", "Time", "Month"? 
          - **YES**: Use Line/Area charts for trends.
          - **NO**: DO NOT USE LINE/AREA CHARTS. Use Bar (distribution), Pie (composition), or Scatter (relationship).
       4. **Deep Strategic Insights**: Provide 5-6 comprehensive insights.
          - Contextualize "Why this matters".
       5. **Actionable Recommendations**: Suggest 5-6 concrete actions.
       `;
    }

    const schemaSection = `
       OUTPUT SCHEMA (Strict JSON):
       {
         "analysisTitle": "String",
         "analysisDescription": "String",
         "keyMetrics": [
           { "label": "String", "value": "String", "description": "String", "icon": "String (One of: Users, TrendingUp, DollarSign, Activity, BarChart, PieChart, AlertCircle, CheckCircle, Zap, Target)", "variant": "default" }
         ],
         "dynamicCharts": [
           {
             "id": "String (unique)",
             "title": "String",
             "description": "String",
             "chartType": "String (One of: 'bar', 'pie', 'line', 'area', 'scatter')",
             "data": [ { "name": "String", "value": "Number", "x": "Number (Optional)", "y": "Number (Optional)" } ] 
           }
         ],
         "keyInsights": [
           { "title": "String", "severity": "String (positive, warning, info)", "description": "String" }
         ],
         "recommendations": [
           { "title": "String", "action": "String", "impact": "String (high, medium, low)" }
         ],
         "removals": [
            { "type": "String", "title": "String" }
         ]
       }`;

    const prompt = `
      You are a Senior Strategic Consultant.
      Your goal is to analyze the provided dataset SAMPLE **accurately**, based ONLY on the data fields present.
      
      ${customPrompt ? `\nUSER SPECIAL INSTRUCTIONS: ${customPrompt}\n(IMPORTANT: Prioritize these instructions over default behavior.)\n` : ''}

      DATASET CONTEXT:
      - Total Records: ${allData.length}
      - Columns/Keys: ${Object.keys(promptData[0] || {}).join(", ")} <--- ONLY USE THESE FIELDS.
      
      SAMPLE DATA (First 35 rows):
      ${dataString}

      CRITICAL RULES (STRICT ADHERENCE REQUIRED):
      1. **NO HALLUCINATIONS**: Do NOT invent columns.
      2. **TITLE QUALITY**: Generate a clean, professional title.
      3. **DATA GROUNDING**: Every metric and chart MUST be derivable from the provided sample keys. Calculate percentages and rates precisely based on the provided JSON sample.
      4. **CONSISTENCY**: Use consistent precision for numbers (e.g., 2 decimal places for percentages).
      5. **ADDITIVE REQUESTS**: If this is an additive request, DO NOT re-generate standard analysis sections unless explicitly asked.

      ${objectivesSection}

      ${schemaSection}
    `;

    // 3. Generate Content using Groq with Fallback
    let chatCompletion;
    try {
      // Try Primary Model (Smartest)
      chatCompletion = await groq.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.0,
        max_tokens: 4000,
        response_format: { type: "json_object" },
      });
    } catch (primaryError: any) {
      console.warn("Primary model failed, attempting fallback...", primaryError.message);

      // Check for Rate Limit specifically or just try fallback generally
      // Try Fallback Model (Faster/Cheaper)
      try {
        chatCompletion = await groq.chat.completions.create({
          messages: [{ role: "user", content: prompt }],
          model: "llama-3.1-8b-instant",
          temperature: 0.0,
          max_tokens: 4000,
          response_format: { type: "json_object" },
        });
      } catch (fallbackError: any) {
        throw new Error(`AI Service Unavailable. Primary: ${primaryError.message}. Fallback: ${fallbackError.message}`);
      }
    }

    const text = chatCompletion.choices[0]?.message?.content || '{}';

    // 4. Clean and Parse JSON
    let dashboardData: DashboardData;
    let jsonString = text.trim();

    jsonString = jsonString.replace(/^```json\s*/, '').replace(/\s*```$/, '');

    try {
      dashboardData = JSON.parse(jsonString);
      // Inject actual record count
      dashboardData.recordCount = allData.length;
    } catch (parseError) {
      console.error('Failed to parse Groq response:', parseError);
      console.error('Raw response:', text);
      return NextResponse.json({
        error: 'Failed to parse AI response.',
        rawResponse: text
      }, { status: 500 });
    }

    return NextResponse.json(dashboardData);

  } catch (error: any) {
    console.error('Analysis failed:', error);

    return NextResponse.json({
      error: error.message || 'Analysis failed.',
      details: error.toString()
    }, { status: 500 });
  }
}
