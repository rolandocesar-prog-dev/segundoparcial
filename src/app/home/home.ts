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
      console.log('📢 Notificaciones soportadas. Permiso actual:', this.notificationPermission());
    } else {
      this.notificationSupported.set(false);
      console.warn('❌ Este navegador no soporta notificaciones');
    }
    
    // Forzar detección de cambios después de inicializar
    this.cdr.detectChanges();
  }

  /**
   * Solicita permiso al usuario para mostrar notificaciones
   */
  async requestNotificationPermission(): Promise<void> {
    console.log('🔔 Solicitando permiso para notificaciones...');
    
    // Verificaciones de seguridad
    if (!this.isBrowser) {
      console.error('❌ No estamos en el navegador');
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
      
      console.log('📢 Permiso obtenido:', permission);
      
      // Forzar detección de cambios
      this.cdr.detectChanges();
      
      if (permission === 'granted') {
        console.log('✅ Permisos concedidos, mostrando notificación de éxito');
        // Mostrar notificación de éxito
        this.showSuccessNotification();
      } else if (permission === 'denied') {
        alert('Has denegado el permiso para las notificaciones. Para habilitarlas, debes cambiar la configuración del navegador.');
      }
    } catch (error) {
      console.error('❌ Error al solicitar permiso:', error);
      alert('Error al solicitar permiso de notificaciones');
    }
  }

  /**
   * Muestra una notificación de prueba con mejor debugging
   */
  showTestNotification(): void {
    console.log('🚀 Intentando mostrar notificación de prueba...');
    console.log('📍 Estado actual:', {
      isBrowser: this.isBrowser,
      supported: this.notificationSupported(),
      permission: this.notificationPermission()
    });

    // Verificaciones de seguridad
    if (!this.isBrowser) {
      console.error('❌ No estamos en el navegador');
      return;
    }

    if (!this.notificationSupported()) {
      alert('Tu navegador no soporta notificaciones');
      return;
    }

    if (this.notificationPermission() === 'granted') {
      console.log('✅ Permisos OK, creando notificación...');
      
      try {
        // Método 1: Usar la API Notification directamente
        const NotificationAPI = (window as any).Notification;
        
        // Crear la notificación con opciones mínimas primero
        const notification = new NotificationAPI('🎉 ¡Notificación de Prueba!', {
          body: 'Esta es una notificación de prueba desde tu aplicación Angular PWA',
          tag: 'test-notification-' + Date.now(), // Tag único para evitar duplicados
        });

        console.log('✅ Notificación creada:', notification);

        // Agregar event listeners
        notification.onclick = () => {
          console.log('👆 Click en la notificación');
          window.focus();
          notification.close();
        };

        notification.onshow = () => {
          console.log('👁️ Notificación mostrada');
        };

        notification.onerror = (error: any) => {
          console.error('❌ Error en la notificación:', error);
          alert('Error al mostrar la notificación. Revisa la consola para más detalles.');
        };

        notification.onclose = () => {
          console.log('🔒 Notificación cerrada');
        };
        
        // Método 2: Si el método 1 no funciona, intentar con Service Worker
        // (solo si hay un Service Worker registrado)
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then((registration) => {
            console.log('🔧 Service Worker listo, intentando notificación alternativa...');
            
            registration.showNotification('🎉 ¡Notificación de Prueba (SW)!', {
              body: 'Esta notificación viene del Service Worker',
              icon: '/favicon.ico',
              badge: '/favicon.ico',
              tag: 'sw-test-' + Date.now(),
              requireInteraction: false
            }).then(() => {
              console.log('✅ Notificación del Service Worker mostrada');
            }).catch((swError) => {
              console.error('❌ Error con Service Worker:', swError);
            });
          }).catch((swReadyError) => {
            console.log('⚠️ Service Worker no disponible:', swReadyError);
          });
        }
        
      } catch (error) {
        console.error('❌ Error al crear notificación:', error);
        alert('Error al crear la notificación: ' + error);
        
        // Intentar con un alert como fallback para verificar que el código se ejecuta
        setTimeout(() => {
          alert('Si ves este mensaje, el código se ejecuta pero las notificaciones no funcionan. Verifica:\n\n' +
                '1. Que no tengas el modo "No molestar" activado\n' +
                '2. Que las notificaciones del sistema estén habilitadas\n' +
                '3. Que el navegador no esté minimizado\n' +
                '4. Revisa la consola para más información');
        }, 100);
      }
    } else if (this.notificationPermission() === 'denied') {
      console.warn('⛔ Notificaciones bloqueadas');
      alert('⛔ Las notificaciones están bloqueadas. Por favor, habilítalas en la configuración del navegador.');
    } else {
      console.warn('⚠️ Permisos no otorgados aún');
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
    
    console.log('🎊 Mostrando notificación de éxito...');
    
    try {
      const NotificationAPI = (window as any).Notification;
      const notification = new NotificationAPI('✅ ¡Éxito!', {
        body: '¡Las notificaciones han sido habilitadas correctamente!',
        tag: 'success-' + Date.now()
      });
      
      notification.onshow = () => {
        console.log('✅ Notificación de éxito mostrada');
      };
      
    } catch (error) {
      console.error('❌ Error al mostrar notificación de éxito:', error);
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