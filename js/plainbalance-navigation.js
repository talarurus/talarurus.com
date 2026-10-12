// Keep the mobile header stable while the shared menu script initializes.
// Restore the normal no-script navigation if that script fails to load.
document.documentElement.classList.add('plainbalance-enhancing');
document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.remove('plainbalance-enhancing');
});
