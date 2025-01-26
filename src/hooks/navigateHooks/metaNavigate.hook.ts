import { META } from "@/types/navigation.type";

const doc:any = document

export const changeMetaTags = (meta: META) => {
    document.title = `${meta.title}`;
    
    doc?.querySelector('meta[name="og:title"]')
       .setAttribute('content', meta['og:title']);
    
       doc?.querySelector('meta[name="description"]')
       .setAttribute('content', meta.description);
    
       doc?.querySelector('meta[name="og:description"]')
       .setAttribute('content', meta['og:description']);
    
       doc?.querySelector('meta[name="keywords"]')
       .setAttribute('content', meta.keywords);
  };