import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'sandeshportfolio';
  isMobileMenuOpen = false;
  activeSection = 'home';

  // Contact Form Data
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  formSubmitted = false;

  // What Can I Do Section Data
  services = [
    {
      id: 'env-design',
      title: 'Environment Design',
      icon: 'fa-solid fa-mountain-sun',
      desc: 'Creating immersive game environments with strong composition, storytelling, and visual appeal.'
    },
    {
      id: 'prop-model',
      title: '3D Prop Modeling',
      icon: 'fa-solid fa-cube',
      desc: 'Building game-ready props with clean topology, optimized geometry, and efficient UV layouts.'
    },
    {
      id: 'char-model',
      title: 'Character Modeling',
      icon: 'fa-solid fa-user-astronaut',
      desc: 'Creating detailed character models for games, cinematics, and real-time applications.'
    },
    {
      id: 'dig-sculpt',
      title: 'Digital Sculpting',
      icon: 'fa-solid fa-paint-brush',
      desc: 'Sculpting high-resolution characters, creatures, and assets with attention to anatomy and form.'
    },
    {
      id: 'mat-texture',
      title: 'Material & Texturing',
      icon: 'fa-solid fa-palette',
      desc: 'Developing realistic and stylized PBR materials using industry-standard workflows.'
    },
    {
      id: 'unreal',
      title: 'Unreal Engine',
      icon: 'fa-solid fa-gamepad',
      desc: 'Assembling environments, lighting scenes, and creating polished presentations in Unreal Engine.'
    },
    {
      id: 'optimize',
      title: 'Optimization',
      icon: 'fa-solid fa-gauge-high',
      desc: 'Ensuring assets and environments maintain strong visual quality while meeting performance targets.'
    }
  ];

  // Software Skills with Proficiency
  softwareSkills = [
    { name: 'Maya', level: 95, color: '#00f2fe' },
    { name: 'Blender', level: 90, color: '#4facfe' },
    { name: 'Substance Painter', level: 95, color: '#a18cd1' },
    { name: 'Zbrush', level: 80, color: '#f857a6' },
    { name: 'Unreal Engine', level: 75, color: '#ff5858' },
    { name: 'Photoshop', level: 90, color: '#00c6ff' },
    { name: 'Premiere Pro', level: 85, color: '#f39c12' }
  ];

  // Technical & Soft Skills
  personalSkills = [
    'Creative Problem Solving',
    'Attention to Detail',
    'Time Management',
    'Team Collaboration',
    'Adaptability',
    'Fast Learner',
    'Communication Skills',
    'Project Planning'
  ];

  gameArtSkills = [
    'Environment Design',
    'Asset Optimization',
    'Reference Gathering',
    'Technical Problem Solving',
    'Workflow Organization'
  ];

  // Hobbies
  hobbies = [
    { name: 'Sketching & Concept Drawing', icon: 'fa-solid fa-pen-nib' },
    { name: 'Multiplayer & Competitive Gaming', icon: 'fa-solid fa-headset' },
    { name: 'Sports & Outdoor Activities', icon: 'fa-solid fa-person-running' },
    { name: 'Exploring Game Environments', icon: 'fa-solid fa-compass' },
    { name: 'Learning New Art Techniques', icon: 'fa-solid fa-graduation-cap' }
  ];

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  scrollTo(sectionId: string) {
    this.closeMobileMenu();
    this.activeSection = sectionId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Monitor scrolling to highlight active nav link
  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = ['home', 'about', 'services', 'skills', 'resume', 'contact'];
    const scrollPosition = window.pageYOffset + 200; // Offset for header height

    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const top = element.offsetTop;
        const height = element.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          this.activeSection = section;
          break;
        }
      }
    }
  }

  submitContactForm() {
    if (this.contactForm.name && this.contactForm.email && this.contactForm.message) {
      console.log('Contact form submitted:', this.contactForm);
      this.formSubmitted = true;
      
      // Reset form after a delay
      setTimeout(() => {
        this.contactForm = { name: '', email: '', subject: '', message: '' };
        this.formSubmitted = false;
      }, 5000);
    }
  }

  downloadCV() {
    // Generate a placeholder alert for CV download since no physical file is present
    alert('Thank you for your interest! Sandesh Bhadange\'s CV download is starting... (Placeholder: In a live environment, this will trigger the download of CV pdf file.)');
  }
}
