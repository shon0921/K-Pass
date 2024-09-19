// 로딩 애니메이션 최소 표시 시간 (밀리초 단위)
const MIN_LOADING_TIME = 700; // 0.7초

// 시작 시간 기록
let startTime;

// 로고 이미지 로드 여부를 추적
let logoLoaded = false;

// 로딩 모달을 보이게 하는 함수
function showLoading() {
    startTime = new Date().getTime(); // 로딩 시작 시간 기록
    const loadingModal = document.getElementById('loading-modal');
    loadingModal.style.display = 'flex';

    // 브라우저가 애니메이션을 적용할 시간을 주기 위해 약간의 지연 시간을 추가
    setTimeout(() => {
        document.querySelector('.rotating-logo').style.animation = 'rotate 2s linear infinite';
    }, 100); // 100ms 지연

    console.log('Loading animation shown.');
}

// 로딩 모달을 숨기는 함수 (최소 표시 시간 보장)
function hideLoading() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;

    if (elapsedTime >= MIN_LOADING_TIME) {
        document.getElementById('loading-modal').style.display = 'none';
        console.log('Loading animation hidden.');
    } else {
        setTimeout(() => {
            document.getElementById('loading-modal').style.display = 'none';
            console.log('Loading animation hidden after delay.');
        }, MIN_LOADING_TIME - elapsedTime);
    }
}

// 이미지 로드 시점 처리
function loadImageAndShowLoading() {
    const img = document.querySelector('.rotating-logo');

    // 이미지가 이미 캐시된 경우 onload 이벤트가 호출되지 않으므로 처리
    if (img.complete) {
        logoLoaded = true;
        showLoading(); // 이미지가 이미 로드되었다면 애니메이션 바로 표시
    } else {
        // 이미지가 로드된 후에 애니메이션 표시
        img.onload = function() {
            logoLoaded = true;
            showLoading();
        };
    }
}

// 페이지 로드 및 데이터 로드 완료 시 처리
window.onload = function() {
    // 로고 이미지가 제대로 로드되었는지 확인
    loadImageAndShowLoading();

    // 비동기 데이터 로드 (샘플 API 호출)
    const dataLoadPromise = fetch('https://api.example.com/data')
        .then(response => response.json())
        .then(data => console.log('Data loaded:', data))
        .catch(error => console.error('Error loading data:', error));

    // 데이터와 페이지 로드 완료 후 로딩 애니메이션 숨기기
    Promise.all([dataLoadPromise])
        .then(() => {
            if (logoLoaded) {
                hideLoading();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            hideLoading(); // 오류 발생 시에도 로딩 애니메이션 숨김
        });
};
