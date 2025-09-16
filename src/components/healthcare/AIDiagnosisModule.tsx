import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Mic, MicOff, Stethoscope, Activity, AlertCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

// Mock diagnosis data - In real app, this would come from AI/ML API
const MOCK_DIAGNOSES = [
  {
    condition: 'Common Cold',
    confidence: 85,
    severity: 'Low',
    description: 'Viral upper respiratory tract infection',
    recommendations: [
      'Rest and hydration',
      'Over-the-counter pain relievers',
      'Warm salt water gargle',
      'Monitor symptoms for 7-10 days'
    ],
    referralNeeded: false
  },
  {
    condition: 'Hypertension',
    confidence: 78,
    severity: 'Medium',
    description: 'Elevated blood pressure requiring monitoring',
    recommendations: [
      'Regular blood pressure monitoring',
      'Dietary modifications (low sodium)',
      'Regular exercise',
      'Stress management',
      'Follow-up in 2 weeks'
    ],
    referralNeeded: true,
    specialistType: 'Cardiologist'
  },
  {
    condition: 'Acute Gastritis',
    confidence: 72,
    severity: 'Medium',
    description: 'Inflammation of stomach lining',
    recommendations: [
      'Avoid spicy and acidic foods',
      'Eat small, frequent meals',
      'Antacids for symptom relief',
      'Avoid NSAIDs',
      'Follow-up if symptoms persist >3 days'
    ],
    referralNeeded: false
  }
];

const DRUG_INTERACTIONS = [
  {
    drug1: 'Aspirin',
    drug2: 'Warfarin',
    severity: 'High',
    description: 'Increased bleeding risk'
  },
  {
    drug1: 'Paracetamol',
    drug2: 'Alcohol',
    severity: 'Medium',
    description: 'Increased liver toxicity risk'
  }
];

