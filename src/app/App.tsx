import { useCallback, useEffect, useState } from 'react';
import { Shield, UserCog, Users, Key, FileText, Network, HardDrive, Lock } from 'lucide-react';
import { DevicesView } from './components/DevicesView';
import { DeviceDetailView } from './components/DeviceDetailView';
import { KerberosView } from './components/KerberosView';
import { SecurityGroupChart } from './components/SecurityGroupChart';
import { UserPrivilegesChart } from './components/UserPrivilegesChart';
import { PasswordExpirationCharts } from './components/PasswordExpirationCharts';
import { StatTile } from './components/StatTile';
import { AdminAccountsGraph } from './components/AdminAccountsGraph';
import { AdminActivityGraph } from './components/AdminActivityGraph';
import { MachineADGraph } from './components/MachineADGraph';
import { AdminEndpointLoginsChart } from './components/AdminEndpointLoginsChart';
import { PrivilegeEscalationChart } from './components/PrivilegeEscalationChart';
import { RiskScoreChart } from './components/RiskScoreChart';
import { RiskScoresView } from './components/RiskScoresView';
import { UserDetailsView } from './components/UserDetailsView';
import { ServiceAccountsView } from './components/ServiceAccountsView';
import { GroupsView } from './components/GroupsView';
import { GroupDetailView } from './components/GroupDetailView';
import { CiphersView } from './components/CiphersView';
import { CriticalGroupMachinesChart } from './components/CriticalGroupMachinesChart';
import { CriticalServersView } from './components/CriticalServersView';
import { CriticalEndpointsView } from './components/CriticalEndpointsView';
import { CriticalServerDetailView } from './components/CriticalServerDetailView';
import { CriticalEndpointDetailView } from './components/CriticalEndpointDetailView';
import { CreationActivityChart } from './components/CreationActivityChart';
import { UserCreationActivityView } from './components/UserCreationActivityView';
import { GroupCreationActivityView } from './components/GroupCreationActivityView';
import { GPOsView } from './components/GPOsView';
import { GPODetailView } from './components/GPODetailView';
import { OUsView } from './components/OUsView';
import { OUDetailView } from './components/OUDetailView';
import { ActiveSecurityGroupsOverview } from './components/ActiveSecurityGroupsOverview';
import { AllActiveSecurityGroups } from './components/AllActiveSecurityGroups';
import { PassiveSecurityGroupsOverview } from './components/PassiveSecurityGroupsOverview';
import { AllPassiveSecurityGroups } from './components/AllPassiveSecurityGroups';
import { PrivilegedUsersOverview } from './components/PrivilegedUsersOverview';
import { AllPrivilegedUsers } from './components/AllPrivilegedUsers';
import { AllNormalUsers } from './components/AllNormalUsers';
import { PasswordNeverExpiresOverview } from './components/PasswordNeverExpiresOverview';
import { AllPasswordNeverExpiresUsers } from './components/AllPasswordNeverExpiresUsers';
import { PasswordExpirySetOverview } from './components/PasswordExpirySetOverview';
import { AllPasswordExpirySetUsers } from './components/AllPasswordExpirySetUsers';
import { AdminAccountsOverview } from './components/AdminAccountsOverview';
import { AllAdminAccounts } from './components/AllAdminAccounts';
import { AdminEndpointLoginsView } from './components/AdminEndpointLoginsView';
import { PrivilegeEscalationView } from './components/PrivilegeEscalationView';
import { AdminActivityDetailView } from './components/AdminActivityDetailView';
import { MachineADActivityView } from './components/MachineADActivityView';
import { SecurityGroupDetailView } from './components/SecurityGroupDetailView';
import { PassiveSecurityGroupDetailView } from './components/PassiveSecurityGroupDetailView';
import { IndividualUserDetailView } from './components/IndividualUserDetailView';
import { OverviewTicketsView } from './components/OverviewTicketsView';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { DashboardStats, fetchDashboardStats } from './api/dashboard';

type RiskBand = 'High' | 'Medium' | 'Low';

