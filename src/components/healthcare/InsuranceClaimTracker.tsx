import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  CreditCard, 
  Upload, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  Bell,
  Filter,
  Search,
  Download,
  Plus,
  Building,
  User,
  Stethoscope
} from 'lucide-react';
import { toast } from 'sonner';

interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  patientName: string;
  providerName: string;
  treatmentDate: string;
  submissionDate: string;
  claimAmount: number;
  approvedAmount: number;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'partially-approved' | 'requires-documents';
  category: 'outpatient' | 'inpatient' | 'pharmacy' | 'diagnostic' | 'emergency';
  documents: Document[];
  timeline: TimelineEvent[];
  lastUpdated: string;
  estimatedProcessingDays: number;
  daysRemaining?: number;
}

interface Document {
  id: string;
  name: string;
  type: 'bill' | 'prescription' | 'discharge-summary' | 'lab-report' | 'id-proof' | 'policy-document';
  status: 'uploaded' | 'verified' | 'rejected' | 'missing';
  uploadDate?: string;
  size?: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'current' | 'pending';
}

// Mock insurance claims data
const MOCK_CLAIMS: InsuranceClaim[] = [
  {
    id: '1',
    claimNumber: 'CLM-2024-001234',
    policyNumber: 'POL-789012',
    patientName: 'Ravi Kumar',
    providerName: 'City Medical Center',
    treatmentDate: '2024-01-10',
    submissionDate: '2024-01-12',
    claimAmount: 25000,
    approvedAmount: 22500,
    status: 'approved',
    category: 'inpatient',
    lastUpdated: '2024-01-15',
    estimatedProcessingDays: 7,
    documents: [
      { id: '1', name: 'Hospital Bill', type: 'bill', status: 'verified', uploadDate: '2024-01-12', size: '2.1 MB' },
      { id: '2', name: 'Discharge Summary', type: 'discharge-summary', status: 'verified', uploadDate: '2024-01-12', size: '1.5 MB' },
      { id: '3', name: 'Insurance ID Card', type: 'id-proof', status: 'verified', uploadDate: '2024-01-12', size: '0.8 MB' }
    ],
    timeline: [
      { id: '1', title: 'Claim Submitted', description: 'Initial claim submission completed', date: '2024-01-12', status: 'completed' },
      { id: '2', title: 'Documents Verified', description: 'All required documents verified', date: '2024-01-13', status: 'completed' },
      { id: '3', title: 'Medical Review', description: 'Claim under medical review', date: '2024-01-14', status: 'completed' },
      { id: '4', title: 'Approved', description: 'Claim approved for ₹22,500', date: '2024-01-15', status: 'completed' }
    ]
  },
  {
    id: '2',
    claimNumber: 'CLM-2024-001235',
    policyNumber: 'POL-789012',
    patientName: 'Priya Sharma',
    providerName: 'Wellness Diagnostics',
    treatmentDate: '2024-01-18',
    submissionDate: '2024-01-20',
    claimAmount: 3500,
    approvedAmount: 0,
    status: 'requires-documents',
    category: 'diagnostic',
    lastUpdated: '2024-01-22',
    estimatedProcessingDays: 5,
    daysRemaining: 3,
    documents: [
      { id: '4', name: 'Lab Report', type: 'lab-report', status: 'verified', uploadDate: '2024-01-20', size: '1.2 MB' },
      { id: '5', name: 'Doctor Prescription', type: 'prescription', status: 'missing' },
      { id: '6', name: 'Insurance ID Card', type: 'id-proof', status: 'verified', uploadDate: '2024-01-20', size: '0.8 MB' }
    ],
    timeline: [
      { id: '5', title: 'Claim Submitted', description: 'Initial claim submission completed', date: '2024-01-20', status: 'completed' },
      { id: '6', title: 'Document Review', description: 'Documents under review', date: '2024-01-21', status: 'completed' },
      { id: '7', title: 'Additional Documents Required', description: 'Doctor prescription needed', date: '2024-01-22', status: 'current' },
      { id: '8', title: 'Final Review', description: 'Pending document submission', date: '', status: 'pending' }
    ]
  },
  {
    id: '3',
    claimNumber: 'CLM-2024-001236',
    policyNumber: 'POL-789012',
    patientName: 'Amit Singh',
    providerName: 'Apollo Pharmacy',
    treatmentDate: '2024-01-25',
    submissionDate: '2024-01-25',
    claimAmount: 1200,
    approvedAmount: 0,
    status: 'under-review',
    category: 'pharmacy',
    lastUpdated: '2024-01-25',
    estimatedProcessingDays: 3,
    daysRemaining: 2,
    documents: [
      { id: '7', name: 'Pharmacy Bill', type: 'bill', status: 'verified', uploadDate: '2024-01-25', size: '0.9 MB' },
      { id: '8', name: 'Prescription', type: 'prescription', status: 'verified', uploadDate: '2024-01-25', size: '0.5 MB' }
    ],
    timeline: [
      { id: '9', title: 'Claim Submitted', description: 'Pharmacy claim submitted', date: '2024-01-25', status: 'completed' },
      { id: '10', title: 'Under Review', description: 'Claim being processed', date: '2024-01-25', status: 'current' },
      { id: '11', title: 'Approval', description: 'Awaiting final approval', date: '', status: 'pending' }
    ]
  }
];

