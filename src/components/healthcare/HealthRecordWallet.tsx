import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  FileText, 
  Upload, 
  Calendar, 
  User, 
  QrCode, 
  Share2, 
  Filter, 
  Search,
  Download,
  Eye,
  Tag,
  Folder,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';

interface HealthRecord {
  id: string;
  title: string;
  type: 'prescription' | 'lab-report' | 'discharge-summary' | 'imaging' | 'vaccination';
  date: string;
  doctor: string;
  facility: string;
  tags: string[];
  fileUrl?: string;
  fileType: 'pdf' | 'image' | 'document';
  size?: string;
  isSecure: boolean;
}

// Mock health records data
const MOCK_RECORDS: HealthRecord[] = [
  {
    id: '1',
    title: 'Blood Test Results',
    type: 'lab-report',
    date: '2024-01-15',
    doctor: 'Dr. Priya Sharma',
    facility: 'City Medical Lab',
    tags: ['blood-work', 'routine-checkup'],
    fileType: 'pdf',
    size: '2.4 MB',
    isSecure: true
  },
  {
    id: '2',
    title: 'Diabetes Medication',
    type: 'prescription',
    date: '2024-01-10',
    doctor: 'Dr. Rajesh Kumar',
    facility: 'Community Health Center',
    tags: ['diabetes', 'medication'],
    fileType: 'image',
    size: '1.2 MB',
    isSecure: true
  },
  {
    id: '3',
    title: 'Chest X-Ray Report',
    type: 'imaging',
    date: '2024-01-08',
    doctor: 'Dr. Anita Singh',
    facility: 'Rural Diagnostic Center',
    tags: ['x-ray', 'chest', 'respiratory'],
    fileType: 'pdf',
    size: '5.8 MB',
    isSecure: true
  },
  {
    id: '4',
    title: 'Discharge Summary - Surgery',
    type: 'discharge-summary',
    date: '2024-01-05',
    doctor: 'Dr. Mohan Gupta',
    facility: 'District Hospital',
    tags: ['surgery', 'appendectomy', 'recovery'],
    fileType: 'pdf',
    size: '3.1 MB',
    isSecure: true
  },
  {
    id: '5',
    title: 'COVID-19 Vaccination',
    type: 'vaccination',
    date: '2023-12-20',
    doctor: 'Nurse Ravi Prasad',
    facility: 'PHC Vaccination Center',
    tags: ['covid-19', 'vaccination', 'immunization'],
    fileType: 'image',
    size: '0.8 MB',
    isSecure: true
  }
];

const HealthRecordWallet: React.FC = () => {
  const [records, setRecords] = useState<HealthRecord[]>(MOCK_RECORDS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const recordTypes = [
    { value: 'all', label: 'All Records', icon: FileText },
    { value: 'prescription', label: 'Prescriptions', icon: FileText },
    { value: 'lab-report', label: 'Lab Reports', icon: FileText },
    { value: 'imaging', label: 'Imaging', icon: FileText },
    { value: 'discharge-summary', label: 'Discharge Summaries', icon: FileText },
    { value: 'vaccination', label: 'Vaccinations', icon: FileText }
  ];

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === 'all' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only PDF and image files are allowed');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(uploadInterval);
          setIsUploading(false);
          
          // Add new record
          const newRecord: HealthRecord = {
            id: Date.now().toString(),
            title: file.name.replace(/\.[^/.]+$/, ''),
            type: 'prescription', // Default type - in real app, user would select
            date: new Date().toISOString().split('T')[0],
            doctor: 'Dr. New Upload',
            facility: 'Self Upload',
            tags: ['uploaded'],
            fileType: file.type.includes('pdf') ? 'pdf' : 'image',
            size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
            isSecure: true
          };

          setRecords(prev => [newRecord, ...prev]);
          toast.success('File uploaded successfully');
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const generateQRCode = (record: HealthRecord) => {
    // Mock QR code generation - In real app, would generate actual QR code
    toast.success(`QR code generated for ${record.title}`);
  };

  const shareRecord = (record: HealthRecord) => {
    // Mock sharing - In real app, would generate secure sharing link
    navigator.clipboard.writeText(`https://ruraelai-health.com/share/${record.id}`);
    toast.success('Secure sharing link copied to clipboard');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'prescription': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'lab-report': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'imaging': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'discharge-summary': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'vaccination': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'prescription': return '💊';
      case 'lab-report': return '🧪';
      case 'imaging': return '🏥';
      case 'discharge-summary': return '📋';
      case 'vaccination': return '💉';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
            <Folder className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Digital Health Record Wallet</h2>
            <p className="text-muted-foreground">Secure storage for all your medical documents</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <label htmlFor="file-upload">
            <Button asChild className="medical-button bg-gradient-secondary">
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload Record
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="healthcare-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Uploading...</span>
                  <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search records, doctors, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto">
          {recordTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedType === type.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type.value)}
              className="whitespace-nowrap"
            >
              <type.icon className="w-4 h-4 mr-2" />
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRecords.map((record) => (
          <Card key={record.id} className="healthcare-card hover:shadow-medium transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getTypeIcon(record.type)}</div>
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{record.title}</CardTitle>
                    <Badge className={`mt-1 ${getTypeColor(record.type)}`} variant="secondary">
                      {record.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(record.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{record.doctor}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{record.facility}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {record.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* File Info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{record.fileType.toUpperCase()}</span>
                <span>{record.size}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{record.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Doctor:</span> {record.doctor}
                          </div>
                          <div>
                            <span className="font-medium">Date:</span> {new Date(record.date).toLocaleDateString()}
                          </div>
                          <div>
                            <span className="font-medium">Facility:</span> {record.facility}
                          </div>
                          <div>
                            <span className="font-medium">Type:</span> {record.type.replace('-', ' ')}
                          </div>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg text-center">
                          <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">Document preview would appear here</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            In a real app, this would show the actual document content
                          </p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => generateQRCode(record)}
                  >
                    <QrCode className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => shareRecord(record)}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>

                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRecords.length === 0 && (
        <Card className="healthcare-card">
          <CardContent className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No records found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Upload your first health record to get started'}
            </p>
            <label htmlFor="file-upload-empty">
              <Button asChild className="bg-gradient-secondary">
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload First Record
                </span>
              </Button>
            </label>
          </CardContent>
        </Card>
      )}

      {/* Storage Info */}
      <Card className="healthcare-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Storage Used</h4>
              <p className="text-sm text-muted-foreground">
                {records.length} records • 15.3 MB of 1 GB used
              </p>
            </div>
            <div className="w-32">
              <Progress value={1.5} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthRecordWallet;