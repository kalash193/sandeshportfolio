import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { PortfolioData, ProjectItem } from '../services/portfolio-data.model';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.css'
})
export class PortfolioComponent implements OnInit {
  data: PortfolioData | null = null;
  isLoading = true;

  isMobileMenuOpen = false;
  activeSection = 'home';

  // Lightbox State
  activeProject: ProjectItem | null = null;
  showLightbox = false;

  // Contact Form Data
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  formSubmitted = false;

  constructor(
    private dataService: PortfolioDataService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.data = await this.dataService.loadData();
    this.isLoading = false;
  }

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
    const sections = ['home', 'about', 'services', 'projects', 'skills', 'resume', 'contact'];
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
    alert('Thank you for your interest! Sandesh Bhadange\'s CV download is starting... (Placeholder: In a live environment, this will trigger the download of CV pdf file.)');
  }

  // --- Lightbox Methods ---
  openLightbox(project: ProjectItem) {
    this.activeProject = project;
    this.showLightbox = true;
    document.body.style.overflow = 'hidden'; // Lock background scroll
  }

  closeLightbox() {
    this.activeProject = null;
    this.showLightbox = false;
    document.body.style.overflow = 'auto'; // Unlock background scroll
  }

  getSafeVideoUrl(url: string): SafeResourceUrl | string {
    if (!url) return '';
    
    // YouTube Embed
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
      } else if (url.includes('v=')) {
        videoId = url.split('v=')[1].split('&')[0].split(/[?#]/)[0];
      } else if (url.includes('embed/')) {
        videoId = url.split('embed/')[1].split(/[?#]/)[0];
      }
      if (videoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
      }
    }
    
    // Vimeo Embed
    if (url.includes('vimeo.com')) {
      let videoId = '';
      const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/posts\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
      if (match) {
        videoId = match[1];
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${videoId}?autoplay=1`);
      }
    }
    
    // Direct link to video files (MP4, etc.)
    return url;
  }

  isEmbedUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  }
}

