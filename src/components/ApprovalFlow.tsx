import { Check, X, Clock } from 'lucide-react';
import { Button } from './Button.tsx';
import { Badge } from './Badge.tsx';

interface ApprovalStep {
  role: string;
  user?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HOLD';
  date?: string;
}

interface ApprovalFlowProps {
  steps: ApprovalStep[];
  currentRole: string;
  onAction: (action: 'APPROVE' | 'REJECT' | 'HOLD') => void;
}

export const ApprovalFlow = ({ steps, currentRole, onAction }: ApprovalFlowProps) => {
  const canAct = steps.find(s => s.role === currentRole && s.status === 'PENDING');

  return (
    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">Approval Workflow</h4>
      <div className="space-y-6 relative">
        <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200" />
        
        {steps.map((step, idx) => (
          <div key={idx} className="relative pl-10">
            <div className={`absolute left-0 top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${
              step.status === 'APPROVED' ? 'bg-emerald-500 border-emerald-500 text-white' :
              step.status === 'REJECTED' ? 'bg-red-500 border-red-500 text-white' :
              step.status === 'HOLD' ? 'bg-amber-500 border-amber-500 text-white' :
              'bg-white border-slate-300 text-slate-400'
            }`}>
              {step.status === 'APPROVED' ? <Check className="h-4 w-4" /> :
               step.status === 'REJECTED' ? <X className="h-4 w-4" /> :
               step.status === 'HOLD' ? <Clock className="h-4 w-4" /> :
               <span className="text-xs font-bold">{idx + 1}</span>}
            </div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-slate-900">{step.role}</p>
                <p className="text-xs text-slate-500">{step.user || 'Waiting for assignment'}</p>
              </div>
              <div className="text-right">
                <Badge variant={
                  step.status === 'APPROVED' ? 'success' :
                  step.status === 'REJECTED' ? 'danger' :
                  step.status === 'HOLD' ? 'warning' : 'default'
                }>
                  {step.status}
                </Badge>
                {step.date && <p className="text-[10px] text-slate-400 mt-1">{step.date}</p>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {canAct && (
        <div className="mt-8 flex flex-wrap gap-3 pt-6 border-t border-slate-200">
          <Button variant="success" onClick={() => onAction('APPROVE')}>
            <Check className="h-4 w-4 mr-2" /> Approve
          </Button>
          <Button variant="danger" onClick={() => onAction('REJECT')}>
            <X className="h-4 w-4 mr-2" /> Reject
          </Button>
          <Button variant="warning" onClick={() => onAction('HOLD')}>
            <Clock className="h-4 w-4 mr-2" /> Hold
          </Button>
        </div>
      )}
    </div>
  );
};
