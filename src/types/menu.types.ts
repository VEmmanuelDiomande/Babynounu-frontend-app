export type TabProfile = 'parent' | 'nounu' | 'admin';
export type TabBadgeType = 'notification' | 'message';

export interface TabItem {
  id: string;
  icon: string;
  iconActive: string;
  label: string;
  route: string;
  profile: TabProfile;
  visible: boolean;
  badge?: TabBadgeType;
}

export type TabList = TabItem[];

export type SIDEBAR_MENU = {
  name: string;
  icon: string;
  link: string;
  actived: boolean;
}[];

export type SEARCH_VERTICAL_MENU = {
  name: string;
  link: string;
  actived: boolean;
}[];