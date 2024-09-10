export const setStorage = (name: string, item: any) => {
    window.localStorage.setItem(name, JSON.stringify(item));
    return;
} 
export const getStorage = (name: string) => {
  return JSON.parse(window.localStorage.getItem(name) as string)
} 