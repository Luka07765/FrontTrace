// globalTypingTracker.js
let hasTyped = false;
let isSaving = false;

export const getHasTyped = () => hasTyped;
export const setHasTyped = (val) => { hasTyped = val; };

