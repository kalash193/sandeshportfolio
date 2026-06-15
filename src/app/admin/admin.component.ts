import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { PortfolioData, ServiceItem, SoftwareSkill, HobbyItem, EducationItem, SocialLink } from '../services/portfolio-data.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {

  // Auth
  isLoggedIn = false;
  passwordInput = '';
  adminPassword = 'sandesh2026';
  loginError = false;

  // UI State
  activeTab = 'hero';
  saving = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  showToast = false;

  get activeTabLabel(): string {
    const tab = this.tabs.find(t => t.id === this.activeTab);
    return tab ? tab.label : 'Settings';
  }

  get activeTabIcon(): string {
    const tab = this.tabs.find(t => t.id === this.activeTab);
    return tab ? tab.icon : 'fa-solid fa-gear';
  }

  // Data
  data!: PortfolioData;

  // Tabs config
  tabs = [
    { id: 'hero', label: 'Hero', icon: 'fa-solid fa-house' },
    { id: 'about', label: 'About', icon: 'fa-solid fa-user' },
    { id: 'projects', label: 'Projects Video/Reel', icon: 'fa-solid fa-photo-film' },
    { id: 'social', label: 'Social Links', icon: 'fa-solid fa-share-nodes' },
    { id: 'services', label: 'Services', icon: 'fa-solid fa-briefcase' },
    { id: 'skills', label: 'Software Skills', icon: 'fa-solid fa-chart-bar' },
    { id: 'personal', label: 'Personal Skills', icon: 'fa-solid fa-lightbulb' },
    { id: 'gameart', label: 'Game Art Skills', icon: 'fa-solid fa-gamepad' },
    { id: 'hobbies', label: 'Hobbies', icon: 'fa-solid fa-heart' },
    { id: 'education', label: 'Education', icon: 'fa-solid fa-graduation-cap' },
    { id: 'contact', label: 'Contact', icon: 'fa-solid fa-envelope' }
  ];

  // New item temp fields
  newPersonalSkill = '';
  newGameArtSkill = '';

  constructor(private dataService: PortfolioDataService) {}

  async ngOnInit() {
    this.data = JSON.parse(JSON.stringify(await this.dataService.loadData()));
    if (!this.data.projects) {
      this.data.projects = [];
    }
  }

  login() {
    if (this.passwordInput === this.adminPassword) {
      this.isLoggedIn = true;
      this.loginError = false;
    } else {
      this.loginError = true;
    }
  }

  logout() {
    this.isLoggedIn = false;
    this.passwordInput = '';
  }

  setTab(tabId: string) {
    this.activeTab = tabId;
  }

  // Save all data
  async save() {
    this.saving = true;
    const success = await this.dataService.saveData(this.data);
    this.saving = false;

    if (success) {
      this.showNotification('All changes saved successfully!', 'success');
    } else {
      this.showNotification('Failed to save. Check Firebase config.', 'error');
    }
  }

  // Reset to defaults
  async resetAll() {
    if (confirm('Are you sure? This will reset ALL content to the original defaults.')) {
      this.saving = true;
      const success = await this.dataService.resetToDefaults();
      if (success) {
        this.data = JSON.parse(JSON.stringify(this.dataService.getData()));
        this.showNotification('Reset to defaults successfully!', 'success');
      } else {
        this.showNotification('Reset failed. Check Firebase config.', 'error');
      }
      this.saving = false;
    }
  }

  // --- Services CRUD ---
  addService() {
    this.data.services.push({
      id: 'new-' + Date.now(),
      title: 'New Service',
      icon: 'fa-solid fa-star',
      desc: 'Service description here...'
    });
  }

  removeService(index: number) {
    this.data.services.splice(index, 1);
  }

  // --- Projects CRUD ---
  addProject() {
    this.data.projects.push({
      id: 'proj-' + Date.now(),
      title: 'New Video Project',
      desc: 'An immersive 3D/CGI project details...',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      category: 'Environment Design',
      isVertical: false
    });
  }

  removeProject(index: number) {
    this.data.projects.splice(index, 1);
  }

  // --- Software Skills CRUD ---
  addSoftwareSkill() {
    this.data.softwareSkills.push({
      name: 'New Skill',
      level: 50,
      color: '#00f2fe'
    });
  }

  removeSoftwareSkill(index: number) {
    this.data.softwareSkills.splice(index, 1);
  }

  // --- Personal Skills CRUD ---
  addPersonalSkill() {
    if (this.newPersonalSkill.trim()) {
      this.data.personalSkills.push(this.newPersonalSkill.trim());
      this.newPersonalSkill = '';
    }
  }

  removePersonalSkill(index: number) {
    this.data.personalSkills.splice(index, 1);
  }

  // --- Game Art Skills CRUD ---
  addGameArtSkill() {
    if (this.newGameArtSkill.trim()) {
      this.data.gameArtSkills.push(this.newGameArtSkill.trim());
      this.newGameArtSkill = '';
    }
  }

  removeGameArtSkill(index: number) {
    this.data.gameArtSkills.splice(index, 1);
  }

  // --- Hobbies CRUD ---
  addHobby() {
    this.data.hobbies.push({
      name: 'New Hobby',
      icon: 'fa-solid fa-star'
    });
  }

  removeHobby(index: number) {
    this.data.hobbies.splice(index, 1);
  }

  // --- Education CRUD ---
  addEducation() {
    this.data.education.push({
      dateRange: '2024 – Present',
      degree: 'New Degree',
      institute: 'Institute Name'
    });
  }

  removeEducation(index: number) {
    this.data.education.splice(index, 1);
  }

  // Toast notification
  showNotification(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    setTimeout(() => {
      this.showToast = false;
    }, 3500);
  }

  // Track by functions for ngFor
  trackByIndex(index: number): number {
    return index;
  }

  trackByServiceId(index: number, item: ServiceItem): string {
    return item.id;
  }
}
