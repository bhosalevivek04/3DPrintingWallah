export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

export interface FooterNav {
  shop: NavItem[];
  services: NavItem[];
  company: NavItem[];
}

export interface NavigationConfig {
  mainNav: NavItem[];
  footerNav: FooterNav;
}
