import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  MicOff, 
  Phone, 
  Video, 
  Languages, 
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  User,
  Bot
} from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  sender: 'patient' | 'doctor' | 'ai' | 'system';
  message: string;
  originalMessage?: string; // For translated messages
  language: string;
  timestamp: Date;
  isTranslated?: boolean;
  messageType: 'text' | 'voice' | 'image' | 'file' | 'consultation-summary';
  status: 'sent' | 'delivered' | 'read';
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  isOnline: boolean;
  lastSeen?: Date;
  languages: string[];
}

// Mock data
const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'General Medicine',
    isOnline: true,
    languages: ['en', 'hi', 'ta']
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
    languages: ['en', 'te', 'hi']
  },
  {
    id: '3',
    name: 'Dr. Anita Singh',
    specialty: 'Pediatrician',
    isOnline: true,
    languages: ['en', 'bn', 'hi']
  }
];

const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    sender: 'system',
    message: 'Consultation started with Dr. Priya Sharma',
    language: 'en',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    messageType: 'text',
    status: 'read'
  },
  {
    id: '2',
    sender: 'doctor',
    message: 'Hello! I am Dr. Priya. How can I help you today?',
    originalMessage: 'नमस्ते! मैं डॉ. प्रिया हूं। आज मैं आपकी कैसे मदद कर सकती हूं?',
    language: 'en',
    timestamp: new Date(Date.now() - 55 * 60 * 1000),
    isTranslated: true,
    messageType: 'text',
    status: 'read'
  },
  {
    id: '3',
    sender: 'patient',
    message: 'I have been having headaches for the past 3 days',
    language: 'en',
    timestamp: new Date(Date.now() - 50 * 60 * 1000),
    messageType: 'text',
    status: 'read'
  },
  {
    id: '4',
    sender: 'doctor',
    message: 'I understand. Can you describe the headache? Is it a throbbing pain or a dull ache? When does it usually occur?',
    language: 'en',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    messageType: 'text',
    status: 'read'
  },
  {
    id: '5',
    sender: 'ai',
    message: 'Based on the symptoms discussed, here are some initial observations and recommendations...',
    language: 'en',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    messageType: 'consultation-summary',
    status: 'delivered'
  }
];

