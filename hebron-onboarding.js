// ========================================
// Hebron 간소화 온보딩 + 기기 간 동기화
// 120% 완성형 v2.0 - 2026.02.06
// ========================================

console.log('🎯 Hebron 온보딩 스크립트 로드됨');

// 기존 showProfileSetup 백업
if (typeof window.showProfileSetup !== 'undefined') {
    window.showProfileSetup_ORIGINAL = window.showProfileSetup;
    console.log('✅ 기존 showProfileSetup 백업 완료');
}

// 언어별 텍스트
const onboardingLang = {
    ko: {
        step1_title: '환영합니다!',
        step1_subtitle: '하나님의 음성을 듣는<br>21일 여정을 시작합니다',
        anonymous_warning: '익명 로그인 중',
        anonymous_msg: '이 기기에서만 사용 가능합니다.',
        name_label: '이름',
        email_label: '이메일',
        name_placeholder: '이름을 입력하세요',
        anonymous_user: '익명 사용자',
        next_step: '다음 단계 →',
        step2_title: '목장 등록',
        step2_subtitle: '목장 식구들과 함께<br>21일 경청 훈련을 시작합니다! 🎯',
        mokjang_code_label: '목장 코드',
        mokjang_code_placeholder: '예: GMCHC301',
        verify_btn: '🔍 확인',
        mokjang_help_title: '💡 목장 코드 안내',
        mokjang_help_content: '• 어린이: GMCHC001<br>• 청소년: GMCHC101<br>• 청년: GMCHC201<br>• 이스라엘: GMCHC301<br>• 멕시코: GMCHC302<br>• 인도네시아: GMCHC303',
        verified_mokjang: '확인된 목장',
        journey_label: '📍 나의 신앙 위치',
        journey_optional: '(선택사항)',
        journey_seeker: '예수님을 찾아가는 중 (구도자)',
        journey_believer: '예수님을 믿기 시작함 (신자)',
        journey_disciple: '예수님을 따르는 제자',
        servant_role_label: '섬김 역할',
        servant_mokja: '목자 (가정교회 개척자)',
        servant_moknyeo: '목녀 (목자의 동역자)',
        servant_mokbu: '목부 (목자들의 목자)',
        servant_pastor: '대표목사',
        prev_step: '← 이전',
        complete_btn: '등록 완료! 🎉',
        name_required: '이름을 입력해주세요.',
        code_required: '목장 코드를 입력하세요',
        verifying: '🔍 확인 중...',
        verified: '✅ 확인 완료!',
        not_found: '❌ 존재하지 않는 목장 코드입니다',
        verify_failed: '❌ 확인 실패: ',
        verify_mokjang: '목장 코드를 확인해주세요.',
        success_title: '🎉 등록이 완료되었습니다!',
        success_msg: '21일 경청 훈련이 시작되었습니다.\n\n이제 랩탑, 셀폰 어디서나\n같은 계정으로 사용 가능합니다!',
        error: '❌ 등록 실패: ',
        syncing: '☁️ 동기화 중...',
        sync_complete: '✅ 모든 기기와 동기화 완료!'
    },
    en: {
        step1_title: 'Welcome!',
        step1_subtitle: 'Start your 21-day journey<br>to hear God\'s voice',
        anonymous_warning: 'Anonymous Login',
        anonymous_msg: 'Available on this device only.',
        name_label: 'Name',
        email_label: 'Email',
        name_placeholder: 'Enter your name',
        anonymous_user: 'Anonymous User',
        next_step: 'Next Step →',
        step2_title: 'House Church Registration',
        step2_subtitle: 'Start the 21-day listening training<br>with your Mokjang family! 🎯',
        mokjang_code_label: 'House Church Code',
        mokjang_code_placeholder: 'e.g., GMCHC301',
        verify_btn: '🔍 Verify',
        mokjang_help_title: '💡 House Church Codes',
        mokjang_help_content: '• Kids: GMCHC001<br>• Youth: GMCHC101<br>• Young Adult: GMCHC201<br>• Israel: GMCHC301<br>• Mexico: GMCHC302<br>• Indonesia: GMCHC303',
        verified_mokjang: 'Verified House Church',
        journey_label: '📍 My Faith Journey',
        journey_optional: '(optional)',
        journey_seeker: 'Seeking Jesus (Seeker)',
        journey_believer: 'Believing in Jesus (Believer)',
        journey_disciple: 'Following Jesus (Disciple)',
        servant_role_label: 'Ministry Role',
        servant_mokja: 'Shepherd (House Church Planter)',
        servant_moknyeo: 'Co-Shepherd',
        servant_mokbu: 'Shepherd of Shepherds',
        servant_pastor: 'Senior Pastor',
        prev_step: '← Previous',
        complete_btn: 'Complete Registration! 🎉',
        name_required: 'Please enter your name.',
        code_required: 'Please enter house church code',
        verifying: '🔍 Verifying...',
        verified: '✅ Verified!',
        not_found: '❌ Invalid house church code',
        verify_failed: '❌ Verification failed: ',
        verify_mokjang: 'Please verify house church code.',
        success_title: '🎉 Registration Complete!',
        success_msg: '21-day listening training has started.\n\nYou can now use this account\non all your devices!',
        error: '❌ Registration failed: ',
        syncing: '☁️ Syncing...',
        sync_complete: '✅ Synced across all devices!'
    }
};

