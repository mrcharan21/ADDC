import { ArrowLeft, Search, Download, TrendingUp, Users, AlertTriangle, ChevronDown, UserPlus, Eye, ShieldCheck, ShieldX } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface EscalationEvent {
  id: string;
  targetType: 'User' | 'Group';
  targetName: string;
  escalationType: string;
  previousPrivilege: string;
  newPrivilege: string;
  timestamp: string;
  changedBy: string;
  ou: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  justification: string;
  approved: boolean;
}

const mockEscalationEvents: EscalationEvent[] = [
  {
    id: '1',
    targetType: 'User',
    targetName: 'john.smith',
    escalationType: 'Added to Domain Admins',
    previousPrivilege: 'Standard User',
    newPrivilege: 'Domain Admin',
    timestamp: '2024-12-23 14:30',
    changedBy: 'admin.manager',
    ou: 'IT Security',
    riskLevel: 'Critical',
    justification: 'Emergency access for critical incident',
    approved: true
  },
  {
    id: '2',
    targetType: 'Group',
    targetName: 'DB-Administrators',
    escalationType: 'Added Admin Rights',
    previousPrivilege: 'Read-Only',
    newPrivilege: 'Full Control',
    timestamp: '2024-12-23 11:15',
    changedBy: 'security.admin',
    ou: 'Database Admin',
    riskLevel: 'High',
    justification: 'Production database maintenance',
    approved: true
  },
  {
    id: '3',
    targetType: 'User',
    targetName: 'sarah.jones',
    escalationType: 'Added to Server Admins',
    previousPrivilege: 'Standard User',
    newPrivilege: 'Server Admin',
    timestamp: '2024-12-23 09:45',
    changedBy: 'it.manager',
    ou: 'IT Operations',
    riskLevel: 'Medium',
    justification: 'Server maintenance tasks',
    approved: true
  },
  {
    id: '4',
    targetType: 'User',
    targetName: 'mike.wilson',
    escalationType: 'Added to Backup Operators',
    previousPrivilege: 'Standard User',
    newPrivilege: 'Backup Operator',
    timestamp: '2024-12-22 16:20',
    changedBy: 'domain.admin1',
    ou: 'IT Operations',
    riskLevel: 'Low',
    justification: 'Backup responsibilities transfer',
    approved: true
  },
  {
    id: '5',
    targetType: 'Group',
    targetName: 'Network-Admins',
    escalationType: 'Privilege Elevation',
    previousPrivilege: 'Limited Access',
    newPrivilege: 'Full Network Control',
    timestamp: '2024-12-22 13:00',
    changedBy: 'network.manager',
    ou: 'Network Admin',
    riskLevel: 'High',
    justification: 'Network infrastructure upgrade',
    approved: true
  },
  {
    id: '6',
    targetType: 'User',
    targetName: 'emma.davis',
    escalationType: 'Added to Domain Admins',
    previousPrivilege: 'Power User',
    newPrivilege: 'Domain Admin',
    timestamp: '2024-12-22 10:30',
    changedBy: 'security.admin',
    ou: 'IT Security',
    riskLevel: 'Critical',
    justification: 'Security audit requirements',
    approved: false
  },
  {
    id: '7',
    targetType: 'User',
    targetName: 'alex.brown',
    escalationType: 'Added to Print Operators',
    previousPrivilege: 'Standard User',
    newPrivilege: 'Print Operator',
    timestamp: '2024-12-21 15:10',
    changedBy: 'it.helpdesk',
    ou: 'IT Operations',
    riskLevel: 'Low',
    justification: 'Print server management',
    approved: true
  },
  {
    id: '8',
    targetType: 'Group',
    targetName: 'Security-Team',
    escalationType: 'Added Admin Rights',
    previousPrivilege: 'Read-Only',
    newPrivilege: 'Security Admin',
    timestamp: '2024-12-21 11:45',
    changedBy: 'domain.admin2',
    ou: 'IT Security',
    riskLevel: 'High',
    justification: 'Security operations expansion',
    approved: true
  },
  {
    id: '9',
    targetType: 'User',
    targetName: 'chris.taylor',
    escalationType: 'Added to Schema Admins',
    previousPrivilege: 'Standard User',
    newPrivilege: 'Schema Admin',
    timestamp: '2024-12-21 08:20',
    changedBy: 'domain.admin1',
    ou: 'IT Security',
    riskLevel: 'Critical',
    justification: 'AD schema modifications required',
    approved: false
  },
  {
    id: '10',
    targetType: 'User',
    targetName: 'lisa.martin',
    escalationType: 'Added to Server Operators',
    previousPrivilege: 'Standard User',
    newPrivilege: 'Server Operator',
    timestamp: '2024-12-20 14:55',
    changedBy: 'server.admin',
    ou: 'Server Admin',
    riskLevel: 'Medium',
    justification: 'Server operations support',
    approved: true
  }
];

