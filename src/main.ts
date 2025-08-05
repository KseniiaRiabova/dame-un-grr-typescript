import './style.css';

class DameUnGrrApp {
  private currentStep: number = 0;
  private isPlaying: boolean = false;

  private readonly steps = [
    { text: 'DAME UN GRR', button: 'UN QUÉ? 🤔' },
    { text: 'DAME UN GRR', button: 'UN QUÉ, UN QUÉ?? 😵' },
    {
      text: 'DAME UN TU-TA-TA, TUTU-TA<br>TUKUTU-TA-TA-TU DAME UN GRR,RRAH',
      button: null,
    },
  ];

  private elements: {
    mainText: HTMLElement;
    actionButton: HTMLButtonElement;
    loadingIndicator: HTMLElement;
    videoContainer: HTMLElement;
    youtubeVideo: HTMLIFrameElement;
    closeVideoButton: HTMLButtonElement;
    playAgainButton: HTMLButtonElement;
    backgroundMusic: HTMLAudioElement;
  };

  constructor() {
    this.elements = {
      mainText: document.getElementById('mainText') as HTMLElement,
      actionButton: document.getElementById(
        'actionButton'
      ) as HTMLButtonElement,
      loadingIndicator: document.getElementById(
        'loadingIndicator'
      ) as HTMLElement,
      videoContainer: document.getElementById('videoContainer') as HTMLElement,
      youtubeVideo: document.getElementById(
        'youtubeVideo'
      ) as HTMLIFrameElement,
      closeVideoButton: document.getElementById(
        'closeVideoButton'
      ) as HTMLButtonElement,
      playAgainButton: document.getElementById(
        'playAgainButton'
      ) as HTMLButtonElement,
      backgroundMusic: document.getElementById(
        'backgroundMusic'
      ) as HTMLAudioElement,
    };

    this.init();
  }

  private init(): void {
    this.updateDisplay();

    this.elements.actionButton.addEventListener('click', () => this.nextStep());
    this.elements.closeVideoButton.addEventListener('click', () =>
      this.closeVideo()
    );
    this.elements.playAgainButton.addEventListener('click', () =>
      this.playAgain()
    );

    document.addEventListener('keydown', (e) => {
      if (
        e.key === 'Escape' &&
        this.elements.videoContainer.style.display !== 'none'
      ) {
        this.closeVideo();
      }
    });

    this.elements.actionButton.addEventListener(
      'click',
      () => this.tryPlayMusic(),
      { once: true }
    );
  }

  private tryPlayMusic(): void {
    this.elements.backgroundMusic.volume = 0.3;
    this.elements.backgroundMusic.play().catch(() => {
      // Autoplay blocked, will try again on next user interaction
      console.log('Background music autoplay was blocked');
    });
  }

  private nextStep(): void {
    this.currentStep++;

    if (this.currentStep >= this.steps.length) {
      this.showVideo();
      return;
    }

    this.updateDisplay();
  }

  private updateDisplay(): void {
    const step = this.steps[this.currentStep];

    const h1Element = this.elements.mainText.querySelector('h1')!;
    h1Element.innerHTML = step.text;

    if (this.currentStep === this.steps.length - 1) {
      h1Element.classList.add('final-text');
    } else {
      h1Element.classList.remove('final-text');
    }

    if (step.button) {
      this.elements.actionButton.textContent = step.button;
      this.elements.actionButton.style.display = 'inline-block';
    } else {
      this.elements.actionButton.style.display = 'none';
      // Show loading indicator and then video after 2 seconds
      setTimeout(() => {
        this.showLoadingIndicator();
        setTimeout(() => {
          this.showVideo();
        }, 3000);
      }, 1000);
    }

    this.animateText();
  }

  private animateText(): void {
    const textElement = this.elements.mainText.querySelector('h1')!;

    if (textElement.classList.contains('final-text')) {
      textElement.style.transform = 'translate(-50%, -50%) scale(0.8)';
      textElement.style.opacity = '0';

      setTimeout(() => {
        textElement.style.transform = 'translate(-50%, -50%) scale(1)';
        textElement.style.opacity = '1';
      }, 100);
    } else {
      textElement.style.transform = 'scale(0.8)';
      textElement.style.opacity = '0';

      setTimeout(() => {
        textElement.style.transform = 'scale(1)';
        textElement.style.opacity = '1';
      }, 100);
    }
  }

  private showLoadingIndicator(): void {
    this.elements.loadingIndicator.style.display = 'flex';
  }

  private hideLoadingIndicator(): void {
    this.elements.loadingIndicator.style.display = 'none';
  }

  private showVideo(): void {
    this.hideLoadingIndicator();

    const videoUrl =
      'https://www.youtube.com/embed/WN3t5L02B_I?si=-G3lvmfORlVZ6Un_&start=33&autoplay=1';
    this.elements.youtubeVideo.src = videoUrl;

    this.elements.videoContainer.style.display = 'flex';
    this.isPlaying = true;
  }

  private closeVideo(): void {
    this.elements.videoContainer.style.display = 'none';
    this.elements.youtubeVideo.src = '';
    this.isPlaying = false;
  }

  private playAgain(): void {
    this.closeVideo();
    this.currentStep = 0;
    this.updateDisplay();
  }
}

new DameUnGrrApp();
