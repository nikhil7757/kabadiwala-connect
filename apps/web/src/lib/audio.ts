import { useAppStore } from '../store/useAppStore.js';

type PlaybackListener = (isPlaying: boolean, activeKey?: string) => void;

class AudioService {
  private currentAudio: HTMLAudioElement | null = null;
  private currentKey: string | null = null;
  private listeners: Set<PlaybackListener> = new Set();

  subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(isPlaying: boolean, key?: string) {
    for (const l of this.listeners) {
      l(isPlaying, key);
    }
  }

  isPlaying(key?: string): boolean {
    if (!this.currentAudio && !window.speechSynthesis?.speaking) return false;
    if (!key) return Boolean(this.currentAudio || window.speechSynthesis?.speaking);
    return this.currentKey === key;
  }

  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.currentKey = null;
    this.notify(false);
  }

  /**
   * Plays localized audio file or falls back to Web Speech Synthesis
   */
  async play(key: string, fallbackText?: string): Promise<void> {
    this.stop();

    const lang = useAppStore.getState().language.toLowerCase(); // 'hi', 'mr', 'en'
    const audioPath = `/audio/${lang}/${key}.mp3`;

    this.currentKey = key;
    this.notify(true, key);

    try {
      const audio = new Audio(audioPath);
      this.currentAudio = audio;

      audio.onended = () => {
        this.currentAudio = null;
        this.currentKey = null;
        this.notify(false);
      };

      audio.onerror = () => {
        // Fallback to SpeechSynthesis
        this.playSpeechSynthesis(fallbackText || key, lang);
      };

      await audio.play();
    } catch (err) {
      this.playSpeechSynthesis(fallbackText || key, lang);
    }
  }

  /**
   * Speaks numeric rupee amount
   */
  async speakAmount(amount: number | string): Promise<void> {
    const lang = useAppStore.getState().language;
    const num = Math.round(Number(amount));
    let text = `${num} rupees`;

    if (lang === 'HI') {
      text = `${num} रुपये`;
    } else if (lang === 'MR') {
      text = `${num} रुपये`;
    }

    await this.playSpeechSynthesis(text, lang.toLowerCase());
  }

  private playSpeechSynthesis(text: string, langCode: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.notify(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const speechLang = langCode === 'hi' ? 'hi-IN' : langCode === 'mr' ? 'mr-IN' : 'en-IN';
    utterance.lang = speechLang;
    utterance.rate = 0.95; // Slightly slower for clarity outdoors

    utterance.onend = () => {
      this.currentKey = null;
      this.notify(false);
    };

    utterance.onerror = () => {
      this.currentKey = null;
      this.notify(false);
    };

    window.speechSynthesis.speak(utterance);
  }
}

export const audioService = new AudioService();
