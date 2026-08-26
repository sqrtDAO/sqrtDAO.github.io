export const formatToastCopy = (template: string, params?: Record<string, string | number>) =>
  params ? template.replace(/\{(\w+)\}/g, (match, key) => (key in params ? String(params[key]) : match)) : template;
