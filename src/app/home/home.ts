import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  // Estado de las notificaciones
  notificationPermission: string = 'default';
  notificationSupported: boolean = false;

  constructor() {
    // Verificar si el navegador soporta notificaciones
    this.checkNotificationSupport();
  }

  /**
   * Verifica si el navegador soporta la API de Notificaciones
   */
  private checkNotificationSupport(): void {
    if ('Notification' in window) {
      this.notificationSupported = true;
      this.notificationPermission = (window as any).Notification.permission;
    } else {
      console.warn('Este navegador no soporta notificaciones de escritorio');
      this.notificationSupported = false;
    }
  }

  /**
   * Solicita permiso al usuario para mostrar notificaciones
   */
  async requestNotificationPermission(): Promise<void> {
    if (!this.notificationSupported) {
      alert('Tu navegador no soporta notificaciones');
      return;
    }

    try {
      const permission = await (window as any).Notification.requestPermission();
      this.notificationPermission = permission;
      
      if (permission === 'granted') {
        console.log('Permiso de notificaciones concedido');
        this.showSuccessMessage('¡Notificaciones habilitadas!');
      } else if (permission === 'denied') {
        console.log('Permiso de notificaciones denegado');
        alert('Has denegado el permiso para las notificaciones. Puedes cambiarlo en la configuración del navegador.');
      } else {
        console.log('Permiso de notificaciones no decidido');
      }
    } catch (error) {
      console.error('Error al solicitar permiso de notificaciones:', error);
      alert('Ocurrió un error al solicitar permisos de notificación');
    }
  }

  /**
   * Muestra una notificación de prueba
   */
  showTestNotification(): void {
    if (!this.notificationSupported) {
      alert('Tu navegador no soporta notificaciones');
      return;
    }

    if (this.notificationPermission === 'granted') {
      // Crear y mostrar la notificación
      const notificationOptions: any = {
        body: 'Esta es una notificación de prueba desde tu aplicación Angular PWA',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification',
        requireInteraction: false,
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        }
      };
      
      const notification = new (window as any).Notification('¡Notificación de prueba! 🎉', notificationOptions);

      // Manejar eventos de la notificación
      notification.onclick = () => {
        console.log('Notificación clickeada');
        window.focus();
        notification.close();
      };

      notification.onclose = () => {
        console.log('Notificación cerrada');
      };

      notification.onerror = (error: any) => {
        console.error('Error en la notificación:', error);
      };

    } else if (this.notificationPermission === 'denied') {
      alert('Las notificaciones están bloqueadas. Por favor, habilítalas en la configuración del navegador.');
    } else {
      // Si el permiso es 'default', solicitar permiso primero
      alert('Primero debes permitir las notificaciones haciendo clic en el botón "Permitir notificaciones"');
    }
  }

  /**
   * Muestra un mensaje de éxito como notificación
   */
  private showSuccessMessage(message: string): void {
    if (this.notificationPermission === 'granted') {
      new (window as any).Notification('Éxito ✅', {
        body: message,
        icon: '/favicon.ico',
        tag: 'success-notification'
      });
    }
  }

  /**
   * Verifica si las notificaciones están habilitadas
   */
  get notificationsEnabled(): boolean {
    return this.notificationPermission === 'granted';
  }

  /**
   * Verifica si las notificaciones están bloqueadas
   */
  get notificationsBlocked(): boolean {
    return this.notificationPermission === 'denied';
  }
}