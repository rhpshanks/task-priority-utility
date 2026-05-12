import React, { useState } from 'react';
import { Task, PriorityClass, Status } from '../types';
import { analyzeTask } from '../services/ai';
import { motion } from 'motion/react';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  initialData?: Task;
}

export function TaskForm({ onSubmit, onCancel, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [unitTag, setUnitTag] = useState(initialData?.unitTag || '');
  const [timingTarget, setTimingTarget] = useState(initialData?.timingTarget || '');
  const [priority, setPriority] = useState<PriorityClass>(initialData?.priority || 'Standard');
  const [status, setStatus] = useState<Status>(initialData?.status || 'To Do');
  const [links, setLinks] = useState(initialData?.links || '');
  const [aiSuggestion, setAiSuggestion] = useState(initialData?.aiSuggestion);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const handleAiAnalyze = async () => {
    if (!title || !summary) {
      setError('Title and Summary are required for AI analysis.');
      return;
    }
    setError('');
    setIsAnalyzing(true);
    try {
      const result = await analyzeTask(title, summary, timingTarget, unitTag);
      setAiSuggestion(result);
      // Optional: automatically set the priority to AI suggestion
      // setPriority(result.suggestedPriority);
    } catch (err) {
      console.error(err);
      setError('AI analysis failed. Please check if GEMINI_API_KEY is configured.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Task title is required.');
      return;
    }
    onSubmit({
      title,
      summary,
      unitTag,
      timingTarget,
      priority,
      status,
      links,
      aiSuggestion,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0a0a] border border-white/10 overflow-hidden mb-8"
    >
      <div className="bg-[#080808] px-6 py-4 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-xl font-serif text-white">
          {initialData ? 'Edit Task' : 'Add New Task'}
        </h2>
        <span className="text-[10px] text-white/40 uppercase tracking-widest">Task Entry</span>
      </div>

      <div className="p-6 md:flex gap-8">
        <form onSubmit={handleSubmit} className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Task Title <span className="text-[#f27d26]">(Required)</span></label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Write descriptive task"
                className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#f27d26] placeholder:text-white/20 transition-colors rounded-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Task Summary <span className="text-[#f27d26]">(Required)</span></label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Short, direct, and valid description of the activity..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#f27d26] placeholder:text-white/20 transition-colors rounded-none resize-none"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Area</label>
              <input
                type="text"
                value={unitTag}
                onChange={(e) => setUnitTag(e.target.value)}
                placeholder="e.g. Design, Dev, QA"
                className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#f27d26] placeholder:text-white/20 transition-colors rounded-none"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Target Time</label>
              <input
                type="text"
                value={timingTarget}
                onChange={(e) => setTimingTarget(e.target.value)}
                placeholder="e.g. EOD, Tomorrow 12PM"
                className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#f27d26] placeholder:text-white/20 transition-colors rounded-none"
              />
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityClass)}
                className="w-full bg-white/5 border border-white/10 px-4 py-2 text-[11px] uppercase tracking-wider text-white focus:outline-none focus:border-[#f27d26] rounded-none cursor-pointer"
              >
                <option value="Critical" className="bg-[#050505]">Critical</option>
                <option value="High" className="bg-[#050505]">High</option>
                <option value="Standard" className="bg-[#050505]">Standard</option>
                <option value="Low" className="bg-[#050505]">Low</option>
              </select>
            </div>

            <div>
              <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="w-full bg-white/5 border border-white/10 px-4 py-2 text-[11px] uppercase tracking-wider text-white focus:outline-none focus:border-[#f27d26] rounded-none cursor-pointer"
              >
                <option value="To Do" className="bg-[#050505]">To Do</option>
                <option value="In Progress" className="bg-[#050505]">In Progress</option>
                <option value="Needs Attention" className="bg-[#050505]">Needs Attention</option>
                <option value="Task Comp" className="bg-[#050505]">Task Comp</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-[9px] uppercase tracking-widest text-white/40 block mb-1">Reference Link</label>
              <input
                type="text"
                value={links}
                onChange={(e) => setLinks(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-[#f27d26] placeholder:text-white/20 transition-colors rounded-none"
              />
            </div>
          </div>

          {error && <p className="text-[#f27d26] text-sm mt-2">{error}</p>}

          <div className="flex justify-end gap-4 pt-6 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-[10px] uppercase tracking-widest text-white/60 hover:text-white border border-transparent transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAiAnalyze}
              disabled={isAnalyzing}
              className="flex items-center gap-2 px-6 py-2 bg-white/5 text-[#f27d26] border border-white/10 hover:border-[#f27d26]/50 hover:bg-white/10 transition-colors disabled:opacity-50 text-[10px] uppercase tracking-widest cursor-pointer"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
            </button>
            <button
              type="submit"
              className="px-8 py-2 bg-[#f27d26] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
            >
              Save Task
            </button>
          </div>
        </form>

        {/* AI Suggestion Panel */}
        {aiSuggestion && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full md:w-80 mt-6 md:mt-0 bg-[#080808] border border-white/10 p-5 flex flex-col space-y-6"
          >
            <div className="flex items-center gap-2 text-[#f27d26] border-b border-white/10 pb-3">
              <h3 className="font-serif italic text-sm tracking-wide">Analysis Suggestion</h3>
            </div>
            
            <div>
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Suggested Priority</span>
              <div className="mt-2 flex items-center justify-between bg-white/[0.02] px-3 py-2 border border-white/5">
                <span className="font-mono text-xs text-white/90">Rank: {aiSuggestion.suggestedPriority}</span>
                <button
                  type="button"
                  onClick={() => setPriority(aiSuggestion.suggestedPriority)}
                  className="text-[9px] uppercase tracking-widest text-[#f27d26] hover:text-white transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
            </div>

            <div>
              <span className="text-[9px] text-white/40 uppercase tracking-widest flex items-center gap-1">
                Delay Risk Note
              </span>
              <div className="mt-2 text-xs text-white/70 bg-white/[0.02] p-3 border border-white/5 leading-relaxed italic border-l-2 border-l-[#f27d26]">
                {aiSuggestion.riskAnalysis}
              </div>
            </div>

            <div>
              <span className="text-[9px] text-white/40 uppercase tracking-widest">Clarity Feedback</span>
              <p className="mt-2 text-xs text-white/70 bg-white/[0.02] p-3 border border-white/5 leading-relaxed">
                {aiSuggestion.clarityFeedback}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
