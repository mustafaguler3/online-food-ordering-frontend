class AuthHelper {
  static isDeliveryPerson() {
    return this.hadRole("DELIVERY");
  }

  static saveToken(token: string) {
    localStorage.setItem("token", token);
  }

  static getToken(): string | null {
    return localStorage.getItem("token");
  }

  static saveRole(roles: string[]) {
    localStorage.setItem("roles", JSON.stringify(roles));
  }

  static getRoles(): string[] | null {
    const roles = localStorage.getItem("roles");
    return roles ? JSON.parse(roles) : null;
  }

  static hadRole(role: string): boolean {
    const roles = this.getRoles();
    return roles ? roles.includes(role) : false;
  }

  static isAdmin(): boolean {
    return this.hadRole("ADMIN");
  }

  static isCustomer(): boolean {
    return this.hadRole("CUSTOMER");
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
  }

  static isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export { AuthHelper };
