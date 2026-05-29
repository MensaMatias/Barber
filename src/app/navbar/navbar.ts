import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  private readonly router = inject(Router);
  openMenu: 'contact' | 'account' | null = null;
  mobileOpen = false;

  toggleMenu(menu: 'contact' | 'account'): void {
    this.openMenu = this.openMenu === menu ? null : menu;
  }

  toggleMobile(event: MouseEvent): void {
    event.stopPropagation();
    this.mobileOpen = !this.mobileOpen;
    if (this.mobileOpen) this.openMenu = null;
  }

  closeMenus(): void {
    this.openMenu = null;
  }

  isActive(path: string): boolean {
    const url = this.router.url.split('?')[0].split('#')[0];
    if (path === '/') return url === '/';
    return url.startsWith(path);
  }

  onMenuAreaClick(event: MouseEvent): void {
    event.stopPropagation();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeMenus();
    this.mobileOpen = false;
  }
}
