import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Moon, Sun, Menu, X, Heart, Stethoscope, MessageCircle, FileText, CreditCard } from 'lucide-react';
import AIDiagnosisModule from './AIDiagnosisModule';
import HealthRecordWallet from './HealthRecordWallet';
import PatientDoctorChat from './PatientDoctorChat';
import InsuranceClaimTracker from './InsuranceClaimTracker';
import healthcareHero from '@/assets/healthcare-hero.jpg';

interface HealthcareLayoutProps {
  children?: React.ReactNode;
}

const HealthcareLayout: React.FC<HealthcareLayoutProps> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const modules = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: Heart,
      description: 'Overview of your health journey'
    },
    {
      id: 'diagnosis',
      name: 'AI Diagnosis',
      icon: Stethoscope,
      description: 'Smart symptom analysis & medical guidance'
    },
    {
      id: 'records',
      name: 'Health Records',
      icon: FileText,
      description: 'Digital health record wallet'
    },
    {
      id: 'chat',
      name: 'Doctor Chat',
      icon: MessageCircle,
      description: 'Real-time multilingual consultations'
    },
    {
      id: 'insurance',
      name: 'Insurance Claims',
      icon: CreditCard,
      description: 'Track and manage insurance claims'
    }
  ];

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'diagnosis':
        return <AIDiagnosisModule />;
      case 'records':
        return <HealthRecordWallet />;
      case 'chat':
        return <PatientDoctorChat />;
      case 'insurance':
        return <InsuranceClaimTracker />;
      default:
        return (
          <div className="space-y-6">
            {/* Hero Section with Image */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0">
                <img 
                  src={healthcareHero} 
                  alt="Rural healthcare professionals using modern technology"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />
              </div>
              <div className="relative z-10 px-8 py-16 text-center text-white">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  RuralAI Health Assistant
                </h1>
                <p className="text-xl opacity-95 max-w-3xl mx-auto mb-8 leading-relaxed">
                  Comprehensive healthcare platform with AI-powered diagnosis, 
                  digital health records, multilingual consultations, and insurance management
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Badge className="bg-white/20 text-white border-white/30 text-sm py-1 px-3">
                    🌍 4+ Languages Supported
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 text-sm py-1 px-3">
                    🔒 100% Private & Secure
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 text-sm py-1 px-3">
                    📱 Offline Ready
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 text-sm py-1 px-3">
                    🤖 AI-Powered
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {modules.slice(1).map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card 
                    key={module.id}
                    className="healthcare-card cursor-pointer hover:scale-[1.02] transition-all duration-300"
                    onClick={() => setActiveModule(module.id)}
                  >
                    <CardHeader className="text-center">
                      <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg">{module.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm text-center">
                        {module.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <Card className="healthcare-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-muted-foreground">AI Assistant</div>
                </CardContent>
              </Card>
              <Card className="healthcare-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-secondary">4+</div>
                  <div className="text-sm text-muted-foreground">Languages</div>
                </CardContent>
              </Card>
              <Card className="healthcare-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-success">100%</div>
                  <div className="text-sm text-muted-foreground">Private</div>
                </CardContent>
              </Card>
              <Card className="healthcare-card">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-warning">Offline</div>
                  <div className="text-sm text-muted-foreground">Ready</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg text-gradient">RuralAI Health</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors medical-focus ${
                    activeModule === module.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {module.name}
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleDarkMode}
                className="medical-button"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden medical-button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2 animate-slide-down">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => {
                    setActiveModule(module.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors medical-focus ${
                    activeModule === module.id
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {module.name}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {renderActiveModule()}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 RuralAI Health Assistant. Secure, Private, AI-Powered Healthcare.
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            * This is a demo platform. Consult real healthcare professionals for medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HealthcareLayout;