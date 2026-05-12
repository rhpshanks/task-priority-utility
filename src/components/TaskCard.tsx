import React from 'react';
import { Task, PriorityClass, Status } from '../types';
import { motion } from 'motion/react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (id: string, status: Status) => void;
  index: number;
}

const priorityConfig: Record<PriorityClass, { badgeBase: string, borderHover: string, textRank: string }> = {
  Critical: { badgeBase: 'bg-red-600 text-white', borderHover: 'hover:border-red-600/50', textRank: 'text-red-400' },
  High: { badgeBase: 'bg-orange-400 text-black', borderHover: 'hover:border-orange-400/50', textRank: 'text-orange-300' },
  Standard: { badgeBase: 'bg-white/20 text-white', borderHover: 'hover:border-white/40', textRank: 'text-white/40' },
  Low: { badgeBase: 'bg-white/5 text-white/50', borderHover: 'hover:border-white/20', textRank: 'text-white/20' },
};

export function TaskCard({ task, onEdit, onStatusChange, index }: TaskCardProps) {
  const pConfig = priorityConfig[task.priority];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 25, delay: index * 0.05 }}
      className={`bg-white/[0.02] border-b border-r border-transparent border-white/10 text-left overflow-hidden group flex flex-col p-6 hover:bg-white/[0.04] transition-colors ${pConfig.borderHover} cursor-pointer`}
      onClick={() => onEdit(task)}
    >
      <div className="flex justify-between items-start mb-4 gap-2">
        <div className="flex items-center gap-3 overflow-hidden">
          <span className={`shrink-0 text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-tighter ${pConfig.badgeBase}`}>
            {task.priority}
          </span>
          <h3 className="text-sm font-medium tracking-wide text-white line-clamp-1">{task.title}</h3>
        </div>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Status)}
          className="shrink-0 text-[10px] bg-transparent border border-white/20 text-white/80 px-2 py-1 uppercase tracking-widest outline-none focus:border-[#f27d26] cursor-pointer hover:bg-white/5 transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="To Do" className="bg-[#050505]">To Do</option>
          <option value="In Progress" className="bg-[#050505]">In Progress</option>
          <option value="Needs Attention" className="bg-[#050505]">Needs Attention</option>
          <option value="Task Comp" className="bg-[#050505]">Task Comp</option>
        </select>
      </div>

      <p className="text-[12px] text-white/50 italic font-serif line-clamp-2 mb-4 flex-1">
        {task.unitTag ? `Area: ${task.unitTag} | ` : ''} {task.summary}
      </p>

      {task.aiSuggestion && (
        <div className="flex justify-between items-center mb-4 text-center mt-auto pt-4 border-t border-white/5">
           <div className="flex flex-col items-start bg-white/[0.01] px-2 py-1 border-l-2 border-white/10">
              <span className="text-[9px] uppercase text-white/30 tracking-tighter mb-0.5">Analysis Suggestion</span>
              <span className={`text-[10px] font-mono ${pConfig.textRank}`}>Rank: {task.aiSuggestion.suggestedPriority}</span>
           </div>
           {task.aiSuggestion.riskAnalysis && (
             <div className="flex flex-col items-start bg-white/[0.01] px-2 py-1 border-l-2 border-amber-500/20" title={task.aiSuggestion.riskAnalysis}>
                <span className="text-[9px] uppercase text-white/30 tracking-tighter mb-0.5 w-full text-left">Risk Note</span>
                <span className="text-[10px] text-amber-500/80 font-mono italic">Delay flagged</span>
             </div>
           )}
           <div className="flex flex-col items-end px-2 py-1">
              <span className="text-[9px] uppercase text-white/30 tracking-tighter mb-0.5">Target Time</span>
              <span className="text-[10px] text-white/60 font-mono italic">{task.timingTarget || '—'}</span>
           </div>
        </div>
      )}

      {!task.aiSuggestion && (
         <div className="flex items-center justify-between mb-4 mt-auto pt-4 border-t border-white/5 text-[10px] uppercase text-white/30 tracking-widest">
            <span>Target Time: <span className="font-mono text-white/60 italic">{task.timingTarget || '—'}</span></span>
            {task.unitTag && <span>Area: {task.unitTag}</span>}
         </div>
      )}

      {task.links && (
        <div className="mt-2 text-right">
          <a 
            href={task.links.startsWith('http') ? task.links : `https://${task.links}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex text-[10px] uppercase tracking-widest text-[#f27d26]/80 hover:text-[#f27d26] transition-colors items-center gap-1"
            onClick={e => e.stopPropagation()}
          >
            <span>Open Link Reference</span>
          </a>
        </div>
      )}
    </motion.div>
  );
}
