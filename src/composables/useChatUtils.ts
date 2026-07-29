import { ref } from 'vue';

export const prestationsTypes = [
  { value: 'garde', label: 'Garde', icon: 'ri-bear-smile-line' },
  { value: 'menagere', label: 'Ménage', icon: 'ri-home-smile-line' },
  { value: 'cuisine', label: 'Cuisine', icon: 'ri-restaurant-line' },
];

export function useChatUtils() {
  const formatMontant = (montant: number) => {
    return new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(montant) + ' FCFA';
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatMsgTime = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  const showDateSeparator = (messages: any[], index: number | string) => {
    const idx = Number(index);
    if (idx === 0) return true;
    if (!messages[idx] || !messages[idx - 1]) return false;
    const current = new Date(messages[idx].createdAt).toDateString();
    const prev = new Date(messages[idx - 1].createdAt).toDateString();
    return current !== prev;
  };

  const getDateSeparatorLabel = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = d.toDateString() === yesterday.toDateString();
    if (isToday) return "Aujourd'hui";
    if (isYesterday) return 'Hier';
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getProposalBadgeClass = (status: string, expired?: boolean) => {
    if (status === 'Pending' && expired) return 'bg-gray-50 text-gray-600';
    switch (status) {
      case 'Accepted': return 'bg-green-50 text-green-700';
      case 'Refused': return 'bg-red-50 text-red-700';
      default: return 'bg-amber-50 text-amber-700';
    }
  };

  const getProposalCardClass = (status: string, expired?: boolean) => {
    if (status === 'Pending' && expired) return 'bg-gray-50 border-gray-200';
    switch (status) {
      case 'Accepted': return 'bg-green-50 border-green-200';
      case 'Refused': return 'bg-red-50 border-red-200';
      default: return 'bg-amber-50 border-amber-200';
    }
  };

  const getProposalDotClass = (status: string, expired?: boolean) => {
    if (status === 'Pending' && expired) return 'bg-gray-400';
    switch (status) {
      case 'Accepted': return 'bg-green-500';
      case 'Refused': return 'bg-red-500';
      default: return 'bg-amber-500';
    }
  };

  const getProposalLabel = (status: string, expired?: boolean) => {
    if (status === 'Pending' && expired) return 'Expirée';
    switch (status) {
      case 'Accepted': return 'Acceptée';
      case 'Refused': return 'Refusée';
      default: return 'En attente';
    }
  };

  const parsePropositionContent = (content: string) => {
    const lines = content.split('\n');
    const result: { objet?: string; type?: string; description?: string; debut?: string; mois?: string } = {};
    const descLines: string[] = [];
    for (const line of lines) {
      if (line.startsWith('Objet: ')) result.objet = line.replace('Objet: ', '').trim();
      else if (line.startsWith('Type: ')) result.type = line.replace('Type: ', '').trim();
      else if (line.startsWith('Début: ')) result.debut = line.replace('Début: ', '').trim();
      else if (line.startsWith('Mois: ')) result.mois = line.replace('Mois: ', '').trim();
      else if (line.trim()) descLines.push(line.trim());
    }
    result.description = descLines.join('\n');
    return result;
  };

  const getFileIcon = (type?: string) => {
    if (!type) return 'ri ri-file-3-line';
    if (type.startsWith('image/')) return 'ri ri-image-line';
    if (type.startsWith('audio/')) return 'ri ri-mic-line';
    if (type.startsWith('video/')) return 'ri ri-video-line';
    if (type.includes('pdf')) return 'ri ri-file-pdf-line';
    if (type.includes('word') || type.includes('document')) return 'ri ri-file-word-line';
    if (type.includes('sheet') || type.includes('excel')) return 'ri ri-file-excel-line';
    if (type.includes('zip') || type.includes('compressed')) return 'ri ri-file-zip-line';
    return 'ri ri-file-3-line';
  };

  const formatSeconds = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  const formatRecordingTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const waveformCache = ref<Record<number, number[]>>({});
  const getWaveformBars = (msgId: number) => {
    if (!waveformCache.value[msgId]) {
      const bars: number[] = [];
      let seed = msgId * 9301 + 49297;
      for (let i = 0; i < 28; i++) {
        seed = (seed * 9301 + 49297) % 233280;
        bars.push(20 + (seed / 233280) * 80);
      }
      waveformCache.value[msgId] = bars;
    }
    return waveformCache.value[msgId];
  };

  return {
    prestationsTypes,
    formatMontant,
    formatDate,
    formatMsgTime,
    showDateSeparator,
    getDateSeparatorLabel,
    getProposalBadgeClass,
    getProposalCardClass,
    getProposalDotClass,
    getProposalLabel,
    parsePropositionContent,
    getFileIcon,
    formatSeconds,
    formatRecordingTime,
    formatFileSize,
    getWaveformBars,
  };
}