const AIDiagnosisModule: React.FC = () => {
  const [language, setLanguage] = useState('en');
  const [symptoms, setSymptoms] = useState('');
  const [vitals, setVitals] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    weight: '',
    height: ''
  });
  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [age, setAge] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<typeof MOCK_DIAGNOSES | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // Language translations
  const translations = {
    en: {
      title: 'AI Medical Diagnosis Assistant',
      symptoms: 'Describe your symptoms',
      vitals: 'Vital Signs',
      temperature: 'Temperature (°F)',
      bloodPressure: 'Blood Pressure',
      heartRate: 'Heart Rate (bpm)',
      weight: 'Weight (kg)',
      height: 'Height (cm)',
      age: 'Age',
      medicalHistory: 'Medical History',
      currentMeds: 'Current Medications',
      analyze: 'Analyze Symptoms',
      recording: 'Recording...',
      voiceInput: 'Voice Input',
      language: 'Language'
    },
    hi: {
      title: 'एआई चिकित्सा निदान सहायक',
      symptoms: 'अपने लक्षणों का वर्णन करें',
      vitals: 'महत्वपूर्ण संकेत',
      temperature: 'तापमान (°F)',
      bloodPressure: 'रक्तचाप',
      heartRate: 'हृदय गति (bpm)',
      weight: 'वजन (kg)',
      height: 'ऊंचाई (cm)',
      age: 'आयु',
      medicalHistory: 'चिकित्सा इतिहास',
      currentMeds: 'वर्तमान दवाएं',
      analyze: 'लक्षणों का विश्लेषण करें',
      recording: 'रिकॉर्डिंग...',
      voiceInput: 'आवाज इनपुट',
      language: 'भाषा'
    },
    ta: {
      title: 'AI மருத்துவ நோய் கண்டறிதல் உதவியாளர்',
      symptoms: 'உங்கள் அறிகுறிகளை விவரிக்கவும்',
      vitals: 'முக்கிய அறிகுறிகள்',
      temperature: 'வெப்பநிலை (°F)',
      bloodPressure: 'இரத்த அழுத்தம்',
      heartRate: 'இதய துடிப்பு (bpm)',
      weight: 'எடை (kg)',
      height: 'உயரம் (cm)',
      age: 'வயது',
      medicalHistory: 'மருத்துவ வரலாறு',
      currentMeds: 'தற்போதைய மருந்துகள்',
      analyze: 'அறிகுறிகளை பகுப்பாய்வு செய்யுங்கள்',
      recording: 'பதிவு...',
      voiceInput: 'குரல் உள்ளீடு',
      language: 'மொழி'
    },
    te: {
      title: 'AI వైద్య నిర్ధారణ సహాయకుడు',
      symptoms: 'మీ లక్షణాలను వివరించండి',
      vitals: 'ముఖ్య సంకేతాలు',
      temperature: 'ఉష్ణోగ్రత (°F)',
      bloodPressure: 'రక్తపోటు',
      heartRate: 'హృదయ స్పందన (bpm)',
      weight: 'బరువు (kg)',
      height: 'ఎత్తు (cm)',
      age: 'వయస్సు',
      medicalHistory: 'వైద్య చరిత్ర',
      currentMeds: 'ప్రస్తుత మందులు',
      analyze: 'లక్షణాలను విశ్లేషించండి',
      recording: 'రికార్డింగ్...',
      voiceInput: 'వాయిస్ ఇన్‌పుట్',
      language: 'భాష'
    },
    bn: {
      title: 'এআই চিকিৎসা নির্ণয় সহায়ক',
      symptoms: 'আপনার লক্ষণগুলি বর্ণনা করুন',
      vitals: 'গুরুত্বপূর্ণ লক্ষণ',
      temperature: 'তাপমাত্রা (°F)',
      bloodPressure: 'রক্তচাপ',
      heartRate: 'হৃদস্পন্দন (bpm)',
      weight: 'ওজন (kg)',
      height: 'উচ্চতা (cm)',
      age: 'বয়স',
      medicalHistory: 'চিকিৎসা ইতিহাস',
      currentMeds: 'বর্তমান ওষুধ',
      analyze: 'লক্ষণ বিশ্লেষণ করুন',
      recording: 'রেকর্ডিং...',
      voiceInput: 'ভয়েস ইনপুট',
      language: 'ভাষা'
    }
  };

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatusChange);
    window.addEventListener('offline', handleOnlineStatusChange);

    return () => {
      window.removeEventListener('online', handleOnlineStatusChange);
      window.removeEventListener('offline', handleOnlineStatusChange);
    };
  }, []);

  const handleVitalChange = (field: string, value: string) => {
    setVitals(prev => ({ ...prev, [field]: value }));
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      // Start recording
      setIsRecording(true);
      toast.success('Voice recording started');
      
      // Mock voice recognition - In real app, use Web Speech API
      setTimeout(() => {
        setIsRecording(false);
        setSymptoms(prev => prev + ' fever headache body aches');
        toast.success('Voice input processed');
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info('Recording stopped');
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast.error('Please describe your symptoms');
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock AI response - In real app, this would be an API call
    setDiagnosis(MOCK_DIAGNOSES);
    setIsAnalyzing(false);
    
    toast.success('Analysis complete');
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-success text-success-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const checkDrugInteractions = () => {
    if (!currentMedications.trim()) return [];
    
    // Simple mock interaction check
    const medications = currentMedications.toLowerCase().split(',').map(m => m.trim());
    return DRUG_INTERACTIONS.filter(interaction => 
      medications.some(med => 
        med.includes(interaction.drug1.toLowerCase()) || 
        med.includes(interaction.drug2.toLowerCase())
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{t.title}</h2>
            {isOffline && (
              <div className="flex items-center space-x-2 text-warning">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">Offline Mode - Basic functionality available</span>
              </div>
            )}
          </div>
        </div>
        
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">हिंदी</SelectItem>
            <SelectItem value="ta">தமிழ்</SelectItem>
            <SelectItem value="te">తెలుగు</SelectItem>
            <SelectItem value="bn">বাংলা</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Symptoms */}
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {t.symptoms}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleVoiceRecording}
                  className={`medical-button ${isRecording ? 'bg-destructive text-destructive-foreground' : ''}`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? t.recording : t.voiceInput}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms in detail..."
                className="medical-focus"
                rows={4}
              />
            </CardContent>
          </Card>

          {/* Vitals */}
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>{t.vitals}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder={t.temperature}
                  value={vitals.temperature}
                  onChange={(e) => handleVitalChange('temperature', e.target.value)}
                />
                <Input
                  placeholder={t.bloodPressure}
                  value={vitals.bloodPressure}
                  onChange={(e) => handleVitalChange('bloodPressure', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder={t.heartRate}
                  value={vitals.heartRate}
                  onChange={(e) => handleVitalChange('heartRate', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder={t.age}
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
                <Input
                  type="number"
                  placeholder={t.weight}
                  value={vitals.weight}
                  onChange={(e) => handleVitalChange('weight', e.target.value)}
                />
                <Input
                  type="number"
                  placeholder={t.height}
                  value={vitals.height}
                  onChange={(e) => handleVitalChange('height', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical History */}
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle>{t.medicalHistory}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={medicalHistory}
                onChange={(e) => setMedicalHistory(e.target.value)}
                placeholder="Previous conditions, surgeries, allergies..."
                rows={3}
              />
              <Textarea
                value={currentMedications}
                onChange={(e) => setCurrentMedications(e.target.value)}
                placeholder={t.currentMeds}
                rows={2}
              />
            </CardContent>
          </Card>

          <Button
            onClick={analyzeSymptoms}
            disabled={isAnalyzing}
            className="w-full medical-button bg-gradient-primary hover:bg-gradient-primary/80"
          >
            {isAnalyzing ? 'Analyzing...' : t.analyze}
          </Button>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {diagnosis && (
            <>
              {/* Diagnosis Results */}
              <Card className="healthcare-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span>Diagnosis Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {diagnosis.map((dx, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{dx.condition}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getSeverityColor(dx.severity)}>
                            {dx.severity}
                          </Badge>
                          <Badge variant="outline">
                            {dx.confidence}% confidence
                          </Badge>
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">{dx.description}</p>
                      
                      <div>
                        <h5 className="font-medium mb-2">Recommendations:</h5>
                        <ul className="text-sm space-y-1">
                          {dx.recommendations.map((rec, i) => (
                            <li key={i} className="flex items-start space-x-2">
                              <CheckCircle className="w-3 h-3 text-success mt-1 flex-shrink-0" />
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {dx.referralNeeded && (
                        <div className="flex items-center space-x-2 p-2 bg-warning/10 rounded">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="text-sm">
                            Specialist referral recommended: {dx.specialistType}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Drug Interactions */}
              {checkDrugInteractions().length > 0 && (
                <Card className="healthcare-card border-warning">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-warning">
                      <AlertTriangle className="w-5 h-5" />
                      <span>Drug Interaction Alerts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {checkDrugInteractions().map((interaction, index) => (
                      <div key={index} className="p-3 bg-warning/10 rounded mb-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">
                            {interaction.drug1} + {interaction.drug2}
                          </span>
                          <Badge className={
                            interaction.severity === 'High' 
                              ? 'bg-destructive text-destructive-foreground'
                              : 'bg-warning text-warning-foreground'
                          }>
                            {interaction.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{interaction.description}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Helpful Information */}
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Info className="w-5 h-5 text-primary" />
                <span>Health Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Always consult healthcare professionals for serious symptoms</li>
                <li>• This AI assistant provides guidance, not definitive diagnosis</li>
                <li>• Keep track of symptoms and vital signs regularly</li>
                <li>• Seek immediate help for emergency symptoms</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AIDiagnosisModule;