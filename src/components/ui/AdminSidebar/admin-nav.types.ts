export interface NavItem {
  name: string;
  label: string;
  route: string;
  icon: string;
  badge?: boolean;
  badgeType?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}
