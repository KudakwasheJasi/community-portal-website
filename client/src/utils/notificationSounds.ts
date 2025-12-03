// client/src/utils/notificationSounds.ts
export class NotificationSounds {
  private static audioContext: AudioContext | null = null;
  private static notificationAudio: HTMLAudioElement | null = null;

  // Initialize the notification audio
  private static initNotificationAudio(): void {
    if (!this.notificationAudio) {
      this.notificationAudio = new Audio('/mixkit-happy-bells-notification-937.wav');
      this.notificationAudio.volume = 0.5; // Set volume to 50%
      this.notificationAudio.preload = 'auto'; // Preload the audio
    }
  }

  // Play the notification sound
  private static playNotificationSound(): Promise<void> {
    return new Promise((resolve) => {
      try {
        this.initNotificationAudio();
        if (this.notificationAudio) {
          this.notificationAudio.currentTime = 0; // Reset to start
          this.notificationAudio.volume = 1.0; // Full volume
          this.notificationAudio.play().then(() => {
            // Wait for the sound to end
            this.notificationAudio!.addEventListener('ended', () => {
              resolve();
            }, { once: true });
          }).catch(error => {
            console.warn('Failed to play notification sound:', error);
            this.fallbackBeep();
            resolve(); // Resolve even on error
          });
        } else {
          this.fallbackBeep();
          resolve();
        }
      } catch (error) {
        console.warn('Audio playback not supported, using fallback');
        this.fallbackBeep();
        resolve();
      }
    });
  }

  // Create a simple beep sound using Web Audio API (fallback)
  private static createBeep(frequency: number = 800, duration: number = 200, type: OscillatorType = 'sine'): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }

      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Web Audio API not supported, using fallback');
      this.fallbackBeep();
    }
  }

  // Fallback beep for browsers that don't support Web Audio API
  private static fallbackBeep(): void {
    // Create a simple beep using the console (for development)
    console.log('🔔 Notification sound played');
  }

  // Play success sound (higher pitch, pleasant)
  static async playSuccess(): Promise<void> {
    await this.playNotificationSound();
  }

  // Play login sound (medium pitch)
  static async playLogin(): Promise<void> {
    await this.playNotificationSound();
  }

  // Play creation sound (ascending tones)
  static async playCreation(): Promise<void> {
    await this.playNotificationSound();
  }

  // Play error sound (lower pitch, longer)
  static async playError(): Promise<void> {
    await this.playNotificationSound();
  }
}