function getOnboardingLang() {
    return typeof curLang !== 'undefined' && curLang === 'en' ? 'en' : 'ko';
}

function t(key) {
    const lang = getOnboardingLang();
    return onboardingLang[lang][key] || onboardingLang['ko'][key];
}

// 새로운 showProfileSetup 함수
window.showProfileSetup = async function(user, isAnonymous = false, defaultName = '') {
    console.log('🚀 showProfileSetup 호출됨', { user: user.email, isAnonymous });
    
    const anonymousWarning = isAnonymous ? `
        <div style="background: #FFF3E0; border-left: 4px solid #FF9800; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
            <div style="font-weight: 600; color: #E65100; margin-bottom: 5px;">⚠️ ${t('anonymous_warning')}</div>
            <div style="font-size: 1rem; color: #666;">${t('anonymous_msg')}</div>
        </div>
    ` : '';
    
    window.onboardingData = {
        step: 1,
        name: '',
        email: user.email || '',
        journey: null,
        mokjangCode: '',
        mokjangName: '',
        servantRole: '',
        mokjangVerified: false
    };
    
    const setupHTML = `
        <div id="profile-setup" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; 
             background: rgba(0,0,0,0.85); display: flex; justify-content: center; align-items: center; 
             z-index: 10000; overflow-y: auto; padding: 20px; backdrop-filter: blur(5px);">
            <div style="background: white; border-radius: 24px; padding: 35px; max-width: 520px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
                
                <!-- Step 1: 기본 정보 -->
                <div id="onboarding-step-1">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
                        <h2 style="color: #1F4788; margin: 0 0 10px 0; font-size: 2rem; font-weight: 800;" class="onboarding-step1-title">${t('step1_title')}</h2>
                        <p style="color: #666; font-size: 1rem; line-height: 1.6; margin: 0;" class="onboarding-step1-subtitle">${t('step1_subtitle')}</p>
                    </div>
                    
                    ${anonymousWarning}
                    
                    <div style="margin-bottom: 22px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 1rem;">
                            <span class="onboarding-name-label">${t('name_label')}</span> <span style="color: #f44336; font-size: 1.1rem;">*</span>
                        </label>
                        <input type="text" id="onboarding-name" value="${defaultName || user.displayName || ''}" 
                               placeholder="${t('name_placeholder')}"
                               style="width: 100%; padding: 15px; border: 2px solid #ddd; border-radius: 12px; font-size: 1.05rem; transition: all 0.2s;"
                               onfocus="this.style.borderColor='#1F4788'"
                               onblur="this.style.borderColor='#ddd'">
                    </div>
                    
                    <div style="margin-bottom: 28px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 1rem;" class="onboarding-email-label">${t('email_label')}</label>
                        <input type="email" value="${user.email || t('anonymous_user')}" readonly
                               style="width: 100%; padding: 15px; border: 2px solid #e8e8e8; border-radius: 12px; font-size: 1.05rem; background: #f8f9fa; color: #666; cursor: not-allowed;">
                        <div style="margin-top: 8px; font-size: 0.85rem; color: #1F4788; display: flex; align-items: center; gap: 5px;">
                            <svg width="16" height="16" fill="currentColor"><path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm1 12H7V7h2v5zm0-6H7V4h2v2z"/></svg>
                            <span>이 이메일로 모든 기기에서 사용 가능합니다</span>
                        </div>
                    </div>
                    
                    <button onclick="goToOnboardingStep2()" 
                            style="width: 100%; padding: 18px; background: linear-gradient(135deg, #1F4788 0%, #0d2347 100%); color: white; border: none; border-radius: 14px; font-weight: 700; font-size: 1.15rem; cursor: pointer; box-shadow: 0 6px 20px rgba(31,71,136,0.35); transition: all 0.3s;"
                            onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(31,71,136,0.45)'"
                            onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(31,71,136,0.35)'"
                            class="onboarding-next-btn">${t('next_step')}</button>
                </div>
                
                <!-- Step 2: 목장 등록 -->
                <div id="onboarding-step-2" style="display: none;">
                    <div style="text-align: center; margin-bottom: 25px;">
                        <div style="font-size: 3rem; margin-bottom: 15px;">🏠</div>
                        <h2 style="color: #1F4788; margin: 0 0 10px 0; font-size: 2rem; font-weight: 800;" class="onboarding-step2-title">${t('step2_title')}</h2>
                        <div style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); padding: 16px; border-radius: 12px; margin-top: 15px;">
                            <p style="color: #1565C0; font-size: 0.95rem; line-height: 1.7; font-weight: 500; margin: 0;" class="onboarding-step2-subtitle">${t('step2_subtitle')}</p>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 1rem;">
                            <span class="onboarding-mokjang-label">${t('mokjang_code_label')}</span> <span style="color: #f44336; font-size: 1.1rem;">*</span>
                        </label>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="onboarding-mokjang-code" placeholder="${t('mokjang_code_placeholder')}"
                                   style="flex: 1; padding: 15px; border: 2px solid #ddd; border-radius: 12px; font-size: 1.05rem; text-transform: uppercase; transition: all 0.2s;"
                                   onfocus="this.style.borderColor='#1F4788'" onblur="this.style.borderColor='#ddd'">
                            <button onclick="verifyOnboardingMokjang()" 
                                    style="padding: 15px 26px; background: #1F4788; color: white; border: none; border-radius: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; font-size: 1.05rem; transition: all 0.2s;"
                                    onmouseover="this.style.background='#0d2347'" onmouseout="this.style.background='#1F4788'"
                                    class="onboarding-verify-btn">${t('verify_btn')}</button>
                        </div>
                        <div id="onboarding-mokjang-verify" style="margin-top: 10px; font-size: 0.95rem;"></div>
                        <details style="margin-top: 12px;">
                            <summary style="cursor: pointer; color: #1F4788; font-size: 0.9rem; font-weight: 600;" class="onboarding-help-title">${t('mokjang_help_title')}</summary>
                            <div style="font-size: 0.85rem; color: #666; margin-top: 10px; line-height: 1.8; background: #f8f9fa; padding: 12px; border-radius: 8px;" class="onboarding-help-content">
                                ${t('mokjang_help_content')}
                            </div>
                        </details>
                    </div>
                    
                    <div id="onboarding-mokjang-display" style="display: none; margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 1rem;" class="onboarding-verified-label">${t('verified_mokjang')}</label>
                        <div style="background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); border: 2px solid #4CAF50; padding: 16px; border-radius: 12px; font-weight: 600; color: #2E7D32; font-size: 1.05rem;">
                            ✅ <span id="onboarding-mokjang-name">-</span>
                        </div>
                    </div>
                    
                    <!-- 신앙 위치 (선택사항) -->
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 1rem;">
                            <span class="onboarding-journey-label">${t('journey_label')}</span> <span style="font-size: 0.85rem; color: #999; font-weight: 400;" class="onboarding-optional">${t('journey_optional')}</span>
                        </label>
                        <div style="background: #f8f9fa; padding: 14px; border-radius: 12px; border: 2px solid #e8e8e8;">
                            <div style="display: grid; gap: 10px;">
                                ${createJourneyRadio('seeker', 'journey_seeker', '🌱')}
                                ${createJourneyRadio('believer', 'journey_believer', '🌿')}
                                ${createJourneyRadio('disciple', 'journey_disciple', '🌳')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- 섬김 역할 (제자 선택 시만) -->
                    <div id="onboarding-servant-role" style="display: none; margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333; font-size: 1rem;">
                            <span class="onboarding-servant-label">${t('servant_role_label')}</span> <span style="font-size: 0.85rem; color: #999; font-weight: 400;" class="onboarding-optional">${t('journey_optional')}</span>
                        </label>
                        <div style="background: #FFFBF0; padding: 14px; border-radius: 12px; border: 2px solid #FFB300;">
                            <div style="display: grid; gap: 10px;">
                                ${createServantRadio('mokja', 'servant_mokja')}
                                ${createServantRadio('moknyeo', 'servant_moknyeo')}
                                ${createServantRadio('mokbu', 'servant_mokbu')}
                                ${createServantRadio('pastor', 'servant_pastor')}
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 10px;">
                        <button onclick="goToOnboardingStep1()" 
                                style="flex: 1; padding: 16px; background: #f5f5f5; color: #666; border: 2px solid #ddd; border-radius: 12px; font-weight: 600; font-size: 1.05rem; cursor: pointer; transition: all 0.2s;"
                                onmouseover="this.style.background='#e8e8e8'"
                                onmouseout="this.style.background='#f5f5f5'"
                                class="onboarding-prev-btn">${t('prev_step')}</button>
                        <button onclick="completeSimplifiedOnboarding()" 
                                style="flex: 2; padding: 16px; background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%); color: white; border: none; border-radius: 12px; font-weight: 700; font-size: 1.05rem; cursor: pointer; box-shadow: 0 6px 20px rgba(76,175,80,0.35); transition: all 0.3s;"
                                onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 8px 25px rgba(76,175,80,0.45)'"
                                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 6px 20px rgba(76,175,80,0.35)'"
                                class="onboarding-complete-btn">${t('complete_btn')}</button>
                    </div>
                </div>
                
            </div>
        </div>
    `;
    
    // HTML 삽입
    document.body.insertAdjacentHTML('beforeend', setupHTML);
    console.log('✅ 온보딩 HTML 삽입 완료');
    
    // 헬퍼 함수들을 함수 안에서 정의
    function createJourneyRadio(value, textKey, icon) {
        return `
            <label style="display: flex; align-items: center; padding: 14px; background: white; border: 2px solid #ddd; border-radius: 10px; cursor: pointer; transition: all 0.2s;" 
                   onmouseover="this.style.borderColor='#1F4788'; this.style.background='#f0f4ff'" 
                   onmouseout="this.style.borderColor='#ddd'; this.style.background='white'">
                <input type="radio" name="journey" value="${value}" style="margin-right: 12px; width: 20px; height: 20px; cursor: pointer;"
                       onchange="window.onboardingData.journey='${value}'; if(window.updateServantRoleVisibility) window.updateServantRoleVisibility()">
                <div style="flex: 1;">
                    <span style="font-weight: 600; font-size: 1rem;" class="onboarding-journey-${value}">${icon} ${t(textKey)}</span>
                </div>
            </label>
        `;
    }
    
    function createServantRadio(value, textKey) {
        return `
            <label style="display: flex; align-items: center; padding: 12px; background: white; border: 2px solid #ddd; border-radius: 10px; cursor: pointer; transition: all 0.2s;" 
                   onmouseover="this.style.borderColor='#FFB300'; this.style.background='#FFFBF0'" 
                   onmouseout="this.style.borderColor='#ddd'; this.style.background='white'">
                <input type="radio" name="servant-role" value="${value}" style="margin-right: 10px; width: 18px; height: 18px; cursor: pointer;">
                <span style="font-weight: 600; font-size: 0.95rem;" class="onboarding-servant-${value}">${t(textKey)}</span>
            </label>
        `;
    }
};

