export interface NavigationItem {
  path: string;
  label: string;
  icon?: string;
}

export const ENTITY_NAVIGATION: NavigationItem[] = [
  { path: "/boxers", label: "Боксеры" },
  { path: "/streams", label: "Стримы" },
  { path: "/matches", label: "Матчи" },
  { path: "/rounds", label: "Раунды" },
  { path: "/venues", label: "Площадки" },
  { path: "/tournaments", label: "Турниры" },
  // CLI_INJECT_NAVIGATION
];
