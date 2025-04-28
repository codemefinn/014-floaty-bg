<script>
(function() {
  class FloatyBG {
    static scale = 10;         // How much the background moves based on cursor position
    static fraction = 0.1;     // Animation easing factor (controls how "smooth" the motion is)
    static targets = ['container26']; // Target elements by ID

    constructor({ target, isSetOnBg }) {
      this.container = target;
      if (!this.container) return;

      this.isSetOnBg = isSetOnBg; // Whether to apply styles using CSS variables (for ::before)

      // Target and current position values (in percentage offset)
      this.targetX = 0;
      this.targetY = 0;
      this.currentX = 0;
      this.currentY = 0;
      this.animating = false; // Tracks whether an animation loop is active

      this.animate = this.animate.bind(this); // Ensure "this" context is preserved

      this.container.classList.add('floaty-bg');
      this.addEventListener();
    }

    addEventListener() {
      // Listen to mouse movement inside the container
      this.container.addEventListener('mousemove', (e) => {
        e.stopPropagation(); 

        // Convert cursor position to a range around 0 using scale
        this.targetX = (e.clientX / window.innerWidth - 0.5) * FloatyBG.scale;
        this.targetY = (e.clientY / window.innerHeight - 0.5) * FloatyBG.scale;

        // Start animation loop if not already animating
        if (!this.animating) {
          this.animating = true;
          requestAnimationFrame(this.animate);
        }
      });
    }

    animate() {
      // Calculate how far current position is from target
      const dx = this.targetX - this.currentX;
      const dy = this.targetY - this.currentY;

      // Smoothly interpolate toward target (ease motion)
      this.currentX += dx * FloatyBG.fraction;
      this.currentY += dy * FloatyBG.fraction;

      // Update background position (use CSS variables or inline style)
      if (this.isSetOnBg) {
        this.container.style.setProperty('--bg-x', `${50 + this.currentX}%`);
        this.container.style.setProperty('--bg-y', `${50 + this.currentY}%`);
      } else {
        this.container.style.backgroundPosition = `${50 + this.currentX}% ${50 + this.currentY}%`;
      }

      // Keep animating until movement is nearly complete
      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        requestAnimationFrame(this.animate);
      } else {
        this.animating = false; // Stop loop if cursor is still
      }
    }

    // Initialize effect once DOM is ready
    static init() {
      FloatyBG.targets.forEach(id => {
        const isSetOnBg = id === 'body';

        // Inject CSS for ::before background control
        if (isSetOnBg) {
          const style = document.createElement('style');
          style.textContent = `
            body::before {
              background-position: var(--bg-x, 50%) var(--bg-y, 50%);
            }
          `;
          document.body.appendChild(style);
        }

        // Get target element (either document.body or by ID)
        const target = isSetOnBg ? document.body : document.getElementById(id);
        if (!target) return;

        // Create an instance for each target
        new FloatyBG({ target, isSetOnBg });
      });
    }
  }

  window.addEventListener('DOMContentLoaded', FloatyBG.init);
})();
</script>