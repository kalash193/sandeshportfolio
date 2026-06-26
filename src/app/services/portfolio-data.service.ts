import { Injectable, Injector, runInInjectionContext } from '@angular/core';
import { Firestore, doc, getDoc, setDoc, DocumentReference } from '@angular/fire/firestore';
import { PortfolioData } from './portfolio-data.model';

const LOCAL_STORAGE_KEY = 'sandesh_portfolio_data';

@Injectable({
  providedIn: 'root'
})
export class PortfolioDataService {

  private data: PortfolioData = this.getDefaults();
  private loaded = false;
  private docRef: DocumentReference;
  private firebaseAvailable = true;

  constructor(
    private firestore: Firestore,
    private injector: Injector
  ) {
    // Create document reference inside the injection context (constructor)
    try {
      this.docRef = doc(this.firestore, 'portfolio', 'main');
    } catch (e) {
      console.warn('Firebase document reference creation failed:', e);
      this.firebaseAvailable = false;
      this.docRef = null as any;
    }
  }

  getDefaults(): PortfolioData {
    return {
      hero: {
        firstName: 'SANDESH',
        lastName: 'BHADANGE',
        subtitle: '3D Artist & Animator'
      },
      about: {
        bio: 'I am a dedicated 3D Artist and Animator with strong skills in environment design, character modeling, texturing, lighting, and cinematic rendering. I work primarily with Autodesk Maya, Substance Painter, Blender and Zbrush, with Unreal Engine (in progress). With a passion for dark, cinematic, and realistic visuals, I aim to create high-quality assets and environments suitable for games, films, and advertisements. I\'m continuously learning advanced workflows and enjoy working in creative, fast-paced production environments.',
        email: 'adsanmediasandesh@gmail.com',
        phone: '+91 9420964210',
        availability: 'Open to projects',
        languages: 'Hindi, English'
      },
      socialLinks: [
        { platform: 'Instagram', url: 'https://www.instagram.com/adsan.media/', icon: 'fa-brands fa-instagram', enabled: true },
        { platform: 'LinkedIn', url: 'https://www.linkedin.com', icon: 'fa-brands fa-linkedin-in', enabled: true },
        { platform: 'Artstation', url: '', icon: 'fa-brands fa-artstation', enabled: false },
        { platform: 'Pinterest', url: 'https://pin.it/1OZXmZkZi', icon: 'fa-brands fa-pinterest-p', enabled: true }
      ],
      services: [
        { id: 'env-design', title: 'Environment Design', icon: 'fa-solid fa-mountain-sun', desc: 'Creating immersive game environments with strong composition, storytelling, and visual appeal.' },
        { id: 'prop-model', title: '3D Prop Modeling', icon: 'fa-solid fa-cube', desc: 'Building game-ready props with clean topology, optimized geometry, and efficient UV layouts.' },
        { id: 'char-model', title: 'Character Modeling', icon: 'fa-solid fa-user-astronaut', desc: 'Creating detailed character models for games, cinematics, and real-time applications.' },
        { id: 'dig-sculpt', title: 'Digital Sculpting', icon: 'fa-solid fa-paint-brush', desc: 'Sculpting high-resolution characters, creatures, and assets with attention to anatomy and form.' },
        { id: 'mat-texture', title: 'Material & Texturing', icon: 'fa-solid fa-palette', desc: 'Developing realistic and stylized PBR materials using industry-standard workflows.' },
        { id: 'unreal', title: 'Unreal Engine', icon: 'fa-solid fa-gamepad', desc: 'Assembling environments, lighting scenes, and creating polished presentations in Unreal Engine.' },
        { id: 'optimize', title: 'Optimization', icon: 'fa-solid fa-gauge-high', desc: 'Ensuring assets and environments maintain strong visual quality while meeting performance targets.' }
      ],
      softwareSkills: [
        { name: 'Maya', level: 95, color: '#00f2fe' },
        { name: 'Blender', level: 90, color: '#4facfe' },
        { name: 'Substance Painter', level: 95, color: '#a18cd1' },
        { name: 'Zbrush', level: 80, color: '#f857a6' },
        { name: 'Unreal Engine', level: 75, color: '#ff5858' },
        { name: 'Photoshop', level: 90, color: '#00c6ff' },
        { name: 'Premiere Pro', level: 85, color: '#f39c12' }
      ],
      personalSkills: [
        'Creative Problem Solving', 'Attention to Detail', 'Time Management',
        'Team Collaboration', 'Adaptability', 'Fast Learner',
        'Communication Skills', 'Project Planning'
      ],
      gameArtSkills: [
        'Environment Design', 'Asset Optimization', 'Reference Gathering',
        'Technical Problem Solving', 'Workflow Organization'
      ],
      hobbies: [
        { name: 'Sketching & Concept Drawing', icon: 'fa-solid fa-pen-nib' },
        { name: 'Multiplayer & Competitive Gaming', icon: 'fa-solid fa-headset' },
        { name: 'Sports & Outdoor Activities', icon: 'fa-solid fa-person-running' },
        { name: 'Exploring Game Environments', icon: 'fa-solid fa-compass' },
        { name: 'Learning New Art Techniques', icon: 'fa-solid fa-graduation-cap' }
      ],
      education: [
        { dateRange: '2023 – 2026 (Present)', degree: 'Diploma : ADVFX+ Course', institute: 'Maac Institute' }
      ],
      contact: {
        email: 'adsanmediasandesh@gmail.com',
        phone: '+91 9420964210',
        location: 'Maharashtra, India',
        collaborationText: 'Have a project in mind or want to work together? Feel free to reach out. I\'m always open to discussing new opportunities, environment design projects, or asset modeling requests.'
      },
      projects: [
        {
          id: 'proj-1',
          title: 'Lost Temple Ruins',
          desc: 'An immersive 3D environment featuring ancient ruins reclamation by nature. Fully optimized geometry, high-fidelity lightmapping, and custom shaders created for Unreal Engine.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4e26631d4?auto=format&fit=crop&w=800&q=80',
          category: 'Environment Design',
          isVertical: false
        },
        {
          id: 'proj-2',
          title: 'Cyberpunk Alleyway Reel',
          desc: 'A vertical reel showcase of a rain-slicked cyberpunk alleyway environment. Designed for high visual impact on mobile platforms, featuring volumetric fog, neon lighting, and dynamic camera movements.',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
          category: 'CGI & Animation',
          isVertical: true
        }
      ]
    };
  }