type ViewType = 'dashboard' | 'overview' | 'users' | 'serviceAccounts' | 'groups' | 'groupDetail' | 'ciphers' | 'gpos' | 'gpoDetail' | 'ous' | 'ouDetail' | 'devices' | 'deviceDetail' | 'kerberos' | 'criticalServers' | 'criticalEndpoints' | 'criticalServerDetail' | 'criticalEndpointDetail' | 'userCreationActivity' | 'groupCreationActivity' | 'activeSecurityGroupsOverview' | 'allActiveSecurityGroups' | 'passiveSecurityGroupsOverview' | 'allPassiveSecurityGroups' | 'privilegedUsersOverview' | 'allPrivilegedUsers' | 'allNormalUsers' | 'passwordNeverExpiresOverview' | 'allPasswordNeverExpiresUsers' | 'passwordExpirySetOverview' | 'allPasswordExpirySetUsers' | 'adminAccountsOverview' | 'allAdminAccounts' | 'adminEndpointLogins' | 'privilegeEscalation' | 'adminActivity' | 'machineADActivity' | 'securityGroupDetail' | 'passiveSecurityGroupDetail' | 'individualUserDetail' | 'riskScores';

export default function App() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [dashboardStatsLoading, setDashboardStatsLoading] = useState(true);
  const [dashboardStatsError, setDashboardStatsError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [dashboardScrollPosition, setDashboardScrollPosition] = useState(0);
  const [securityGroupFilter, setSecurityGroupFilter] = useState<string | undefined>(undefined);
  const [privilegedUserFilter, setPrivilegedUserFilter] = useState<string | undefined>(undefined);
  const [passwordNeverExpiresFilter, setPasswordNeverExpiresFilter] = useState<string | undefined>(undefined);
  const [passwordExpiryFilter, setPasswordExpiryFilter] = useState<string | undefined>(undefined);
  const [adminAccountFilter, setAdminAccountFilter] = useState<string | undefined>(undefined);
  const [selectedRiskBand, setSelectedRiskBand] = useState<RiskBand | undefined>(undefined);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('1');
  const [selectedPassiveGroupId, setSelectedPassiveGroupId] = useState<string>('passive-1');
  const [selectedUserId, setSelectedUserId] = useState<string>('1');
  const [selectedGPOId, setSelectedGPOId] = useState<string>('1');
  const [selectedOUId, setSelectedOUId] = useState<string>('1');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('1');
  const [selectedCriticalServerId, setSelectedCriticalServerId] = useState<string>('1');
  const [selectedCriticalEndpointId, setSelectedCriticalEndpointId] = useState<string>('1');

  const loadDashboardStats = useCallback(async (signal?: AbortSignal) => {
    setDashboardStatsLoading(true);
    setDashboardStatsError(null);

    try {
      setDashboardStats(await fetchDashboardStats(signal));
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setDashboardStats(null);
      setDashboardStatsError(
        error instanceof Error ? error.message : 'Unable to load dashboard values',
      );
    } finally {
      if (!signal?.aborted) setDashboardStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadDashboardStats(controller.signal);
    return () => controller.abort();
  }, [loadDashboardStats]);

  // Save scroll position when leaving dashboard
  const handleNavigateFromDashboard = (view: ViewType) => {
    setDashboardScrollPosition(window.scrollY);
    setCurrentView(view);
  };

  // Restore scroll position when returning to dashboard
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  // Scroll to top for non-dashboard views, restore position for dashboard
  useEffect(() => {
    if (currentView === 'dashboard') {
      // Restore saved scroll position
      setTimeout(() => {
        window.scrollTo({ top: dashboardScrollPosition, behavior: 'smooth' });
      }, 0);
    } else {
      // Scroll to top for drill-down views
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentView, dashboardScrollPosition]);

  if (currentView === 'users') {
    return <UserDetailsView 
      onBack={() => handleBackToDashboard()} 
      onUserClick={(userId) => {
        setSelectedUserId(userId);
        setCurrentView('individualUserDetail');
      }}
    />;
  }

  if (currentView === 'riskScores') {
    return (
      <RiskScoresView
        initialBand={selectedRiskBand}
        onBack={() => handleBackToDashboard()}
        onUserClick={(userId) => {
          setSelectedUserId(userId);
          setCurrentView('individualUserDetail');
        }}
      />
    );
  }

  if (currentView === 'serviceAccounts') {
    return <ServiceAccountsView onBack={() => handleBackToDashboard()} />;
  }

  if (currentView === 'overview') {
    return (
      <OverviewTicketsView
        onBack={() => handleBackToDashboard()}
        onPasswordExpiryClick={() => setCurrentView('passwordExpirySetOverview')}
        onAdminAccountsClick={() => setCurrentView('adminAccountsOverview')}
      />
    );
  }

  if (currentView === 'groups') {
    return <GroupsView 
      onBack={() => handleBackToDashboard()} 
      onGroupClick={(groupId) => {
        setSelectedGroupId(groupId);
        setCurrentView('groupDetail');
      }}
    />;
  }

  if (currentView === 'groupDetail') {
    return <GroupDetailView 
      groupId={selectedGroupId} 
      onBack={() => setCurrentView('groups')} 
    />;
  }

  if (currentView === 'ciphers') {
    return <CiphersView onBack={() => handleBackToDashboard()} />;
  }

  if (currentView === 'gpos') {
    return <GPOsView 
      onBack={() => handleBackToDashboard()} 
      onGPOClick={(gpoId) => {
        setSelectedGPOId(gpoId);
        setCurrentView('gpoDetail');
      }}
    />;
  }

  if (currentView === 'gpoDetail') {
    return <GPODetailView 
      gpoId={selectedGPOId}
      onBack={() => setCurrentView('gpos')} 
    />;
  }

  if (currentView === 'ous') {
    return <OUsView 
      onBack={() => handleBackToDashboard()} 
      onOUClick={(ouId) => {
        setSelectedOUId(ouId);
        setCurrentView('ouDetail');
      }}
    />;
  }

  if (currentView === 'ouDetail') {
    return <OUDetailView 
      ouId={selectedOUId}
      onBack={() => setCurrentView('ous')} 
    />;
  }

  if (currentView === 'devices') {
    return <DevicesView 
      onBack={() => handleBackToDashboard()} 
      onDeviceClick={(deviceId) => {
        setSelectedDeviceId(deviceId);
        setCurrentView('deviceDetail');
      }}
    />;
  }

  if (currentView === 'deviceDetail') {
    return <DeviceDetailView 
      deviceId={selectedDeviceId}
      onBack={() => setCurrentView('devices')} 
    />;
  }

  if (currentView === 'kerberos') {
    return <KerberosView onBack={() => handleBackToDashboard()} />;
  }

  if (currentView === 'activeSecurityGroupsOverview') {
    return (
      <ActiveSecurityGroupsOverview 
        onBack={() => handleBackToDashboard()}
        onNavigateToL3={(filter) => {
          setSecurityGroupFilter(filter);
          setCurrentView('allActiveSecurityGroups');
        }}
      />
    );
  }

  if (currentView === 'allActiveSecurityGroups') {
    return (
      <AllActiveSecurityGroups 
        onBack={() => handleBackToDashboard()}
        initialFilter={securityGroupFilter}
        onGroupClick={(groupId) => {
          setSelectedGroupId(groupId);
          setCurrentView('securityGroupDetail');
        }}
      />
    );
  }

  if (currentView === 'passiveSecurityGroupsOverview') {
    return (
      <PassiveSecurityGroupsOverview 
        onBack={() => handleBackToDashboard()}
        onNavigateToL3={(filter) => {
          setSecurityGroupFilter(filter);
          setCurrentView('allPassiveSecurityGroups');
        }}
      />
    );
  }

  if (currentView === 'allPassiveSecurityGroups') {
    return (
      <AllPassiveSecurityGroups 
        onBack={() => handleBackToDashboard()}
        initialFilter={securityGroupFilter}
        onGroupClick={(groupId) => {
          setSelectedPassiveGroupId(groupId);
          setCurrentView('passiveSecurityGroupDetail');
        }}
      />
    );
  }

  if (currentView === 'privilegedUsersOverview') {
    return (
      <PrivilegedUsersOverview 
        onBack={() => handleBackToDashboard()}
        onNavigateToPrivilegedL3={(filter) => {
          setPrivilegedUserFilter(filter);
          setCurrentView('allPrivilegedUsers');
        }}
        onNavigateToNormalL3={() => setCurrentView('allNormalUsers')}
      />
    );
  }

  if (currentView === 'allPrivilegedUsers') {
    return (
      <AllPrivilegedUsers 
        onBack={() => setCurrentView('privilegedUsersOverview')}
        initialFilter={privilegedUserFilter}
      />
    );
  }

  if (currentView === 'allNormalUsers') {
    return (
      <AllNormalUsers 
        onBack={() => setCurrentView('privilegedUsersOverview')}
      />
    );
  }

  if (currentView === 'passwordNeverExpiresOverview') {
    return (
      <PasswordNeverExpiresOverview 
        onBack={() => handleBackToDashboard()}
        onNavigateToL3={(filter) => {
          setPasswordNeverExpiresFilter(filter);
          setCurrentView('allPasswordNeverExpiresUsers');
        }}
      />
    );
  }

  if (currentView === 'allPasswordNeverExpiresUsers') {
    return (
      <AllPasswordNeverExpiresUsers 
        onBack={() => setCurrentView('passwordNeverExpiresOverview')}
        initialFilter={passwordNeverExpiresFilter}
      />
    );
  }

  if (currentView === 'passwordExpirySetOverview') {
    return (
      <PasswordExpirySetOverview 
        onBack={() => handleBackToDashboard()}
        onNavigateToL3={(filter) => {
          setPasswordExpiryFilter(filter);
          setCurrentView('allPasswordExpirySetUsers');
        }}
      />
    );
  }

  if (currentView === 'allPasswordExpirySetUsers') {
    return (
      <AllPasswordExpirySetUsers 
        onBack={() => setCurrentView('passwordExpirySetOverview')}
        initialFilter={passwordExpiryFilter}
      />
    );
  }

  if (currentView === 'adminAccountsOverview') {
    return (
      <AdminAccountsOverview 
        onBack={() => handleBackToDashboard()}
        onNavigateToL3={(filter) => {
          setAdminAccountFilter(filter);
          setCurrentView('allAdminAccounts');
        }}
      />
    );
  }

  if (currentView === 'allAdminAccounts') {
    return (
      <AllAdminAccounts 
        onBack={() => setCurrentView('adminAccountsOverview')}
        initialFilter={adminAccountFilter}
      />
    );
  }

  if (currentView === 'adminEndpointLogins') {
    return <AdminEndpointLoginsView onBack={() => handleBackToDashboard()} />;
  }

  if (currentView === 'privilegeEscalation') {
    return <PrivilegeEscalationView onBack={() => handleBackToDashboard()} />;
  }

  if (currentView === 'adminActivity') {
    return <AdminActivityDetailView onBack={() => handleBackToDashboard()} />;
  }

  if (currentView === 'machineADActivity') {
    return <MachineADActivityView onBack={() => handleBackToDashboard()} />;
  }

  if (currentView === 'securityGroupDetail') {
    return <SecurityGroupDetailView groupId={selectedGroupId} onBack={() => setCurrentView('allActiveSecurityGroups')} />;
  }

  if (currentView === 'passiveSecurityGroupDetail') {
    return <PassiveSecurityGroupDetailView groupId={selectedPassiveGroupId} onBack={() => setCurrentView('allPassiveSecurityGroups')} />;
  }

  if (currentView === 'individualUserDetail') {
    return (
      <IndividualUserDetailView
        userId={selectedUserId}
        onBack={() => setCurrentView('users')}
        onGroupClick={(groupName) => {
          setSelectedGroupId(groupName);
          setCurrentView('groupDetail');
        }}
      />
    );
  }

  if (currentView === 'criticalServers') {
    return <CriticalServersView 
      onBack={() => handleBackToDashboard()} 
      onServerClick={(serverId) => {
        setSelectedCriticalServerId(serverId);
        setCurrentView('criticalServerDetail');
      }}
    />;
  }

  if (currentView === 'criticalEndpoints') {
    return <CriticalEndpointsView 
      onBack={() => handleBackToDashboard()} 
      onEndpointClick={(endpointId) => {
        setSelectedCriticalEndpointId(endpointId);
        setCurrentView('criticalEndpointDetail');
      }}
    />;
  }

  if (currentView === 'criticalServerDetail') {
    return <CriticalServerDetailView 
      serverId={selectedCriticalServerId} 
      onBack={() => setCurrentView('criticalServers')} 
    />;
  }

  if (currentView === 'criticalEndpointDetail') {
    return <CriticalEndpointDetailView 
      endpointId={selectedCriticalEndpointId} 
      onBack={() => setCurrentView('criticalEndpoints')} 
    />;
  }

  if (currentView === 'userCreationActivity') {
    return <UserCreationActivityView onBack={() => handleBackToDashboard()} />;
  }

  if (currentView === 'groupCreationActivity') {
    return <GroupCreationActivityView onBack={() => handleBackToDashboard()} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <Shield className="text-blue-600" size={32} />
            <div>
              <h1>ADDC Manager Dashboard</h1>
              <p className="text-sm text-gray-600">Active Directory Domain Controller Monitoring</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {dashboardStatsError && (
          <div className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Dashboard values could not be loaded: {dashboardStatsError}
            </p>
            <button
              type="button"
              onClick={() => loadDashboardStats()}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          <StatTile 
            title="Service Accounts" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.serviceAccounts ?? '—'}
            subtitle="Enabled Accounts"
            icon={UserCog}
            color="bg-blue-500"
            onClick={() => handleNavigateFromDashboard('serviceAccounts')}
          />
          <StatTile 
            title="Total Users" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.totalUsers ?? '—'}
            subtitle="Active Directory Users"
            icon={Users}
            color="bg-green-500"
            onClick={() => handleNavigateFromDashboard('users')}
          />
          <StatTile 
            title="Total Groups" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.totalGroups ?? '—'}
            subtitle="Security & Distribution"
            icon={Users}
            color="bg-purple-500"
            onClick={() => handleNavigateFromDashboard('groups')}
          />
          <StatTile 
            title="Total Ciphers" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.totalCiphers ?? '—'}
            subtitle="Encryption Keys"
            icon={Key}
            color="bg-orange-500"
            onClick={() => handleNavigateFromDashboard('ciphers')}
          />
          <StatTile 
            title="GPOs Applied" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.gposApplied ?? '—'}
            subtitle="Group Policy Objects"
            icon={FileText}
            color="bg-indigo-500"
            onClick={() => handleNavigateFromDashboard('gpos')}
          />
          <StatTile 
            title="Organizational Units" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.organizationalUnits ?? '—'}
            subtitle="Active OUs"
            icon={Network}
            color="bg-teal-500"
            onClick={() => handleNavigateFromDashboard('ous')}
          />
          <StatTile 
            title="Total Devices" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.totalDevices ?? '—'}
            subtitle="Registered Devices"
            icon={HardDrive}
            color="bg-cyan-500"
            onClick={() => handleNavigateFromDashboard('devices')}
          />
          <StatTile 
            title="Kerberos Tickets" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.kerberosTickets ?? '—'}
            subtitle="Active Tickets"
            icon={Lock}
            color="bg-red-500"
            onClick={() => handleNavigateFromDashboard('kerberos')}
          />
          <StatTile 
            title="Overview Tickets" 
            value={dashboardStatsLoading ? '...' : dashboardStats?.overviewTickets ?? '—'}
            subtitle="Active Tickets"
            icon={Lock}
            color="bg-red-500"
            onClick={() => handleNavigateFromDashboard('overview')}
          />
        </div>

        {/* Charts Grid */}
        <div className="space-y-6">
          <RiskScoreChart
            onBandClick={(band) => {
              setSelectedRiskBand(band);
              handleNavigateFromDashboard('riskScores');
            }}
          />

          {/* Security Groups and User Privileges */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SecurityGroupChart 
              onActiveGroupsClick={() => handleNavigateFromDashboard('allActiveSecurityGroups')}
              onPassiveGroupsClick={() => handleNavigateFromDashboard('allPassiveSecurityGroups')}
              onPassiveGroupsFilterClick={(filter) => {
                setSecurityGroupFilter(filter);
                handleNavigateFromDashboard('allPassiveSecurityGroups');
              }}
            />
            <UserPrivilegesChart onPrivilegedUsersClick={() => handleNavigateFromDashboard('privilegedUsersOverview')} />
          </div>

          {/* Password Expiration */}
          <PasswordExpirationCharts 
            onNeverExpiresClick={() => handleNavigateFromDashboard('passwordNeverExpiresOverview')}
            onExpirySetClick={() => handleNavigateFromDashboard('passwordExpirySetOverview')}
          />

          {/* Admin Accounts */}
          <AdminAccountsGraph onClick={() => handleNavigateFromDashboard('adminAccountsOverview')} />

          {/* Critical Group Machines */}
          <CriticalGroupMachinesChart 
            onServersClick={() => handleNavigateFromDashboard('criticalServers')}
            onEndpointsClick={() => handleNavigateFromDashboard('criticalEndpoints')}
          />

          {/* Admin Activity */}
          <AdminActivityGraph onClick={() => handleNavigateFromDashboard('adminActivity')} />

          {/* Admin Endpoint Logins */}
          <AdminEndpointLoginsChart onClick={() => handleNavigateFromDashboard('adminEndpointLogins')} />

          {/* User & Group Creation Activity */}
          <CreationActivityChart 
            onUserCreationClick={() => handleNavigateFromDashboard('userCreationActivity')}
            onGroupCreationClick={() => handleNavigateFromDashboard('groupCreationActivity')}
          />

          {/* Privilege Escalation */}
          <PrivilegeEscalationChart onClick={() => handleNavigateFromDashboard('privilegeEscalation')} />

          {/* Machine AD Activity - Moved to Last */}
          <MachineADGraph onClick={() => handleNavigateFromDashboard('machineADActivity')} />
        </div>
      </main>
      <ScrollToTopButton />
    </div>
  );
}