const PatientDoctorChat: React.FC = () => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(MOCK_DOCTORS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [patientLanguage, setPatientLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [autoTranslate, setAutoTranslate] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const translateMessage = async (message: string, targetLanguage: string): Promise<string> => {
    // Mock translation - In real app, use Google Translate API or similar
    const translations: { [key: string]: { [key: string]: string } } = {
      'Hello! I am Dr. Priya. How can I help you today?': {
        'hi': 'नमस्ते! मैं डॉ. प्रिया हूं। आज मैं आपकी कैसे मदद कर सकती हूं?',
        'ta': 'வணக்கம்! நான் டாக்டர் பிரியா. இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
        'te': 'హలో! నేను డాక్టర్ ప్రియా. ఈరోజు మీకు ఎలా సహాయం చేయగలను?',
        'bn': 'হ্যালো! আমি ডাঃ প্রিয়া। আজ আমি আপনাকে কীভাবে সাহায্য করতে পারি?'
      }
    };

    return translations[message]?.[targetLanguage] || message;
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: 'patient',
      message: newMessage,
      language: patientLanguage,
      timestamp: new Date(),
      messageType: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate doctor response
    setTimeout(async () => {
      const doctorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'doctor',
        message: 'Thank you for sharing that information. Let me ask a few more questions to better understand your condition.',
        language: 'en',
        timestamp: new Date(),
        messageType: 'text',
        status: 'sent'
      };

      // Auto-translate if needed
      if (autoTranslate && patientLanguage !== 'en') {
        doctorResponse.originalMessage = doctorResponse.message;
        doctorResponse.message = await translateMessage(doctorResponse.message, patientLanguage);
        doctorResponse.isTranslated = true;
        doctorResponse.language = patientLanguage;
      }

      setMessages(prev => [...prev, doctorResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const toggleVoiceRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      toast.success('Voice recording started');
      
      // Mock voice recognition
      setTimeout(() => {
        setIsRecording(false);
        setNewMessage('I have been feeling dizzy and nauseous since morning');
        toast.success('Voice message converted to text');
      }, 3000);
    } else {
      setIsRecording(false);
      toast.info('Recording stopped');
    }
  };

  const startVideoCall = () => {
    toast.info('Video call feature would be integrated here');
  };

  const generateConsultationSummary = () => {
    const summary = `
**Consultation Summary**

**Patient Concerns:**
- Headaches for 3 days
- Dizziness and nausea since morning

**Doctor's Assessment:**
- Symptoms suggest possible tension headache or dehydration
- No immediate red flags observed

**Recommendations:**
1. Increase fluid intake
2. Monitor symptoms for next 24 hours
3. Take paracetamol if pain persists
4. Return if symptoms worsen or new symptoms appear

**Next Steps:**
- Follow-up appointment in 1 week if not improved
- Emergency consultation if severe symptoms develop

**Prescribed Medications:**
- Paracetamol 500mg (as needed for pain)

*This summary has been automatically generated and reviewed by Dr. Priya Sharma*
    `;

    const summaryMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'ai',
      message: summary,
      language: patientLanguage,
      timestamp: new Date(),
      messageType: 'consultation-summary',
      status: 'sent'
    };

    setMessages(prev => [...prev, summaryMessage]);
    toast.success('Consultation summary generated');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="w-3 h-3 text-muted-foreground" />;
      case 'delivered': return <CheckCircle2 className="w-3 h-3 text-primary" />;
      case 'read': return <CheckCircle2 className="w-3 h-3 text-success" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Patient-Doctor Chat</h2>
            <p className="text-muted-foreground">Real-time multilingual consultations</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={patientLanguage} onValueChange={setPatientLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center space-x-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant={autoTranslate ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoTranslate(!autoTranslate)}
            className="medical-button"
          >
            <Languages className="w-4 h-4 mr-2" />
            Auto Translate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Doctor List */}
        <div className="lg:col-span-1">
          <Card className="healthcare-card">
            <CardHeader>
              <CardTitle className="text-lg">Available Doctors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_DOCTORS.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedDoctor.id === doctor.id
                      ? 'bg-primary/10 border border-primary'
                      : 'hover:bg-muted'
                  }`}
                  onClick={() => setSelectedDoctor(doctor)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={doctor.avatar} />
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        doctor.isOnline ? 'bg-success' : 'bg-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{doctor.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{doctor.specialty}</div>
                      {!doctor.isOnline && doctor.lastSeen && (
                        <div className="text-xs text-muted-foreground">
                          Last seen {formatTime(doctor.lastSeen)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doctor.languages.map((langCode) => {
                      const lang = languages.find(l => l.code === langCode);
                      return (
                        <span key={langCode} className="text-xs">
                          {lang?.flag}
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          <Card className="healthcare-card h-[600px] flex flex-col">
            {/* Chat Header */}
            <CardHeader className="border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={selectedDoctor.avatar} />
                      <AvatarFallback>
                        <Stethoscope className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                      selectedDoctor.isOnline ? 'bg-success' : 'bg-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <div className="font-medium">{selectedDoctor.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedDoctor.specialty} • {selectedDoctor.isOnline ? 'Online' : 'Offline'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={startVideoCall}>
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={startVideoCall}>
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={generateConsultationSummary}>
                    <FileText className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-0">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === 'patient' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender === 'patient' ? 'order-2' : 'order-1'
                      }`}>
                        {message.sender !== 'patient' && message.sender !== 'system' && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback>
                                {message.sender === 'doctor' ? (
                                  <Stethoscope className="w-3 h-3" />
                                ) : (
                                  <Bot className="w-3 h-3" />
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {message.sender === 'doctor' ? selectedDoctor.name : 'AI Assistant'}
                            </span>
                          </div>
                        )}
                        
                        <div className={`rounded-lg p-3 ${
                          message.sender === 'patient'
                            ? 'bg-primary text-primary-foreground'
                            : message.sender === 'system'
                            ? 'bg-muted text-muted-foreground text-center'
                            : message.sender === 'ai'
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-muted'
                        }`}>
                          {message.messageType === 'consultation-summary' ? (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 mb-2">
                                <FileText className="w-4 h-4" />
                                <span className="font-medium">Consultation Summary</span>
                              </div>
                              <div className="text-sm whitespace-pre-line">{message.message}</div>
                            </div>
                          ) : (
                            <div className="text-sm">{message.message}</div>
                          )}
                          
                          {message.isTranslated && (
                            <div className="mt-2 pt-2 border-t border-black/10 dark:border-white/10">
                              <div className="flex items-center space-x-1 mb-1">
                                <Languages className="w-3 h-3" />
                                <span className="text-xs opacity-75">Original:</span>
                              </div>
                              <div className="text-xs opacity-75 italic">
                                {message.originalMessage}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className={`flex items-center space-x-1 mt-1 ${
                          message.sender === 'patient' ? 'justify-end' : 'justify-start'
                        }`}>
                          <span className="text-xs text-muted-foreground">
                            {formatTime(message.timestamp)}
                          </span>
                          {message.sender === 'patient' && getMessageStatusIcon(message.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback>
                            <Stethoscope className="w-3 h-3" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-muted rounded-lg p-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.2s]" />
                            <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Type a message in ${languages.find(l => l.code === patientLanguage)?.name}...`}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="pr-12"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleVoiceRecording}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 ${
                      isRecording ? 'text-destructive' : ''
                    }`}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                </div>
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim()}
                  className="medical-button bg-gradient-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              
              {autoTranslate && patientLanguage !== 'en' && (
                <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
                  <Languages className="w-3 h-3" />
                  <span>Messages will be automatically translated</span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDoctorChat;