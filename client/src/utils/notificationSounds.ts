// client/src/utils/notificationSounds.ts
export class NotificationSounds {
  private static audioContext: AudioContext | null = null;

  // Create a simple beep sound using Web Audio API
  private static createBeep(frequency: number = 800, duration: number = 200, type: OscillatorType = 'sine'): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
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
  static playSuccess(): void {
    this.createBeep(800, 150, 'sine');
  }

  // Play login sound (medium pitch)
  static playLogin(): void {
    this.createBeep(600, 200, 'triangle');
  }

  // Play creation sound (ascending tones)
  static playCreation(): void {
    setTimeout(() => this.createBeep(500, 100), 0);
    setTimeout(() => this.createBeep(600, 100), 100);
    setTimeout(() => this.createBeep(700, 150), 200);
  }

  // Play error sound (lower pitch, longer)
  static playError(): void {
    this.createBeep(300, 300, 'sawtooth');
  }
}