// 헬퍼 함수들
window.updateServantRoleVisibility = function() {
    const servantRoleDiv = document.getElementById('onboarding-servant-role');
    if (servantRoleDiv && window.onboardingData.journey === 'disciple') {
        servantRoleDiv.style.display = 'block';
    } else if (servantRoleDiv) {
        servantRoleDiv.style.display = 'none';
    }
};

window.goToOnboardingStep1 = function() {
    document.getElementById('onboarding-step-1').style.display = 'block';
    document.getElementById('onboarding-step-2').style.display = 'none';
    window.onboardingData.step = 1;
};

window.goToOnboardingStep2 = function() {
    const name = document.getElementById('onboarding-name').value.trim();
    
    if (!name) {
        alert(t('name_required'));
        document.getElementById('onboarding-name').focus();
        return;
    }
    
    window.onboardingData.name = name;
    window.onboardingData.step = 2;
    
    document.getElementById('onboarding-step-1').style.display = 'none';
    document.getElementById('onboarding-step-2').style.display = 'block';
};

window.verifyOnboardingMokjang = async function() {
    const codeInput = document.getElementById('onboarding-mokjang-code');
    const verifyDiv = document.getElementById('onboarding-mokjang-verify');
    const displayDiv = document.getElementById('onboarding-mokjang-display');
    const nameSpan = document.getElementById('onboarding-mokjang-name');
    
    const code = codeInput.value.trim().toUpperCase();
    
    if (!code) {
        verifyDiv.innerHTML = `<span style="color:#f44336;">❌ ${t('code_required')}</span>`;
        return;
    }
    
    verifyDiv.innerHTML = `<span style="color:#2196F3;">${t('verifying')}</span>`;
    
    try {
        const doc = await db.collection('houseChurches').doc(code).get();
        
        if (doc.exists) {
            const data = doc.data();
            verifyDiv.innerHTML = `<span style="color:#4CAF50;">${t('verified')}</span>`;
            displayDiv.style.display = 'block';
            nameSpan.textContent = data.name;
            
            window.onboardingData.mokjangCode = code;
            window.onboardingData.mokjangName = data.name;
            window.onboardingData.mokjangVerified = true;
        } else {
            verifyDiv.innerHTML = `<span style="color:#f44336;">${t('not_found')}</span>`;
            displayDiv.style.display = 'none';
            window.onboardingData.mokjangVerified = false;
        }
    } catch (error) {
        console.error('목장 확인 에러:', error);
        verifyDiv.innerHTML = `<span style="color:#f44336;">${t('verify_failed')}${error.message}</span>`;
        window.onboardingData.mokjangVerified = false;
    }
};

