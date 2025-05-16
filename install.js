let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    // Show the install button
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.className = 'install-button';
    installButton.textContent = '📱 Install App';
    installButton.addEventListener('click', installPWA);
    
    // Add to settings div
    const settings = document.querySelector('.settings');
    settings.insertBefore(installButton, settings.firstChild);
}

async function installPWA() {
    if (!deferredPrompt) {
        // The deferred prompt isn't available.
        return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // We no longer need the prompt. Clear it up.
    deferredPrompt = null;
    
    if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
    } else {
        console.log('User dismissed the install prompt');
    }
} 