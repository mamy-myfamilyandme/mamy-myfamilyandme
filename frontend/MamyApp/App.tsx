import React, { useState } from 'react';
import { StatusBar, useColorScheme, View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SplashScreen } from './src/screens/SplashScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { SignupScreen } from './src/screens/SignupScreen';
import { CaregiverSignupScreen } from './src/screens/CaregiverSignupScreen';
import { UserModeSelectionScreen } from './src/screens/UserModeSelectionScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { MedicationScreen } from './src/screens/tabs/MedicationScreen';
import { VaccinationScreen } from './src/screens/tabs/VaccinationScreen';
import { HospitalScreen } from './src/screens/tabs/HospitalScreen';
import { HealthScreen } from './src/screens/tabs/HealthScreen';
import { CommunityScreen } from './src/screens/tabs/CommunityScreen';
import { TabNavigator } from './src/components/TabNavigator';
import type { UserMode } from './src/types/auth';
import type { TabScreen } from './src/types/navigation';

type Screen = 'splash' | 'login' | 'signup' | 'caregiverSignup' | 'userModeSelection' | 'dashboard';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [selectedUserMode, setSelectedUserMode] = useState<UserMode | null>(null);
  const [activeTab, setActiveTab] = useState<TabScreen>('home');
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);

  const handleSplashFinish = () => {
    setCurrentScreen('login');
  };

  const handleLoginSuccess = () => {
    setCurrentScreen('userModeSelection');
  };

  const handleGoToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleSignupSuccess = (signupData: any) => {
    // 보호자 모드인 경우 아이 정보 입력 페이지로
    setPendingSignupData(signupData);
    setCurrentScreen('caregiverSignup');
  };

  const handleCaregiverSignupComplete = () => {
    // 회원가입 완료 후 로그인 페이지로
    setPendingSignupData(null);
    setCurrentScreen('login');
  };

  const handleBackToLogin = () => {
    setCurrentScreen('login');
  };

  const handleBackToSignup = () => {
    setCurrentScreen('signup');
  };

  const handleModeSelected = (mode: UserMode) => {
    setSelectedUserMode(mode);
    setActiveTab('home'); // Reset to home tab when entering dashboard
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setSelectedUserMode(null);
    setActiveTab('home');
    setCurrentScreen('login');
  };

  const handleTabChange = (tab: TabScreen) => {
    setActiveTab(tab);
  };

  const renderTabScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <DashboardScreen
            userMode={selectedUserMode || 'caregiver'}
            onLogout={handleLogout}
          />
        );
      case 'medication':
        return <MedicationScreen />;
      case 'vaccination':
        return <VaccinationScreen />;
      case 'hospital':
        return <HospitalScreen />;
      case 'health':
        return <HealthScreen />;
      case 'community':
        return <CommunityScreen />;
      default:
        return (
          <DashboardScreen
            userMode={selectedUserMode || 'caregiver'}
            onLogout={handleLogout}
          />
        );
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'splash':
        return <SplashScreen onFinish={handleSplashFinish} />;
      case 'login':
        return (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onGoToSignup={handleGoToSignup}
          />
        );
      case 'signup':
        return (
          <SignupScreen
            onSignupSuccess={handleSignupSuccess}
            onBackToLogin={handleBackToLogin}
          />
        );
      case 'caregiverSignup':
        return pendingSignupData ? (
          <CaregiverSignupScreen
            signupData={pendingSignupData}
            onComplete={handleCaregiverSignupComplete}
            onBack={handleBackToSignup}
          />
        ) : null;
      case 'userModeSelection':
        return <UserModeSelectionScreen onModeSelected={handleModeSelected} />;
      case 'dashboard':
        return (
          <View style={styles.dashboardContainer}>
            {renderTabScreen()}
            <TabNavigator activeTab={activeTab} onTabChange={handleTabChange} />
          </View>
        );
      default:
        return <SplashScreen onFinish={handleSplashFinish} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={currentScreen === 'splash' ? 'light-content' : isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={currentScreen === 'splash' ? '#6FCCBD' : undefined}
      />
      {renderScreen()}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  dashboardContainer: {
    flex: 1,
  },
});

export default App;
