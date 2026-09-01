export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
}

export const ENTITY_NAVIGATION: NavigationItem[] = [
  { path: "/boxers", label: "Боксеры" },
  { path: "/streams", label: "Стримы" },
  { path: "/matches", label: "Матчи" },

];
