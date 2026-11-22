(function (window) {
  "use strict";

  const optimizer = {
    isLowDetailModeEnabled() {
      return window.enableLDM === true;
    },
    shouldHideDecoration() {
      return window.hideDecorationForPerformance === true;
    },
    applyToLevel(level) {
      if (!level) return;
      level._updateGlowVisibility?.();
      level._updateDecorationVisibility?.();
    }
  };

  window.PerformanceOptimizer = optimizer;
})(window);