const InsuranceClaimTracker: React.FC = () => {
  const [claims, setClaims] = useState<InsuranceClaim[]>(MOCK_CLAIMS);
  const [selectedClaim, setSelectedClaim] = useState<InsuranceClaim | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isNewClaimOpen, setIsNewClaimOpen] = useState(false);
  const [newClaimData, setNewClaimData] = useState({
    patientName: '',
    providerName: '',
    treatmentDate: '',
    claimAmount: '',
    category: '',
    description: ''
  });

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         claim.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || claim.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-success text-success-foreground';
      case 'partially-approved': return 'bg-success/80 text-success-foreground';
      case 'under-review': return 'bg-warning text-warning-foreground';
      case 'submitted': return 'bg-primary text-primary-foreground';
      case 'rejected': return 'bg-destructive text-destructive-foreground';
      case 'requires-documents': return 'bg-orange-500 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'partially-approved': return <CheckCircle className="w-4 h-4" />;
      case 'under-review': return <Clock className="w-4 h-4" />;
      case 'submitted': return <Upload className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'requires-documents': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'inpatient': return <Building className="w-4 h-4" />;
      case 'outpatient': return <User className="w-4 h-4" />;
      case 'pharmacy': return <CreditCard className="w-4 h-4" />;
      case 'diagnostic': return <Stethoscope className="w-4 h-4" />;
      case 'emergency': return <AlertCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getDocumentStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-success';
      case 'uploaded': return 'text-primary';
      case 'rejected': return 'text-destructive';
      case 'missing': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const submitNewClaim = () => {
    if (!newClaimData.patientName || !newClaimData.providerName || 
        !newClaimData.treatmentDate || !newClaimData.claimAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newClaim: InsuranceClaim = {
      id: Date.now().toString(),
      claimNumber: `CLM-2024-${String(Date.now()).slice(-6)}`,
      policyNumber: 'POL-789012',
      patientName: newClaimData.patientName,
      providerName: newClaimData.providerName,
      treatmentDate: newClaimData.treatmentDate,
      submissionDate: new Date().toISOString().split('T')[0],
      claimAmount: parseFloat(newClaimData.claimAmount),
      approvedAmount: 0,
      status: 'submitted',
      category: newClaimData.category as any || 'outpatient',
      lastUpdated: new Date().toISOString().split('T')[0],
      estimatedProcessingDays: 5,
      daysRemaining: 5,
      documents: [],
      timeline: [
        {
          id: '1',
          title: 'Claim Submitted',
          description: 'New claim submitted successfully',
          date: new Date().toISOString().split('T')[0],
          status: 'completed'
        },
        {
          id: '2',
          title: 'Document Review',
          description: 'Awaiting document upload and verification',
          date: '',
          status: 'pending'
        }
      ]
    };

    setClaims(prev => [newClaim, ...prev]);
    setNewClaimData({
      patientName: '',
      providerName: '',
      treatmentDate: '',
      claimAmount: '',
      category: '',
      description: ''
    });
    setIsNewClaimOpen(false);
    toast.success('New claim submitted successfully');
  };

  const uploadDocument = (claimId: string) => {
    // Mock document upload
    toast.success('Document upload feature would be integrated here');
  };

  const calculateProgress = (claim: InsuranceClaim) => {
    const completedSteps = claim.timeline.filter(t => t.status === 'completed').length;
    const totalSteps = claim.timeline.length;
    return (completedSteps / totalSteps) * 100;
  };

  const getClaimStats = () => {
    const total = claims.length;
    const approved = claims.filter(c => c.status === 'approved').length;
    const underReview = claims.filter(c => c.status === 'under-review').length;
    const requiresAction = claims.filter(c => c.status === 'requires-documents').length;
    const totalAmount = claims.reduce((sum, c) => sum + c.claimAmount, 0);
    const approvedAmount = claims.reduce((sum, c) => sum + c.approvedAmount, 0);

    return { total, approved, underReview, requiresAction, totalAmount, approvedAmount };
  };

  const stats = getClaimStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Insurance Claim Tracker</h2>
            <p className="text-muted-foreground">Track and manage your insurance claims</p>
          </div>
        </div>
        
        <Dialog open={isNewClaimOpen} onOpenChange={setIsNewClaimOpen}>
          <DialogTrigger asChild>
            <Button className="medical-button bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              New Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Submit New Claim</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Patient Name *"
                value={newClaimData.patientName}
                onChange={(e) => setNewClaimData(prev => ({ ...prev, patientName: e.target.value }))}
              />
              <Input
                placeholder="Healthcare Provider *"
                value={newClaimData.providerName}
                onChange={(e) => setNewClaimData(prev => ({ ...prev, providerName: e.target.value }))}
              />
              <Input
                type="date"
                placeholder="Treatment Date *"
                value={newClaimData.treatmentDate}
                onChange={(e) => setNewClaimData(prev => ({ ...prev, treatmentDate: e.target.value }))}
              />
              <Input
                type="number"
                placeholder="Claim Amount (₹) *"
                value={newClaimData.claimAmount}
                onChange={(e) => setNewClaimData(prev => ({ ...prev, claimAmount: e.target.value }))}
              />
              <select
                className="w-full p-2 border border-border rounded-md"
                value={newClaimData.category}
                onChange={(e) => setNewClaimData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Select Category</option>
                <option value="outpatient">Outpatient</option>
                <option value="inpatient">Inpatient</option>
                <option value="pharmacy">Pharmacy</option>
                <option value="diagnostic">Diagnostic</option>
                <option value="emergency">Emergency</option>
              </select>
              <Textarea
                placeholder="Description (Optional)"
                value={newClaimData.description}
                onChange={(e) => setNewClaimData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsNewClaimOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitNewClaim} className="bg-gradient-primary">
                  Submit Claim
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="healthcare-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Claims</div>
          </CardContent>
        </Card>
        <Card className="healthcare-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.approved}</div>
            <div className="text-sm text-muted-foreground">Approved</div>
          </CardContent>
        </Card>
        <Card className="healthcare-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.underReview}</div>
            <div className="text-sm text-muted-foreground">Under Review</div>
          </CardContent>
        </Card>
        <Card className="healthcare-card">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-500">{stats.requiresAction}</div>
            <div className="text-sm text-muted-foreground">Need Action</div>
          </CardContent>
        </Card>
      </div>

      {/* Amount Summary */}
      <Card className="healthcare-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Claimed Amount</div>
                <div className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Total Approved Amount</div>
                <div className="text-2xl font-bold text-success">₹{stats.approvedAmount.toLocaleString()}</div>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search claims, patients, or providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-border rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="requires-documents">Requires Documents</option>
          </select>

          <select
            className="px-3 py-2 border border-border rounded-md"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="inpatient">Inpatient</option>
            <option value="outpatient">Outpatient</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="diagnostic">Diagnostic</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {filteredClaims.map((claim) => (
          <Card key={claim.id} className="healthcare-card">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(claim.category)}
                        <span className="font-semibold text-lg">{claim.claimNumber}</span>
                      </div>
                      <Badge className={getStatusColor(claim.status)}>
                        {getStatusIcon(claim.status)}
                        <span className="ml-2 capitalize">{claim.status.replace('-', ' ')}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">₹{claim.claimAmount.toLocaleString()}</div>
                      {claim.approvedAmount > 0 && (
                        <div className="text-sm text-success">
                          Approved: ₹{claim.approvedAmount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Patient:</span>
                      <div className="font-medium">{claim.patientName}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Provider:</span>
                      <div className="font-medium">{claim.providerName}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Treatment Date:</span>
                      <div className="font-medium">{new Date(claim.treatmentDate).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(calculateProgress(claim))}% Complete</span>
                    </div>
                    <Progress value={calculateProgress(claim)} className="h-2" />
                  </div>

                  {/* Action Items */}
                  {claim.status === 'requires-documents' && (
                    <div className="flex items-center space-x-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">
                        {claim.documents.filter(d => d.status === 'missing').length} document(s) required
                      </span>
                      <Button size="sm" variant="outline" onClick={() => uploadDocument(claim.id)}>
                        Upload Documents
                      </Button>
                    </div>
                  )}

                  {claim.daysRemaining && claim.daysRemaining <= 3 && (
                    <div className="flex items-center space-x-2 p-3 bg-warning/10 rounded-lg">
                      <Bell className="w-4 h-4 text-warning" />
                      <span className="text-sm">
                        {claim.daysRemaining} day(s) remaining for document submission
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" onClick={() => setSelectedClaim(claim)}>
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Claim Details - {claim.claimNumber}</DialogTitle>
                      </DialogHeader>
                      
                      <Tabs defaultValue="overview" className="space-y-4">
                        <TabsList>
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="documents">Documents</TabsTrigger>
                          <TabsTrigger value="timeline">Timeline</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium">Claim Number:</span> {claim.claimNumber}
                            </div>
                            <div>
                              <span className="font-medium">Policy Number:</span> {claim.policyNumber}
                            </div>
                            <div>
                              <span className="font-medium">Patient:</span> {claim.patientName}
                            </div>
                            <div>
                              <span className="font-medium">Provider:</span> {claim.providerName}
                            </div>
                            <div>
                              <span className="font-medium">Treatment Date:</span> {new Date(claim.treatmentDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Submission Date:</span> {new Date(claim.submissionDate).toLocaleDateString()}
                            </div>
                            <div>
                              <span className="font-medium">Claim Amount:</span> ₹{claim.claimAmount.toLocaleString()}
                            </div>
                            <div>
                              <span className="font-medium">Approved Amount:</span> ₹{claim.approvedAmount.toLocaleString()}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="documents" className="space-y-4">
                          <div className="grid gap-3">
                            {claim.documents.length > 0 ? claim.documents.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <FileText className="w-5 h-5" />
                                  <div>
                                    <div className="font-medium">{doc.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {doc.type.replace('-', ' ')} • {doc.size}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Badge className={getDocumentStatusColor(doc.status)} variant="outline">
                                    {doc.status}
                                  </Badge>
                                  {doc.status === 'verified' && (
                                    <Button size="sm" variant="outline">
                                      <Download className="w-4 h-4" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            )) : (
                              <div className="text-center py-8 text-muted-foreground">
                                No documents uploaded yet
                              </div>
                            )}
                          </div>
                        </TabsContent>

                        <TabsContent value="timeline" className="space-y-4">
                          <div className="space-y-4">
                            {claim.timeline.map((event, index) => (
                              <div key={event.id} className="flex items-start space-x-3">
                                <div className={`w-3 h-3 rounded-full mt-2 ${
                                  event.status === 'completed' ? 'bg-success' :
                                  event.status === 'current' ? 'bg-primary' : 'bg-muted'
                                }`} />
                                <div className="flex-1">
                                  <div className="font-medium">{event.title}</div>
                                  <div className="text-sm text-muted-foreground">{event.description}</div>
                                  {event.date && (
                                    <div className="text-xs text-muted-foreground mt-1">
                                      {new Date(event.date).toLocaleDateString()}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>

                  <Button variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClaims.length === 0 && (
        <Card className="healthcare-card">
          <CardContent className="text-center py-12">
            <CreditCard className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No claims found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? 'Try adjusting your search criteria' : 'Submit your first insurance claim to get started'}
            </p>
            <Button onClick={() => setIsNewClaimOpen(true)} className="bg-gradient-primary">
              <Plus className="w-4 h-4 mr-2" />
              Submit First Claim
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InsuranceClaimTracker;