export const setStorage = (name: string, item: any) => {
  window.localStorage.setItem(name, JSON.stringify(item));
  return;
};
export const getStorage = (name: string) => {
  return JSON.parse(window.localStorage.getItem(name) as string);
};
export const removeStorage = (name: string) => {
  window.localStorage.removeItem(name);
  return;
};

export const formatDate = (dateString: Date) => {
  const date = new Date(dateString);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export const getUsername = (user_id: number) => {
  return +user_id === 25 ? "Mirmux" : "Fozil";
};
