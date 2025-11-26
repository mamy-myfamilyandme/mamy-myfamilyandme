import KakaoLogin from '@react-native-seoul/kakao-login';
import NaverLogin from '@react-native-seoul/naver-login';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
import { Platform } from 'react-native';

export interface SocialAuthResult {
  provider: 'kakao' | 'naver' | 'google' | 'apple';
  accessToken: string;
  user?: {
    id: string;
    email?: string;
    name?: string;
  };
}

/**
 * 카카오 로그인
 */
export async function loginWithKakao(): Promise<SocialAuthResult> {
  try {
    const result = await KakaoLogin.login();

    // 사용자 정보 가져오기
    const profile = await KakaoLogin.getProfile();

    return {
      provider: 'kakao',
      accessToken: result.accessToken,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.nickname,
      },
    };
  } catch (error: any) {
    console.error('Kakao login error:', error);
    throw new Error(`카카오 로그인 실패: ${error.message}`);
  }
}

/**
 * 네이버 로그인
 */
export async function loginWithNaver(): Promise<SocialAuthResult> {
  try {
    const result = await NaverLogin.login();

    // 사용자 정보는 result에 포함되어 있음
    return {
      provider: 'naver',
      accessToken: result.accessToken,
      user: {
        id: result.response?.id || '',
        email: result.response?.email,
        name: result.response?.name,
      },
    };
  } catch (error: any) {
    console.error('Naver login error:', error);
    throw new Error(`네이버 로그인 실패: ${error.message}`);
  }
}

/**
 * 구글 로그인
 */
export async function loginWithGoogle(): Promise<SocialAuthResult> {
  try {
    // Google Sign In 설정
    await GoogleSignin.hasPlayServices();

    const userInfo = await GoogleSignin.signIn();
    const tokens = await GoogleSignin.getTokens();

    return {
      provider: 'google',
      accessToken: tokens.accessToken,
      user: {
        id: userInfo.data?.user.id || '',
        email: userInfo.data?.user.email,
        name: userInfo.data?.user.name,
      },
    };
  } catch (error: any) {
    console.error('Google login error:', error);

    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      throw new Error('구글 로그인이 취소되었습니다');
    } else if (error.code === statusCodes.IN_PROGRESS) {
      throw new Error('구글 로그인이 진행 중입니다');
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      throw new Error('Play Services를 사용할 수 없습니다');
    }

    throw new Error(`구글 로그인 실패: ${error.message}`);
  }
}

/**
 * Apple 로그인 (iOS only)
 */
export async function loginWithApple(): Promise<SocialAuthResult> {
  if (Platform.OS !== 'ios') {
    throw new Error('Apple 로그인은 iOS에서만 지원됩니다');
  }

  try {
    // Apple 로그인 가능 여부 확인
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // 자격 증명 상태 확인
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    if (credentialState === appleAuth.State.AUTHORIZED) {
      return {
        provider: 'apple',
        accessToken: appleAuthRequestResponse.identityToken || '',
        user: {
          id: appleAuthRequestResponse.user,
          email: appleAuthRequestResponse.email,
          name: appleAuthRequestResponse.fullName?.givenName,
        },
      };
    }

    throw new Error('Apple 로그인 인증 실패');
  } catch (error: any) {
    console.error('Apple login error:', error);
    throw new Error(`Apple 로그인 실패: ${error.message}`);
  }
}

/**
 * 소셜 로그인 실행 (통합 함수)
 */
export async function socialLogin(
  provider: 'kakao' | 'naver' | 'google' | 'apple',
): Promise<SocialAuthResult> {
  switch (provider) {
    case 'kakao':
      return loginWithKakao();
    case 'naver':
      return loginWithNaver();
    case 'google':
      return loginWithGoogle();
    case 'apple':
      return loginWithApple();
    default:
      throw new Error('지원하지 않는 로그인 방식입니다');
  }
}
