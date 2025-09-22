import { Component, Inject, PLATFORM_ID, afterNextRender, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // Usar signals para mejor reactividad con zoneless change detection
  notificationPermission = signal<string>('default');
  notificationSupported = signal<boolean>(false);
  private isBrowser: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef
  ) {
    // Verificar si estamos en el navegador
    this.isBrowser = isPlatformBrowser(this.platformId);
    
    // Usar afterNextRender para código del navegador en Angular 20
    if (this.isBrowser) {
      afterNextRender(() => {
        this.initializeNotifications();
      });
    }
  }

  /**
   * Inicializa el soporte de notificaciones
   */
  private initializeNotifications(): void {
    if (!this.isBrowser) {
      return;
    }
    
    // Verificar soporte de notificaciones
    if ('Notification' in window) {
      this.notificationSupported.set(true);
      // Usar window.Notification para evitar problemas de tipos
      this.notificationPermission.set((window as any).Notification.permission);
    } else {
      this.notificationSupported.set(false);
    }
    
    // Forzar detección de cambios después de inicializar
    this.cdr.detectChanges();
  }

  /**
   * Solicita permiso al usuario para mostrar notificaciones
   */
  async requestNotificationPermission(): Promise<void> {
    // Verificaciones de seguridad
    if (!this.isBrowser) {
      return;
    }

    if (!this.notificationSupported()) {
      alert('Tu navegador no soporta notificaciones de escritorio');
      return;
    }

    try {
      // Usar window.Notification para evitar problemas de tipos
      const NotificationAPI = (window as any).Notification;
      const permission = await NotificationAPI.requestPermission();
      this.notificationPermission.set(permission);
      
      // Forzar detección de cambios
      this.cdr.detectChanges();
      
      if (permission === 'granted') {
        // Mostrar notificación de éxito
        this.showSuccessNotification();
      } else if (permission === 'denied') {
        alert('Has denegado el permiso para las notificaciones. Para habilitarlas, debes cambiar la configuración del navegador.');
      }
    } catch (error) {
      console.error('Error al solicitar permiso:', error);
      alert('Error al solicitar permiso de notificaciones');
    }
  }

  /**
   * Muestra una notificación de prueba
   */
  showTestNotification(): void {
    // Verificaciones de seguridad
    if (!this.isBrowser) {
      return;
    }

    if (!this.notificationSupported()) {
      alert('Tu navegador no soporta notificaciones');
      return;
    }

    if (this.notificationPermission() === 'granted') {
      try {
        // Usar window.Notification y opciones básicas sin vibrate
        const NotificationAPI = (window as any).Notification;
        const notification = new NotificationAPI('🎉 ¡Notificación de Prueba!', {
          body: 'Esta es una notificación de prueba desde tu aplicación Angular PWA',
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: 'test-notification',
          requireInteraction: false
        });

        // Eventos de la notificación
        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        notification.onerror = (error: any) => {
          console.error('Error en la notificación:', error);
        };
        
      } catch (error) {
        console.error('Error al crear notificación:', error);
        alert('Error al crear la notificación');
      }
      
    } else if (this.notificationPermission() === 'denied') {
      alert('⛔ Las notificaciones están bloqueadas. Por favor, habilítalas en la configuración del navegador.');
    } else {
      alert('⚠️ Primero debes permitir las notificaciones haciendo clic en el botón "Permitir notificaciones"');
    }
  }

  /**
   * Muestra una notificación de éxito
   */
  private showSuccessNotification(): void {
    if (!this.isBrowser || this.notificationPermission() !== 'granted') {
      return;
    }
    
    try {
      const NotificationAPI = (window as any).Notification;
      new NotificationAPI('✅ ¡Éxito!', {
        body: '¡Las notificaciones han sido habilitadas correctamente!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'success-notification'
      });
    } catch (error) {
      console.error('Error al mostrar notificación de éxito:', error);
    }
  }

  /**
   * Verifica si las notificaciones están habilitadas
   */
  get notificationsEnabled(): boolean {
    return this.notificationPermission() === 'granted';
  }

  /**
   * Verifica si las notificaciones están bloqueadas
   */
  get notificationsBlocked(): boolean {
    return this.notificationPermission() === 'denied';
  }
}