  // --- localStorage helpers ---
  private saveToLocalStorage(data: PortfolioData): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }

  private loadFromLocalStorage(): PortfolioData | null {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        return JSON.parse(raw) as PortfolioData;
      }
    } catch (e) {
      console.warn('localStorage read failed:', e);
    }
    return null;
  }

  async loadData(): Promise<PortfolioData> {
    if (this.loaded) return this.data;

    // 1. Try Firebase first (inside injection context)
    if (this.firebaseAvailable && this.docRef) {
      try {
        const docSnap = await runInInjectionContext(this.injector, () =>
          getDoc(this.docRef)
        );
        if (docSnap.exists()) {
          this.data = docSnap.data() as PortfolioData;
          // Also cache to localStorage as backup
          this.saveToLocalStorage(this.data);
          this.loaded = true;
          return this.data;
        }
      } catch (error) {
        console.warn('Firebase read failed, falling back to local storage:', error);
      }
    }

    // 2. Try localStorage as fallback
    const localData = this.loadFromLocalStorage();
    if (localData) {
      console.log('Loaded data from localStorage (offline mode)');
      this.data = localData;
      this.loaded = true;
      return this.data;
    }

    // 3. Use hardcoded defaults as final fallback
    console.log('Using default data');
    this.loaded = true;
    return this.data;
  }

  getData(): PortfolioData {
    return this.data;
  }

  async saveData(data: PortfolioData): Promise<boolean> {
    const cleanData = JSON.parse(JSON.stringify(data));

    // Always save to localStorage first (instant, reliable)
    this.saveToLocalStorage(cleanData);
    this.data = cleanData;

    // Then try Firebase
    if (this.firebaseAvailable && this.docRef) {
      try {
        await runInInjectionContext(this.injector, () =>
          setDoc(this.docRef, cleanData)
        );
        return true;
      } catch (error) {
        console.warn('Firebase write failed. Data saved to localStorage only:', error);
        // Return true anyway — data IS saved (locally)
        return true;
      }
    }

    // Firebase not available, but localStorage save succeeded
    return true;
  }

  async resetToDefaults(): Promise<boolean> {
    const defaults = this.getDefaults();
    return this.saveData(defaults);
  }

  // ─────────────────────────────────────────────────────
  // IMAGE: Compress & encode to Base64 (stored in Firestore)
  // ─────────────────────────────────────────────────────
  /**
   * Reads an image File, resizes it to maxWidth/maxHeight using Canvas,
   * and returns a base64 data-URL (JPEG, quality 0.82).
   * This is small enough to store directly in a Firestore field.
   */
  compressImage(
    file: File,
    maxWidth = 1280,
    maxHeight = 960,
    quality = 0.82,
    onProgress?: (pct: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      if (onProgress) onProgress(10);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (onProgress) onProgress(40);
        const img = new Image();
        img.onload = () => {
          if (onProgress) onProgress(60);
          let w = img.width;
          let h = img.height;
          if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
          if (h > maxHeight) { w = Math.round(w * maxHeight / h); h = maxHeight; }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d')!;
          ctx.drawImage(img, 0, 0, w, h);
          if (onProgress) onProgress(85);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          if (onProgress) onProgress(100);
          resolve(dataUrl);
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // ─────────────────────────────────────────────────────
  // VIDEO: Store in browser IndexedDB (device-local)
  // Returns a blob:// URL usable in <video> tags
  // ─────────────────────────────────────────────────────
  private readonly IDB_NAME = 'portfolio_videos';
  private readonly IDB_STORE = 'videos';
  private readonly IDB_VERSION = 1;

  private openIDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.IDB_NAME, this.IDB_VERSION);
      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.IDB_STORE)) {
          db.createObjectStore(this.IDB_STORE);
        }
      };
      req.onsuccess = (e) => resolve((e.target as IDBOpenDBRequest).result);
      req.onerror = (e) => reject((e.target as IDBOpenDBRequest).error);
    });
  }

  /**
   * Stores a video File in IndexedDB under a unique key.
   * Returns a blob:// URL that can be used in <video src>.
   * NOTE: This URL is valid only for the current browser session
   * on this device. The stored blob persists in IndexedDB across sessions.
   */
  async storeVideoLocally(
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<string> {
    if (onProgress) onProgress(10);
    const db = await this.openIDB();
    if (onProgress) onProgress(30);
    const key = `video_${Date.now()}_${file.name}`;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.IDB_STORE, 'readwrite');
      const store = tx.objectStore(this.IDB_STORE);
      const req = store.put(file, key);
      req.onsuccess = () => {
        if (onProgress) onProgress(90);
        const blobUrl = URL.createObjectURL(file);
        // Also persist the key so we can reload the blob URL on next session
        try {
          const keys: string[] = JSON.parse(localStorage.getItem('portfolio_video_keys') || '[]');
          keys.push(key);
          localStorage.setItem('portfolio_video_keys', JSON.stringify(keys));
        } catch {}
        if (onProgress) onProgress(100);
        resolve(blobUrl);
      };
      req.onerror = (e) => reject((e.target as IDBRequest).error);
    });
  }

  /**
   * Loads a video blob from IndexedDB by its key and returns a fresh blob URL.
   * Call this on app startup to restore video previews.
   */
  async loadVideoFromIDB(key: string): Promise<string | null> {
    try {
      const db = await this.openIDB();
      return new Promise((resolve) => {
        const tx = db.transaction(this.IDB_STORE, 'readonly');
        const store = tx.objectStore(this.IDB_STORE);
        const req = store.get(key);
        req.onsuccess = (e) => {
          const blob = (e.target as IDBRequest).result;
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return null;
    }
  }
}