window.completeSimplifiedOnboarding = async function() {
    const data = window.onboardingData;
    
    if (!data.mokjangVerified) {
        alert(t('verify_mokjang'));
        return;
    }
    
    // 신앙 위치 가져오기
    const journeyInput = document.querySelector('input[name="journey"]:checked');
    data.journey = journeyInput ? journeyInput.value : null;
    
    // 섬김 역할 가져오기
    data.servantRole = null;
    if (data.journey === 'disciple') {
        const servantInput = document.querySelector('input[name="servant-role"]:checked');
        data.servantRole = servantInput ? servantInput.value : null;
    }
    
    try {
        const user = firebase.auth().currentUser;
        
        console.log('☁️ Firebase에 데이터 저장 시작...');
        
        // users 컬렉션에 저장 (모든 기기에서 접근 가능)
        await db.collection('users').doc(user.uid).set({
            name: data.name,
            email: data.email,
            journey: data.journey,
            servantRole: data.servantRole,
            mokjangCode: data.mokjangCode,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            streak: 0,
            shareProgress: true,
            lastDevice: navigator.userAgent.includes('Mobile') ? 'mobile' : 'desktop',
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ users 컬렉션 저장 완료');
        
        // 목장 members에도 저장
        await db.collection('houseChurches')
            .doc(data.mokjangCode)
            .collection('members')
            .doc(user.uid)
            .set({
                userId: user.uid,
                name: data.name,
                email: data.email,
                journey: data.journey,
                servantRole: data.servantRole,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active',
                shareProgress: true,
                streak: 0
            });
        
        console.log('✅ 목장 members 저장 완료');
        
        // localStorage에 저장 (현재 기기에서 빠른 접근용)
        localStorage.setItem('hebron_user_name', data.name);
        localStorage.setItem('hebron_journey', data.journey || '');
        localStorage.setItem('hebron_servant_role', data.servantRole || '');
        localStorage.setItem('hebron_mokjang_code', data.mokjangCode);
        localStorage.setItem('hebron_21day_started', 'true');
        localStorage.setItem('hebron_21day_start_date', new Date().toISOString());
        localStorage.setItem('hebron_user_email', data.email);
        
        console.log('✅ localStorage 저장 완료');
        console.log('🎉 모든 저장 완료!');
        
        alert(`${t('success_title')}\n\n${t('success_msg')}`);
        
        document.getElementById('profile-setup').remove();
        location.reload();
        
    } catch (error) {
        console.error('❌ 등록 에러:', error);
        alert(`${t('error')}${error.message}`);
    }
};

// 언어 전환 시 온보딩 텍스트 업데이트
window.updateOnboardingLanguage = function() {
    const elements = {
        '.onboarding-step1-title': 'step1_title',
        '.onboarding-step1-subtitle': 'step1_subtitle',
        '.onboarding-name-label': 'name_label',
        '.onboarding-email-label': 'email_label',
        '.onboarding-next-btn': 'next_step',
        '.onboarding-step2-title': 'step2_title',
        '.onboarding-step2-subtitle': 'step2_subtitle',
        '.onboarding-mokjang-label': 'mokjang_code_label',
        '.onboarding-verify-btn': 'verify_btn',
        '.onboarding-help-title': 'mokjang_help_title',
        '.onboarding-help-content': 'mokjang_help_content',
        '.onboarding-verified-label': 'verified_mokjang',
        '.onboarding-journey-label': 'journey_label',
        '.onboarding-servant-label': 'servant_role_label',
        '.onboarding-prev-btn': 'prev_step',
        '.onboarding-complete-btn': 'complete_btn'
    };
    
    Object.keys(elements).forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.innerHTML = t(elements[selector]);
    });
    
    const optionals = document.querySelectorAll('.onboarding-optional');
    optionals.forEach(el => el.textContent = t('journey_optional'));
    
    // Journey 옵션들
    const journeySeeker = document.querySelector('.onboarding-journey-seeker');
    if (journeySeeker) journeySeeker.innerHTML = '🌱 ' + t('journey_seeker');
    
    const journeyBeliever = document.querySelector('.onboarding-journey-believer');
    if (journeyBeliever) journeyBeliever.innerHTML = '🌿 ' + t('journey_believer');
    
    const journeyDisciple = document.querySelector('.onboarding-journey-disciple');
    if (journeyDisciple) journeyDisciple.innerHTML = '🌳 ' + t('journey_disciple');
    
    // Servant roles
    const servants = {
        '.onboarding-servant-mokja': 'servant_mokja',
        '.onboarding-servant-moknyeo': 'servant_moknyeo',
        '.onboarding-servant-mokbu': 'servant_mokbu',
        '.onboarding-servant-pastor': 'servant_pastor'
    };
    
    Object.keys(servants).forEach(selector => {
        const el = document.querySelector(selector);
        if (el) el.textContent = t(servants[selector]);
    });
    
    // Placeholders
    const namePlaceholder = document.getElementById('onboarding-name');
    if (namePlaceholder) namePlaceholder.placeholder = t('name_placeholder');
    
    const codePlaceholder = document.getElementById('onboarding-mokjang-code');
    if (codePlaceholder) codePlaceholder.placeholder = t('mokjang_code_placeholder');
};

// 기존 toggleLang 함수에 온보딩 업데이트 추가
if (typeof toggleLang_ORIGINAL === 'undefined' && typeof toggleLang !== 'undefined') {
    window.toggleLang_ORIGINAL = toggleLang;
    toggleLang = function() {
        toggleLang_ORIGINAL();
        // 온보딩이 열려있으면 언어 업데이트
        if (document.getElementById('profile-setup')) {
            updateOnboardingLanguage();
        }
    };
}

console.log('✅ Hebron 온보딩 스크립트 초기화 완료!');