interface PrivilegeEscalationViewProps {
  onBack: () => void;
}

export function PrivilegeEscalationView({ onBack }: PrivilegeEscalationViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [events, setEvents] = useState(mockEscalationEvents);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterTargetType, setFilterTargetType] = useState('All');
  const [filterRiskLevel, setFilterRiskLevel] = useState('All');
  const [filterApprovalStatus, setFilterApprovalStatus] = useState('All');
  const [sortBy, setSortBy] = useState<string>('timestamp');
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const eventsPerPage = 10;
  const tableTopRef = useRef<HTMLDivElement | null>(null);

  const updateApproval = (eventId: string, approved: boolean) => {
    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === eventId ? { ...event, approved } : event
      )
    );
    setOpenActionMenuId(null);
  };

  const filteredEvents = events
    .filter(event => {
      const matchesSearch =
        event.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.escalationType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.changedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTargetType = filterTargetType === 'All' || event.targetType === filterTargetType;
      const matchesRisk = filterRiskLevel === 'All' || event.riskLevel === filterRiskLevel;
      const matchesApproval = filterApprovalStatus === 'All' ||
        (filterApprovalStatus === 'Approved' && event.approved) ||
        (filterApprovalStatus === 'Not Approved' && !event.approved);

      return matchesSearch && matchesTargetType && matchesRisk && matchesApproval;
    })
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else if (sortBy === 'riskLevel') {
        const riskOrder = { 'Critical': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
      }
      return 0;
    });
  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / eventsPerPage));
  const pageStartIndex = (currentPage - 1) * eventsPerPage;
  const pageEndIndex = pageStartIndex + eventsPerPage;
  const paginatedEvents = filteredEvents.slice(pageStartIndex, pageEndIndex);
  const visibleStart = filteredEvents.length === 0 ? 0 : pageStartIndex + 1;
  const visibleEnd = Math.min(pageEndIndex, filteredEvents.length);

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const criticalCount = events.filter(e => e.riskLevel === 'Critical').length;
  const unapprovedCount = events.filter(e => !e.approved).length;
  const userEscalations = events.filter(e => e.targetType === 'User').length;
  const groupEscalations = events.filter(e => e.targetType === 'Group').length;

  useEffect(() => {
    setCurrentPage(1);
    setOpenActionMenuId(null);
  }, [searchTerm, filterTargetType, filterRiskLevel, filterApprovalStatus, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    setOpenActionMenuId(null);
  }, [currentPage]);

  useEffect(() => {
    if (filteredEvents.length === 0) return;
    tableTopRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, [currentPage, filteredEvents.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Dashboard</span>
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <span className="hover:text-blue-600 cursor-pointer" onClick={onBack}>Dashboard</span>
            <span>/</span>
            <span className="text-gray-900">Privilege Escalation Tracking</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="text-amber-600" size={32} />
              <div>
                <h1>Privilege Escalation Events</h1>
                <p className="text-sm text-gray-600">Monitor and audit privilege changes for users and groups</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Critical Events</p>
                <p className="text-xl font-semibold text-red-600">{criticalCount}</p>
              </div>

              <div className="text-right">
                <p className="text-sm text-gray-600">Unapproved</p>
                <p className="text-xl font-semibold text-amber-600">{unapprovedCount}</p>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download size={18} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Total Events</p>
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-gray-900">{events.length}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">User Escalations</p>
              <UserPlus className="text-amber-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-amber-600">{userEscalations}</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Group Escalations</p>
              <Users className="text-red-600" size={20} />
            </div>
            <p className="text-2xl font-semibold text-red-600">{groupEscalations}</p>
          </div>
        </div>

        {/* Alert Banner */}
        {unapprovedCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertTriangle className="text-amber-600" size={24} />
            <div>
              <p className="font-semibold text-amber-900">Approval Required</p>
              <p className="text-sm text-amber-700">{unapprovedCount} privilege escalation events require approval or review</p>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by target name, escalation type, or changed by..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">Filters</span>
            <ChevronDown className={`text-gray-600 transition-transform ${showFilters ? 'rotate-180' : ''}`} size={20} />
          </button>

          {showFilters && (
            <div className="px-6 pb-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                <select
                  value={filterTargetType}
                  onChange={(e) => setFilterTargetType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Target Types</option>
                  <option value="User">Users Only</option>
                  <option value="Group">Groups Only</option>
                </select>

                <select
                  value={filterRiskLevel}
                  onChange={(e) => setFilterRiskLevel(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Risk Levels</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={filterApprovalStatus}
                  onChange={(e) => setFilterApprovalStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="All">All Approval Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Not Approved">Not Approved</option>
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="timestamp">Sort by Timestamp</option>
                  <option value="riskLevel">Sort by Risk Level</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Main Data Table */}
        <div ref={tableTopRef} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible mb-8 scroll-mt-6">
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full min-w-max">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Target</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Escalation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Previous</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">New Privilege</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Risk Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Approved</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Changed By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">OU</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {event.targetType === 'User' ? (
                          <UserPlus className="text-amber-600" size={16} />
                        ) : (
                          <Users className="text-red-600" size={16} />
                        )}
                        <span className="font-medium text-gray-900">{event.targetName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${event.targetType === 'User' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {event.targetType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.escalationType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.previousPrivilege}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-red-700">
                        {event.newPrivilege}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getRiskBadgeColor(event.riskLevel)}`}>
                        {event.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        event.approved ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {event.approved ? 'Approved' : 'Not Approved'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.changedBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.ou}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm relative">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenActionMenuId((current) => (current === event.id ? null : event.id))
                        }
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                        aria-label="Open approval actions"
                      >
                        <Eye size={16} />
                      </button>
                      {openActionMenuId === event.id && (
                        <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gray-200 bg-white shadow-lg z-20 overflow-hidden">
                          <button
                            type="button"
                            onClick={() => updateApproval(event.id, true)}
                            className="w-full px-4 py-3 flex items-center gap-2 text-sm text-left text-green-700 hover:bg-green-50 transition-colors"
                          >
                            <ShieldCheck size={16} />
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => updateApproval(event.id, false)}
                            className="w-full px-4 py-3 flex items-center gap-2 text-sm text-left text-red-700 hover:bg-red-50 transition-colors"
                          >
                            <ShieldX size={16} />
                            Don't Approve
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-4 mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Showing {visibleStart}-{visibleEnd} of {filteredEvents.length} events
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => {
                  const isActive = page === currentPage;
                  const isEdge = page === 1 || page === totalPages;
                  const isNearCurrent = Math.abs(page - currentPage) <= 1;

                  if (!isEdge && !isNearCurrent) {
                    const shouldShowEllipsis =
                      (page === currentPage - 2 && page > 2) ||
                      (page === currentPage + 2 && page < totalPages - 1);

                    if (shouldShowEllipsis) {
                      return (
                        <span key={`ellipsis-${page}`} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    return null;
                  }

                  return (
                    <button
                      key={page}
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[2.25rem] px-3 py-2 text-sm rounded-lg border transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          Showing {filteredEvents.length} of {events.length} privilege escalation events
        </div>
      </main>
    </div>
  );
}
