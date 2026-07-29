import { META } from "@/types/navigation.type";

export const changeMetaTags = (meta: META) => {
    document.title = `${meta.title}`;
    
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };

    setMeta('meta[name="og:title"]', meta['og:title']);
    setMeta('meta[name="description"]', meta.description);
    setMeta('meta[name="og:description"]', meta['og:description']);
    setMeta('meta[name="keywords"]', meta.keywords);
  };