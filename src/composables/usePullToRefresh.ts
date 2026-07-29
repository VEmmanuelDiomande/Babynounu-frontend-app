import { onActivated, onDeactivated, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';

const handlers = new Map<string, () => Promise<void>>();

export function getRefreshHandler(name: string): (() => Promise<void>) | undefined {
  return handlers.get(name);
}

export function usePullToRefresh(handler: () => Promise<void>) {
  const route = useRoute();

  const register = () => {
    const name = route.name as string;
    if (name) handlers.set(name, handler);
  };

  const unregister = () => {
    const name = route.name as string;
    if (name) handlers.delete(name);
  };

  onMounted(register);
  onUnmounted(unregister);
  onActivated(register);
  onDeactivated(unregister);
}
