// Bart Warrior App - Auto-refresh timer for poor reception areas
// Displays "Last updated" timestamp and auto-refreshes every 30 seconds

class BartApp {
  constructor() {
    this.currentStation = this.getStationFromPath();
    this.lastUpdateTime = null;
    this.refreshInterval = 30000; // 30 seconds
    this.timerInterval = null; // For countdown timer

    // Initialize the app
    this.init();
  }

  /**
   * Extract station code from current URL path
   */
  getStationFromPath() {
    const path = window.location.pathname;
    if (path === '/' || path === '') {
      return '19th'; // default station
    }
    return path.substring(1); // remove leading slash
  }

  /**
   * Initialize the app
   */
  init() {
    console.log('[BartApp] Initializing for station:', this.currentStation);

    // Initial timestamp display
    this.initializeTimestampDisplay();

    // Set up auto-refresh every 30 seconds (page auto-reloads in BART)
    this.setupAutoRefresh();

    // Start timer that updates the "time since last refresh" display
    this.startTimerDisplay();
  }

  /**
   * Initialize timestamp display element if it doesn't exist
   */
  initializeTimestampDisplay() {
    if (!document.getElementById('data-timestamp')) {
      const headerContainer = document.querySelector('header') || document.body;
      const timestampEl = document.createElement('div');
      timestampEl.id = 'data-timestamp';
      timestampEl.className = 'text-center';
      timestampEl.style.fontSize = '0.9rem';
      timestampEl.style.color = '#6c757d';
      timestampEl.style.padding = '8px';
      timestampEl.style.marginTop = '8px';
      timestampEl.style.marginBottom = '8px';
      timestampEl.textContent = 'Loading...';
      headerContainer.appendChild(timestampEl);
    }
  }

  /**
   * Update timestamp display with current time
   */
  updateTimestampDisplay() {
    const timestampEl = document.getElementById('data-timestamp');
    if (timestampEl) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      this.lastUpdateTime = now;
      timestampEl.textContent = `Last updated: ${timeStr}`;
      timestampEl.classList.remove('stale');
    }
  }

  /**
   * Start a timer that updates the display showing seconds since last refresh
   */
  startTimerDisplay() {
    this.updateTimestampDisplay();

    // Update the display every second to show elapsed time
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.timerInterval = setInterval(() => {
      if (this.lastUpdateTime) {
        const now = new Date();
        const secondsElapsed = Math.floor((now - this.lastUpdateTime) / 1000);
        const timestampEl = document.getElementById('data-timestamp');
        
        if (timestampEl) {
          const timeStr = this.lastUpdateTime.toLocaleTimeString();
          timestampEl.textContent = `Last updated: ${timeStr} (${secondsElapsed}s ago)`;
          
          // Mark as stale if older than 60 seconds
          if (secondsElapsed > 60) {
            timestampEl.classList.add('stale');
          }
        }
      }
    }, 1000); // Update every second
  }

  /**
   * Set up auto-refresh of the page
   */
  setupAutoRefresh() {
    // For server-rendered pages, force a refresh every 30 seconds
    setInterval(() => {
      console.log('[BartApp] Auto-refreshing page');
      window.location.reload();
    }, this.refreshInterval);
  }
}

// Initialize the app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.bartApp = new BartApp();
  });
} else {
  window.bartApp = new BartApp();
}
