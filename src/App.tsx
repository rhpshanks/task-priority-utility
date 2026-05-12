import React, { useState, useMemo } from 'react';
import { Task, PriorityClass, Status } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<PriorityClass | 'All'>('All');
  const [filterStatus, setFilterStatus] = useState<Status | 'All'>('All');

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    handleCloseForm();
  };

  const handleUpdateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    setTasks(tasks.map(t => 
      t.id === editingTask.id ? { ...t, ...taskData } : t
    ));
    handleCloseForm();
  };

  const handleStatusChange = (id: string, newStatus: Status) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, status: newStatus } : t
    ));
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(undefined);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => filterPriority === 'All' || t.priority === filterPriority)
      .filter(t => filterStatus === 'All' || t.status === filterStatus)
      .sort((a, b) => {
        const pValues = { Critical: 4, High: 3, Standard: 2, Low: 1 };
        if (pValues[a.priority] !== pValues[b.priority]) {
          return pValues[b.priority] - pValues[a.priority];
        }
        return b.createdAt - a.createdAt;
      });
  }, [tasks, filterPriority, filterStatus]);

  const stats = {
    total: tasks.length,
    critical: tasks.filter(t => t.priority === 'Critical').length,
    needsAttention: tasks.filter(t => t.status === 'Needs Attention').length,
    taskComp: tasks.filter(t => t.status === 'Task Comp').length,
  };

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-[#e0e0e0] flex flex-col">
      <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 sm:px-8 bg-[#0a0a0a] sticky top-0 z-10 w-full">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 rounded-full bg-[#f27d26] shadow-[0_0_8px_#f27d26]"></div>
          <h1 className="font-serif italic text-xl sm:text-2xl tracking-tight text-white m-0">Task Priority Planner</h1>
          <span className="hidden sm:inline text-[10px] uppercase tracking-[0.2em] text-white/40 ml-4 font-mono">Version 4</span>
        </div>

        <div className="flex items-center gap-6 text-[11px] uppercase tracking-widest font-medium">
          <div className="hidden md:flex items-center gap-6 mr-4 border-r border-white/10 pr-6">
            <div className="flex flex-col items-end">
              <span className="text-white/30">Critical Tasks</span>
              <span className="font-bold text-[#f27d26]">{stats.critical} Active</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-white/30">Progress</span>
              <span className="font-bold text-white">{stats.taskComp} Completed</span>
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="h-8 px-4 bg-[#f27d26] text-black font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-colors cursor-pointer flex items-center justify-center"
          >
            <span className="hidden sm:inline">Add New Task</span>
            <span className="sm:hidden">Add Task</span>
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden max-w-[1400px] w-full mx-auto px-4 sm:px-8 py-8">
        
        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border border-white/10 bg-[#080808]">
           <div className="flex items-center gap-4 text-white/50 text-[11px] uppercase tracking-widest">
             <div className="flex items-center gap-2 px-3 py-1.5 border border-transparent hover:border-white/10 transition-colors cursor-pointer group" title="Review planning and set intentions">
                <span className="text-[#f27d26] group-hover:text-white transition-colors">Start Day Routine</span>
             </div>
             <div className="hidden sm:block w-px h-4 bg-white/10"></div>
             <div className="flex items-center gap-2 px-3 py-1.5 border border-transparent hover:border-white/10 transition-colors cursor-pointer group" title="Check progress and adjust">
                <span className="text-[#f27d26] group-hover:text-white transition-colors">Midday Review</span>
             </div>
           </div>
           
           <div className="flex items-center gap-3">
              <select 
                value={filterPriority} 
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="bg-white/5 border border-white/10 text-white/60 rounded-none px-3 py-1.5 outline-none focus:border-[#f27d26] cursor-pointer text-[10px] uppercase tracking-widest"
              >
                <option value="All">Priority: All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Standard">Standard</option>
                <option value="Low">Low</option>
              </select>
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-white/5 border border-white/10 text-white/60 rounded-none px-3 py-1.5 outline-none focus:border-[#f27d26] cursor-pointer text-[10px] uppercase tracking-widest"
              >
                <option value="All">Status: All</option>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Needs Attention">Needs Attention</option>
                <option value="Task Comp">Task Comp</option>
              </select>
           </div>
        </div>

        <section className="flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {isFormOpen && (
              <motion.div 
                 initial={{ opacity: 0, height: 0, scale: 0.98 }}
                 animate={{ opacity: 1, height: 'auto', scale: 1 }}
                 exit={{ opacity: 0, height: 0, scale: 0.98, overflow: 'hidden' }}
                 transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                 className="origin-top"
              >
                <TaskForm 
                  onSubmit={editingTask ? handleUpdateTask : handleCreateTask} 
                  onCancel={handleCloseForm}
                  initialData={editingTask}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {filteredTasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center p-12 bg-[#080808] border border-white/10 border-dashed flex-1 flex flex-col items-center justify-center"
            >
               <h3 className="font-serif italic text-xl text-white mb-2">No task currently</h3>
               <p className="text-[11px] uppercase tracking-widest text-white/40">Your planner is clear.</p>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-0 border-t border-l border-white/10"
            >
              <AnimatePresence mode="popLayout">
                {filteredTasks.map((task, index) => (
                  <TaskCard 
                    key={task.id} 
                    task={task} 
                    onEdit={openEditForm}
                    onStatusChange={handleStatusChange}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>
        
      </main>
    </div>
  );
}
