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
  // CLOUDINARY UPLOAD — images & videos
  // Files stored on Cloudinary CDN, URL saved in Firestore
  // Free tier: 25 GB storage, 25 GB bandwidth/month
  // ─────────────────────────────────────────────────────
  private readonly CL_CLOUD_NAME = 'dyobtwmqx';
  private readonly CL_UPLOAD_PRESET = 'sandesh';

  /**
   * Uploads any file (image or video) to Cloudinary via unsigned upload.
   * Reports real-time progress via onProgress (0–100).
   * Returns the permanent Cloudinary CDN URL (secure_url).
   */
  uploadToCloudinary(
    file: File,
    onProgress?: (pct: number) => void
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      // Use 'auto' endpoint to let Cloudinary detect resource type dynamically
      const endpoint = `https://api.cloudinary.com/v1_1/${this.CL_CLOUD_NAME}/auto/upload`;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', this.CL_UPLOAD_PRESET);

      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable && onProgress) {
          const pct = Math.round((event.loaded / event.total) * 100);
          onProgress(pct);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.responseText);
          resolve(res.secure_url);
        } else {
          try {
            const err = JSON.parse(xhr.responseText);
            reject(new Error(err?.error?.message || 'Upload failed'));
          } catch {
            reject(new Error(`Upload failed: ${xhr.status}`));
          }
        }
      };

      xhr.onerror = () => {
        reject(
          new Error(
            'Network fail (CORS block). Please check: ' +
            '1. In Cloudinary Settings -> Upload, edit your upload preset "' + this.CL_UPLOAD_PRESET + '" and ensure "Resource type" is set to "Auto" (not "Image"). ' +
            '2. The file is within Cloudinary size limits (100MB for free videos).'
          )
        );
      };
      xhr.open('POST', endpoint);
      xhr.send(formData);
    });
  }
}

