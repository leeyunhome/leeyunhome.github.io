const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const yamlContent = `meta:
  title: "leeyunhome Project Hub — 프로젝트 & 엔지니어링 생태계"

slides:
  # 1. 아젠다 / 오버뷰
  - title: "**leeyunhome Project Hub** — 엔지니어링 & AI 시스템"
    caption: "브라우저 기반 실용 도구부터 커널 계측·3D 비전·MLOps까지의 프로젝트 생태계"
    figure:
      type: agenda
      currentIndex: 0
      items:
        - "3D Graphics & Real2Sim (3DGS 뷰어 · Field2Scene · 물리 시뮬레이션)"
        - "Embedded Linux & Kernel Lab (Orin perf/ftrace · RPi 4B 6.12 커널)"
        - "Edge AI & MLOps (TensorRT 10.4배 가속 · YOLO11n + ByteTrack)"
        - "End-to-End AI Pipelines (Whisper 음성 전사 · Imagen 4 아트워크)"
        - "Zero-Server Web Tools (프런트엔드 로컬 처리 도구 · 관제 대시보드)"

  # 2. 3D 그래픽스 & Real2Sim
  - title: "**3D Graphics & Real2Sim** — 렌더링부터 물리 시뮬레이션"
    caption: "3D Gaussian Splatting 기반 가상 데이터 생성과 C++17 의상 물리 엔진"
    figure:
      type: compare
      columns:
        - label: "Field2Scene (Real2Sim)"
          sub: "3DGS + YOLO-World 파이프라인"
          color: blue
          lines:
            - "실외·농업 온실 씬 3DGS 고품질 3D 재구성"
            - "held-out test PSNR 30.73dB 달성"
            - "로봇 주행 시점 합성 데이터 350장 생성"
            - "실촬영 대비 검출 갭 recall 0.909 검증"
          value: "PSNR 30.73dB"
        - label: "Cloth Lab (의상 시뮬레이션)"
          sub: "C++17 + WebGL2 / GLSL"
          color: purple
          lines:
            - "Mass-spring 모델을 처음부터 자체 구현"
            - "단위 테스트 290개로 검증된 C++17 코어"
            - "외부 라이브러리 없는 raw WebGL2 직조 셰이더"
            - "브라우저에서 실시간 인터랙티브 드래그·파망"
          value: "290개 단위 테스트"
      resultBox:
        lines:
          - "시각적 표현을 넘어 데이터 생성 및 물리 법칙 시뮬레이션까지 자체 구현"

  # 3. 임베디드 리눅스 & 커널 랩
  - title: "**Embedded Linux & Kernel** — 실기기 기반 계측과 디버깅"
    caption: "시뮬레이터를 넘어 실물 하드웨어와 커널 내부를 직접 파헤치는 실측 엔지니어링"
    figure:
      type: compare
      columns:
        - label: "Jetson Orin 프로파일링"
          sub: "L4T 커스텀 커널 계측"
          color: green
          lines:
            - "PMU 하드웨어 카운터 기반 perf 실측"
            - "CPU 워크로드 IPC 3.37 / 분기미스 0.01%"
            - "ftrace 및 화염 그래프 핫스팟 분석"
            - "5회 반복 측정으로 단발성 측정 착시 규명"
          value: "IPC 3.37 실측"
        - label: "RPi 4B 커널 랩"
          sub: "커널 6.12 aarch64 소스 빌드"
          color: blue
          lines:
            - "책(Pi 3B 32bit)과 실제(Pi 4B 64bit) 갭 해결"
            - "ARM 표준 GICv2 인터럽트 체계 디버깅"
            - "ftrace irq_handler_entry/exit 시간 측정"
            - "sysfs 기반 irq_desc 동적 조회"
          value: "64-bit 커널 빌드"
      resultBox:
        lines:
          - "46대 임베디드 디바이스 자동화 테스트 팜(점검 시간 8분→11초) 경험과 유기적 연결"

  # 4. Edge AI & MLOps
  - title: "**Edge AI & MLOps** — 실시간 추론 극대화 및 지연 정복"
    caption: "Jetson Orin 실기기에서 양자화·추적·파이프라인 최적화 성능을 직접 증명"
    figure:
      type: compare
      columns:
        - label: "ResNet-18 가속 비교"
          sub: "PyTorch vs INT8 양자화"
          color: purple
          lines:
            - "TensorRT INT8: PyTorch 대비 10.4배 가속"
            - "CPU INT8 양자화: 크기 1/4 감소 불구 16% 지연"
            - "타깃 HW 가속기 유무에 따른 실측 차이 규명"
            - "엔진 벤치마크 파이프라인 자동화"
          value: "10.4배 가속 달성"
        - label: "이동 카메라 객체 계수"
          sub: "YOLO11n + ByteTrack"
          color: blue
          lines:
            - "프레임 합산의 9.4배 중복 계수 오차 교정"
            - "검출 → 추적 → 중복 제거 파이프라인 구축"
            - "TensorRT FP16 적용: 30 → 135 FPS 달성"
            - "4.4배 FPS 향상으로 실시간 엣지 파이프라인 완성"
          value: "30 → 135 FPS"
      resultBox:
        lines:
          - "단순 모델 훈련에 그치지 않고 타깃 임베디드 엣지 환경에 최적화하여 수치로 검증"

  # 5. AI 파이프라인 & 멀티모달
  - title: "**End-to-End AI Pipelines** — 수집·전사부터 배포까지"
    caption: "Whisper 전사, 음악·대화 분리, Imagen 4 아트워크 생성 전 과정 자동화"
    figure:
      type: pipeline
      steps:
        - label: "라디오 수집"
          sub: "자동 다운로드 & 동기화"
          color: slate
        - label: "음성 전사"
          sub: "faster-whisper large-v3"
          color: blue
        - label: "구간 분리"
          sub: "inaSpeechSegmenter"
          color: purple
        - label: "아트워크 생성"
          sub: "Google Imagen 4"
          color: green
        - label: "웹 플레이어"
          sub: "자막 싱크 브라우저 배포"
          color: blue
      highlight: 1

  # 6. 제로서버 웹 도구 & 모니터링
  - title: "**Zero-Server Web Tools** — 브라우저 로컬 컴퓨팅"
    caption: "서버 전송 없이 사용자의 브라우저 내에서 안전하고 빠르게 동작하는 실용 도구군"
    figure:
      type: compare
      columns:
        - label: "엣지 & 금융 관제"
          sub: "Edge Monitor & StockPulse"
          color: blue
          lines:
            - "디바이스·로봇 플릿 실시간 텔레메트리 대시보드"
            - "온·오프라인 상태 / 원격 재시작 / 알람 제어"
            - "Yahoo Finance 실시간 차트 & 캔들 시황 분석"
            - "순수 프런트엔드 구현으로 가볍고 신속한 반응"
          value: "실시간 관제 대시보드"
        - label: "보안형 로컬 미니 도구"
          sub: "PDF Pro · Image Resizer · CountFlow"
          color: green
          lines:
            - "PDF 병합·분리: 파일이 기기를 벗어나지 않는 안전성"
            - "Smart Image Resizer: 브라우저 로컬 캔버스 리사이즈"
            - "CountFlow: 한글 2byte/단어/공백 동시 정밀 계측"
            - "서버 비용 0원, 프라이버시 침해 0%"
          value: "100% 로컬 처리"
      resultBox:
        lines:
          - "사용자 프라이버시를 보장하면서도 즉각적인 유용성을 제공하는 실용 웹 도구 설계"

  # 7. 엔지니어링 철학
  - title: '**엔지니어링 철학** — "도구가 없으면 직접 만든다"'
    caption: "가설에 머무르지 않고 직접 측정·도구화하여 숫자로 성능과 신뢰성을 증명합니다."
    figure:
      type: conclusionBar
      label: "Core Value"
      text: "도구가 없으면 직접 만들고, 추측 대신 실측 데이터로 증명하며, 시스템의 깊은 계층까지 파고듭니다."
`;

const targetYaml = 'c:/coding/my-github-repository/myslide/examples/hub_overview.yaml';
fs.writeFileSync(targetYaml, yamlContent, 'utf-8');
console.log('YAML written to', targetYaml);

// Build slide
const cliPath = 'c:/coding/my-github-repository/myslide/src/cli.js';
const distDir = 'c:/coding/my-github-repository/myslide/dist';
execSync(`node "${cliPath}" build "${targetYaml}" -o "${distDir}"`, { stdio: 'inherit' });
console.log('Build completed.');

// Copy to leeyunhome.github.io/slides/hub-overview.html
const slidesDir = path.join(__dirname, '../slides');
if (!fs.existsSync(slidesDir)) {
  fs.mkdirSync(slidesDir, { recursive: true });
}
const srcHtml = path.join(distDir, 'hub_overview.html');
const destHtml = path.join(slidesDir, 'hub-overview.html');
fs.copyFileSync(srcHtml, destHtml);
console.log(`Copied ${srcHtml} -> ${destHtml}`);
