/**
 * Google Analytics service for tracking user interactions
 */

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export class AnalyticsService {
  private static instance: AnalyticsService;
  private isEnabled: boolean = false;

  private constructor() {
    // Wait for gtag to load, check periodically
    this.waitForGtag();
  }

  private waitForGtag(): void {
    const checkGtag = () => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        this.isEnabled = true;
        console.log('✅ Google Analytics loaded successfully');
        return;
      }
      
      // Check again after a short delay
      setTimeout(checkGtag, 100);
    };

    // Start checking immediately
    checkGtag();
    
    // Set a timeout to stop trying after 5 seconds
    setTimeout(() => {
      if (!this.isEnabled) {
        console.warn('⚠️ Google Analytics failed to load after 5 seconds');
        console.warn('This could be due to:');
        console.warn('1. Ad blocker blocking Google Analytics');
        console.warn('2. Network connectivity issues');
        console.warn('3. Script loading problems');
        
        // For development, create a mock gtag for testing
        const isDev = typeof window !== 'undefined' && window.location.hostname === 'localhost';
        if (isDev) {
          console.log('🔧 Creating mock gtag for development testing');
          window.gtag = (...args: any[]) => {
            console.log('📊 Mock GA Event:', args);
          };
          this.isEnabled = true;
        }
      }
    }, 5000);
  }

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Track page views (automatic with GA4)
   */
  trackPageView(pageName: string): void {
    if (!this.isEnabled) return;
    
    window.gtag('config', 'G-N22E7N1BGL', {
      page_title: pageName,
      page_location: window.location.href
    });
  }

  /**
   * Track skin toggle events
   */
  trackSkinToggle(championName: string, newState: boolean): void {
    if (!this.isEnabled) return;
    
    window.gtag('event', 'skin_toggle', {
      champion_name: championName,
      new_state: newState ? 'owned' : 'not_owned',
      event_category: 'collection'
    });
  }

  /**
   * Track shard toggle events
   */
  trackShardToggle(championName: string, newState: boolean): void {
    if (!this.isEnabled) return;
    
    window.gtag('event', 'shard_toggle', {
      champion_name: championName,
      new_state: newState ? 'owned' : 'not_owned',
      event_category: 'collection'
    });
  }

  /**
   * Track search usage
   */
  trackSearch(searchQuery: string): void {
    if (!this.isEnabled) return;
    
    window.gtag('event', 'search', {
      search_term: searchQuery,
      event_category: 'navigation'
    });
  }

  /**
   * Track filter usage
   */
  trackFilterChange(filterType: string): void {
    if (!this.isEnabled) return;
    
    window.gtag('event', 'filter_change', {
      filter_type: filterType,
      event_category: 'navigation'
    });
  }

  /**
   * Track champion data updates
   */
  trackChampionUpdate(championCount: number, newChampions: number): void {
    if (!this.isEnabled) return;
    
    window.gtag('event', 'champion_update', {
      total_champions: championCount,
      new_champions: newChampions,
      event_category: 'data'
    });
  }

  /**
   * Track collection milestones
   */
  trackMilestone(milestoneType: string, value: number): void {
    if (!this.isEnabled) return;
    
    window.gtag('event', 'milestone_reached', {
      milestone_type: milestoneType,
      value: value,
      event_category: 'achievement'
    });
  }

  /**
   * Track collection completion percentage
   */
  trackCollectionProgress(percentage: number): void {
    if (!this.isEnabled) return;
    
    // Only track major milestones to avoid spam
    const milestones = [10, 25, 50, 75, 90, 95, 100];
    const milestone = milestones.find(m => percentage >= m && percentage < m + 1);
    
    if (milestone) {
      window.gtag('event', 'collection_milestone', {
        completion_percentage: milestone,
        event_category: 'achievement'
      });
    }
  }

  /**
   * Track errors
   */
  trackError(errorType: string, errorMessage: string): void {
    if (!this.isEnabled) return;
    
    window.gtag('event', 'exception', {
      description: `${errorType}: ${errorMessage}`,
      fatal: false
    });
  }

  /**
   * Track app initialization
   */
  trackAppInit(championCount: number, collectionSize: number): void {
    if (!this.isEnabled) return;
    
    window.gtag('event', 'app_initialized', {
      champion_count: championCount,
      collection_size: collectionSize,
      event_category: 'app_lifecycle'
    });
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance();