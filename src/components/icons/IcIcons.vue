<template>
  <i
    class="ri"
    :class="`ri-${iconName}`"
    :style="iconStyle"
    aria-hidden="true"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';

const iconMap: Record<string, string> = {
  'alarm-1': 'notification-3-line',
  'arrow-left': 'arrow-left-line',
  'arrow-right': 'arrow-right-line',
  'ban-2': 'forbid-line',
  'bar-chart-4': 'bar-chart-2-line',
  'bookmark': 'bookmark-line',
  'briefcase-1': 'briefcase-line',
  'calendar-1': 'calendar-line',
  'calendar-days': 'calendar-2-line',
  'check': 'check-line',
  'check-circle-1': 'checkbox-circle-line',
  'checkmark-circle': 'checkbox-circle-line',
  'child': 'emotion-happy-line',
  'clipboard': 'clipboard-line',
  'clock': 'time-line',
  'comment-1': 'chat-3-line',
  'construction-hammer': 'tools-line',
  'credit-card-multiple': 'bank-card-2-line',
  'crown-3': 'vip-crown-line',
  'dashboard-square-1': 'dashboard-line',
  'download-1': 'download-2-line',
  'emoji-smile': 'emoticon-line',
  'envelope-1': 'mail-line',
  'exit': 'logout-box-line',
  'eye': 'eye-line',
  'file': 'file-line',
  'files-1': 'file-list-line',
  'floppy-disk-1': 'save-3-line',
  'funnel-1': 'filter-3-line',
  'gear-1': 'settings-3-line',
  'globe-1': 'global-line',
  'graduation-cap-1': 'graduation-cap-line',
  'hand-shake': 'hand-heart-line',
  'heart': 'heart-line',
  'home-2': 'home-line',
  'image': 'image-line',
  'info-circle': 'information-line',
  'key-1': 'key-2-line',
  'layers-1': 'layers-line',
  'locked-1': 'lock-line',
  'locked-2': 'lock-2-line',
  'map-marker-1': 'map-pin-line',
  'menu-hamburger-1': 'menu-line',
  'money-protection': 'coins-line',
  'money-protection-circle': 'coins-line',
  'moon-half-right-5': 'moon-line',
  'pencil-1': 'pencil-line',
  'phone': 'phone-line',
  'plus': 'add-line',
  'popup': 'popup-line',
  'question-mark-circle': 'question-line',
  'rocket-5': 'rocket-line',
  'search-1': 'search-line',
  'share-1': 'share-line',
  'shield-2': 'shield-line',
  'shield-check': 'shield-check-line',
  'sliders-horizontal-square-2': 'sliders-line',
  'sort-high-to-low': 'sort-desc-line',
  'spin': 'loader-4-line',
  'spinner-2-sacle': 'loader-2-line',
  'spinner-3': 'loader-4-line',
  'star-fat': 'star-fill',
  'stopwatch': 'timer-line',
  'text-paragraph': 'paragraph',
  'timer': 'timer-line',
  'trash-3': 'delete-bin-line',
  'trophy-1': 'trophy-line',
  'user-1': 'user-line',
  'user-4': 'user-3-line',
  'user-multiple-4': 'group-line',
  'wallet-1': 'wallet-line',
  'xmark': 'close-line',
  'xmark-circle': 'close-circle-line',
};

const props = withDefaults(
  defineProps<{
    name: string;
    size?: number | string;
    color?: string;
  }>(),
  {
    size: 20,
    color: 'currentColor',
  }
);

const iconName = computed(() => iconMap[props.name] ?? props.name);

const iconStyle = computed(() => ({
  fontSize: typeof props.size === 'number' ? `${props.size}px` : props.size,
  color: props.color,
}));
</script>
