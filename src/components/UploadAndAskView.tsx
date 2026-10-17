import React, { useState, useRef } from 'react';
import { Journey, DocumentAnalysisResult } from '../types/journey';
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Trash2,
  Loader2,
  HelpCircle,
  ArrowRight,
  BookOpen,
  MessageSquare,
  ListPlus,
  PlusCircle,
} from 'lucide-react';

interface UploadAndAskViewProps {
  activeJourney: Journey;
  onApplyExtractedInsights: (extractedPains: any[], extractedTouchpoints: any[]) => void;
  onCreateJourneyFromDoc: (summaryText: string) => void;
  isDark?: boolean;
}

const PRESET_QUESTIONS = [
  'Extract all customer friction points, complaints, and usability obstacles.',
  'Summarize the core findings and customer research insights.',
  'Identify key channels and touchpoints where user expectations are unmet.',
  'What actionable opportunities can we implement to boost customer retention?',
];

export const UploadAndAskView: React.FC<UploadAndAskViewProps> = ({
  activeJourney,
  onApplyExtractedInsights,
  onCreateJourneyFromDoc,
  isDark = true,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<DocumentAnalysisResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileSelection = (selectedFile: File) => {
    setErrorMessage(null);
    setAnalysisResult(null);

    // Validate size (max 20MB)
    const maxSize = 20 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setErrorMessage('File size exceeds the 20MB limit. Please upload a smaller file.');
      return;
    }

    // Validate format
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMessage('Unsupported file format. Please upload a PDF, PNG, JPG, or JPEG file.');
      return;
    }

    setFile(selectedFile);

    // Read as Base64 for Gemini multimodal API
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Strip metadata prefix e.g. "data:application/pdf;base64,"
      const base64Data = result.split(',')[1];
      setFileBase64(base64Data);

      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(result);
      } else {
        setFilePreview(null);
      }
    };
    reader.onerror = () => {
      setErrorMessage('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileBase64(null);
    setFilePreview(null);
    setAnalysisResult(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file || !fileBase64) {
      setErrorMessage('Please upload a document or image first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64Data: fileBase64,
          mimeType: file.type,
          fileName: file.name,
          fileSize: file.size,
          question: question.trim() || 'Extract all customer friction points, touchpoints, quotes, and strategic improvement opportunities.',
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to analyze document.');
      }

      const data: DocumentAnalysisResult = await res.json();
      setAnalysisResult(data);
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || 'Error communicating with Gemini multimodal service.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleImportIntoActive = () => {
    if (!analysisResult) return;
    onApplyExtractedInsights(
      analysisResult.extractedPainPoints || [],
      analysisResult.extractedTouchpoints || []
    );
    setSuccessNotice('Extracted pain points and touchpoints merged into your active journey!');
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleGenerateJourneyDraft = () => {
    if (!analysisResult) return;
    onCreateJourneyFromDoc(
      `${analysisResult.documentSummary}\n\nKey Pains: ${analysisResult.extractedPainPoints.map((p) => p.point).join('; ')}`
    );
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <span>Upload & Ask AI (Multimodal Document Intelligence)</span>
        </h2>
        <p className="text-xs text-slate-400">
          Upload PDF reports, customer feedback spreadsheets, user interview transcripts, or screenshots to extract real insights with Gemini
        </p>
      </div>

      {/* Main Grid: Upload Zone & Question Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Dropzone (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !file && fileInputRef.current?.click()}
            className={`p-6 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all ${
              file
                ? 'border-purple-500/50 bg-slate-900/60'
                : 'border-slate-700 hover:border-purple-400 bg-slate-900/40 hover:bg-slate-900/80 cursor-pointer'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={(e) => e.target.files && e.target.files[0] && handleFileSelection(e.target.files[0])}
              className="hidden"
            />

            {!file ? (
              <div className="space-y-3">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600/20 to-cyan-500/20 text-cyan-400 flex items-center justify-center border border-purple-500/30">
                  <UploadCloud className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">
                    Drag & Drop your Document or Image
                  </h4>
                  <p className="text-xs text-slate-400">
                    Supports <strong>PDF, PNG, JPG, JPEG</strong> (Up to 20MB)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30 transition-colors"
                >
                  Browse Files
                </button>
              </div>
            ) : (
              <div className="w-full space-y-3">
                {filePreview ? (
                  <div className="w-full h-40 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center mb-2">
                    <img src={filePreview} alt="Preview" className="max-h-full max-w-full object-contain" />
                  </div>
                ) : (
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 mb-2">
                    <FileText className="w-7 h-7" />
                  </div>
                )}

                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-left text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white truncate max-w-[200px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-slate-400 hover:text-rose-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Gemini
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="text-xs text-slate-400 hover:text-rose-400 underline"
                >
                  Change File
                </button>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2 text-slate-400">
            <span className="font-semibold text-slate-300 block">Recommended Uploads:</span>
            <ul className="space-y-1 list-disc list-inside text-[11px]">
              <li>Customer survey exports & NPS feedback reports</li>
              <li>User research interview transcripts & field notes</li>
              <li>Product competitor feature matrices & brochures</li>
              <li>Screenshots of existing customer checkout funnels</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Question Box & Analysis Action (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 sm:p-7 rounded-3xl glass-panel relative overflow-hidden text-white shadow-2xl">
            <h3 className="text-base font-bold mb-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              <span>Ask Questions or Direct AI Analysis</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Type a custom prompt or choose one of our verified CX audit presets below
            </p>

            {/* Preset prompt chips */}
            <div className="space-y-1.5 mb-4">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Quick Preset Prompts:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setQuestion(q)}
                    className="text-left text-xs px-3 py-1.5 rounded-xl border border-white/[0.1] glass-card-subtle hover:bg-white/[0.08] hover:border-purple-500/50 text-slate-300 hover:text-white transition-all shadow-sm"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Question Textarea */}
            <div className="space-y-2 mb-4">
              <textarea
                rows={4}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about the document: e.g., 'What are the top 3 drop-off reasons mentioned on page 4? How can we fix them?'"
                className="w-full p-3.5 rounded-2xl glass-card-subtle text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 border border-white/[0.1]"
              />
            </div>

            {/* Submit Analyze Button */}
            <button
              type="button"
              disabled={isAnalyzing || !file}
              onClick={handleAnalyze}
              className="w-full py-3.5 rounded-2xl animated-gradient-active hover:brightness-110 text-white font-extrabold text-sm shadow-xl shadow-purple-600/35 border border-white/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing Document with Gemini Multimodal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Analyze with Gemini AI</span>
                </>
              )}
            </button>

            {errorMessage && (
              <div className="mt-3 p-3 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successNotice && (
              <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="p-6 sm:p-8 rounded-3xl glass-panel animate-in fade-in space-y-6 text-white shadow-2xl">
          {/* Header of Results */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  Audit Completed
                </span>
                <h3 className="text-lg font-bold">{analysisResult.fileName}</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Processed at {new Date(analysisResult.uploadedAt).toLocaleTimeString()}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleImportIntoActive}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white flex items-center gap-1.5 shadow-md shadow-purple-600/30 transition-colors"
              >
                <ListPlus className="w-3.5 h-3.5" />
                <span>Merge into Active Journey</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateJourneyDraft}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-md shadow-cyan-600/30 transition-colors"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create New Journey from Document</span>
              </button>
            </div>
          </div>

          {/* Answer to Specific User Question if asked */}
          {analysisResult.answersToUserQuery && (
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-800/40 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Direct Answer to Query:
              </span>
              <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
                {analysisResult.answersToUserQuery}
              </p>
            </div>
          )}

          {/* Executive Summary */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-purple-300">Executive Summary & Key Takeaways</h4>
            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              {analysisResult.documentSummary}
            </p>
          </div>

          {/* Extracted Pain Points & Touchpoints Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pain Points */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Extracted Pain Points ({analysisResult.extractedPainPoints?.length || 0})
                </h4>
              </div>

              <div className="space-y-2">
                {analysisResult.extractedPainPoints?.map((pp, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/30 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{pp.point}</span>
                      <span className="text-[10px] font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-950/60 border border-rose-800/40">
                        {pp.impact}
                      </span>
                    </div>
                    {pp.sourceReference && (
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Ref: {pp.sourceReference} • Stage: {pp.stageHint}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Extracted Touchpoints */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  Touchpoints Identified ({analysisResult.extractedTouchpoints?.length || 0})
                </h4>
              </div>

              <div className="space-y-2">
                {analysisResult.extractedTouchpoints?.map((tp, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-900/30 text-xs space-y-1">
                    <span className="font-semibold text-cyan-300">{tp.channel}</span>
                    <p className="text-[11px] text-slate-300">{tp.frictionObservation}</p>
                    {tp.sourceReference && (
                      <span className="text-[10px] text-slate-500 block font-mono">
                        Ref: {tp.sourceReference}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Verbatim Quotes & Strategic Opportunities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Quotes */}
            {analysisResult.extractedQuotes && analysisResult.extractedQuotes.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-purple-400 uppercase tracking-wider text-[11px]">
                  Verbatim Customer Voice:
                </span>
                <div className="space-y-1.5">
                  {analysisResult.extractedQuotes.map((q, idx) => (
                    <blockquote key={idx} className="italic text-slate-300 pl-3 border-l-2 border-purple-500">
                      “{q}”
                    </blockquote>
                  ))}
                </div>
              </div>
            )}

            {/* Action Items */}
            {analysisResult.suggestedActionItems && analysisResult.suggestedActionItems.length > 0 && (
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
                  Recommended Action Steps:
                </span>
                <div className="space-y-1.5">
                  {analysisResult.suggestedActionItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
