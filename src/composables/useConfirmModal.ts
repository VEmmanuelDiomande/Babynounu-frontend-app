import { ref } from 'vue';

export function useConfirmModal() {
  const showConfirm = ref(false);
  const confirmTitle = ref('Confirmation');
  const confirmMessage = ref('');
  const confirmIcon = ref('shield-line');
  const confirmIconBg = ref('bg-orange-50');
  const confirmIconClass = ref('text-orange-500');
  const confirmLabel = ref('Confirmer');
  const confirmBgClass = ref('bg-orange-500 hover:bg-orange-600 shadow-orange-200');

  let pendingAction: (() => Promise<void> | void) | null = null;

  const requestConfirm = (
    message: string,
    action: () => Promise<void> | void,
    options?: {
      title?: string;
      icon?: string;
      iconBgClass?: string;
      iconClass?: string;
      confirmLabel?: string;
      confirmBgClass?: string;
    }
  ) => {
    confirmMessage.value = message;
    pendingAction = action;
    if (options?.title) confirmTitle.value = options.title;
    else confirmTitle.value = 'Confirmation';
    if (options?.icon) confirmIcon.value = options.icon;
    else confirmIcon.value = 'shield-line';
    if (options?.iconBgClass) confirmIconBg.value = options.iconBgClass;
    else confirmIconBg.value = 'bg-orange-50';
    if (options?.iconClass) confirmIconClass.value = options.iconClass;
    else confirmIconClass.value = 'text-orange-500';
    if (options?.confirmLabel) confirmLabel.value = options.confirmLabel;
    else confirmLabel.value = 'Confirmer';
    if (options?.confirmBgClass) confirmBgClass.value = options.confirmBgClass;
    else confirmBgClass.value = 'bg-orange-500 hover:bg-orange-600 shadow-orange-200';
    showConfirm.value = true;
  };

  const onConfirm = async () => {
    showConfirm.value = false;
    if (pendingAction) {
      await pendingAction();
      pendingAction = null;
    }
  };

  const onCancel = () => {
    showConfirm.value = false;
    pendingAction = null;
  };

  return {
    showConfirm,
    confirmTitle,
    confirmMessage,
    confirmIcon,
    confirmIconBg,
    confirmIconClass,
    confirmLabel,
    confirmBgClass,
    requestConfirm,
    onConfirm,
    onCancel,
  };
}
