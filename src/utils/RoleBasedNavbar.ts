// navConfig.ts
export const navConfig = {
  customer: {
    pages: ["Home", "Categories", "Menus", "Restaurants"],
    routes: {
      Home: "/home",
      Categories: "/categories",
      Menus: "/menus",
      Restaurants: "/restaurants",
      Cart: "/cart"
    },
    settings: ["Profile", "Logout"],
    showCart: true,
  },
  admin: {
    pages: ["Dashboard","Profile"],
    routes: {
      Dashboard: "/admin",
      Profile: "/profile"
    },
    settings: ["Admin", "Profile", "Logout"],
    showCart: false,
  },
  delivery: {
    pages: ["Dashboard","Profile"],
    routes: {
      Dashboard: "/delivery",
      Profile: "/profile"
    },
    settings: ["Profile", "My Orders", "Logout"],
    showCart: false,
  },
};