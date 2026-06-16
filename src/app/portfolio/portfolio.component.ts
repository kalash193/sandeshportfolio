import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { PortfolioData, ProjectItem } from '../services/portfolio-data.model';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CONTACT_CONFIG } from '../emailjs.config';

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

  // Contact Form
  contactForm = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  formSubmitted = false;
  formSending  = false;
  formError    = false;
  formErrorMessage = '';

  constructor(
    private dataService: PortfolioDataService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit() {
    this.data = await this.dataService.loadData();
    this.isLoading = false;
  }

  toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }
  closeMobileMenu()  { this.isMobileMenuOpen = false; }

  scrollTo(sectionId: string) {
    this.closeMobileMenu();
    this.activeSection = sectionId;
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const sections = ['home', 'about', 'services', 'projects', 'skills', 'resume', 'contact'];
    const pos = window.pageYOffset + 200;
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el && pos >= el.offsetTop && pos < el.offsetTop + el.offsetHeight) {
        this.activeSection = id;
        break;
      }
    }
  }

  // ── Contact Form ──────────────────────────────────────────────────────────
  async submitContactForm() {
    if (!this.contactForm.name || !this.contactForm.email || !this.contactForm.message) return;

    this.formSending      = true;
    this.formError        = false;
    this.formErrorMessage = '';

    // Check if key has been configured yet
    if (CONTACT_CONFIG.accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY') {
      this.formSending      = false;
      this.formError        = true;
      this.formErrorMessage = 'Email not configured yet. Visit web3forms.com, enter adsanmediasandesh@gmail.com and paste the key in emailjs.config.ts.';
      setTimeout(() => { this.formError = false; }, 10000);
      return;
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key:    CONTACT_CONFIG.accessKey,
          name:          this.contactForm.name,
          email:         this.contactForm.email,
          subject:       this.contactForm.subject || 'New portfolio message from ' + this.contactForm.name,
          message:       this.contactForm.message,
          // tells web3forms where to deliver the email
          to:            CONTACT_CONFIG.toEmail,
          // reply-to so you can reply directly to the sender
          replyto:       this.contactForm.email,
          // bot check
          botcheck:      '',
        })
      });

      const result = await response.json();

      if (result.success) {
        this.formSending   = false;
        this.formSubmitted = true;
        // Reset after 6 s
        setTimeout(() => {
          this.contactForm   = { name: '', email: '', subject: '', message: '' };
          this.formSubmitted = false;
        }, 6000);
      } else {
        throw new Error(result.message || 'Unknown error');
      }

    } catch (err: any) {
      this.formSending      = false;
      this.formError        = true;
      this.formErrorMessage = 'Could not send message. Please email directly at ' + CONTACT_CONFIG.toEmail;
      setTimeout(() => { this.formError = false; }, 8000);
      console.error('Web3Forms error:', err);
    }
  }

  downloadCV() {
    alert("Thank you for your interest! Sandesh Bhadange's CV download is starting... (Placeholder: In a live environment, this will trigger the download of CV pdf file.)");
  }

  // --- Lightbox ---
  openLightbox(project: ProjectItem) {
    this.activeProject = project;
    this.showLightbox  = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.activeProject = null;
    this.showLightbox  = false;
    document.body.style.overflow = 'auto';
  }

  getSafeVideoUrl(url: string): SafeResourceUrl | string {
    if (!url) return '';

    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      let id = '';
      if (url.includes('youtu.be/'))  id = url.split('youtu.be/')[1].split(/[?#]/)[0];
      else if (url.includes('v='))    id = url.split('v=')[1].split('&')[0].split(/[?#]/)[0];
      else if (url.includes('embed/')) id = url.split('embed/')[1].split(/[?#]/)[0];
      if (id) return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`
      );
    }

    if (url.includes('vimeo.com')) {
      const m = url.match(/vimeo\.com\/(?:.*\/)?(\d+)/);
      if (m) return this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://player.vimeo.com/video/${m[1]}?autoplay=1`
      );
    }

    return url;
  }

  isEmbedUrl(url: string): boolean {
    if (!url) return false;
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  }
}
