import React, { useState } from 'react';
import BOQListPage from './BOQListPage';
import BOQDetailPage from './BOQDetailPage';

export default function BOQPage() {
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [projectId, setProjectId] = useState<string>('');

  const handleSelectProject = (id: string) => {
    setProjectId(id);
    setView('DETAIL');
  };

  if (view === 'DETAIL' && projectId) {
    return (
      <BOQDetailPage 
        projectId={projectId} 
        onBack={() => setView('LIST')} 
      />
    );
  }

  return (
    <BOQListPage onSelectProject={handleSelectProject} />
  );
}
