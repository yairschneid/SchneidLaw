// Universal navigation function that tries Waze first, then falls back to Google Maps
function openNavigation(event) {
    event.preventDefault();
    
    // Replace these with your actual office coordinates
    const latitude = 32.0853;  // Example: Tel Aviv coordinates
    const longitude = 34.7818;
    const address = "123 Main Street"; // Your actual address
    
    // Detect if user is on mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Try Waze first (will open Waze app if installed)
        const wazeUrl = `waze://?ll=${latitude},${longitude}&navigate=yes`;
        
        // Attempt to open Waze
        const wazeWindow = window.open(wazeUrl, '_blank');
        
        // Fallback to Google Maps after a short delay if Waze doesn't open
        setTimeout(() => {
            // Check if we're on iOS or Android for the appropriate Google Maps URL
            const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isAndroid = /Android/i.test(navigator.userAgent);
            
            let googleMapsUrl;
            
            if (isIOS) {
                // iOS - Try to open Apple Maps or Google Maps app
                googleMapsUrl = `maps://maps.apple.com/?q=${encodeURIComponent(address)}&ll=${latitude},${longitude}`;
                // Alternative: Google Maps on iOS
                const altUrl = `comgooglemaps://?q=${latitude},${longitude}&center=${latitude},${longitude}&zoom=14`;
                
                // Try Apple Maps first
                window.location.href = googleMapsUrl;
                
                // Fallback to Google Maps web if app not installed
                setTimeout(() => {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
                }, 500);
            } else if (isAndroid) {
                // Android - Try Google Maps app, fallback to web
                googleMapsUrl = `google.navigation:q=${latitude},${longitude}`;
                window.location.href = googleMapsUrl;
                
                // Fallback to Google Maps web
                setTimeout(() => {
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
                }, 500);
            } else {
                // Other mobile devices - use web version
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
            }
        }, 1500); // Give Waze 1.5 seconds to open
        
    } else {
        // Desktop - Open Waze web or Google Maps
        const wazeWebUrl = `https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes&zoom=17`;
        const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        
        // Open Waze web in new tab
        const wazeTab = window.open(wazeWebUrl, '_blank');
        
        // If popup was blocked or user prefers Google Maps, they can click again
        if (!wazeTab) {
            window.open(googleMapsUrl, '_blank');
        }
    }
}

// Alternative simpler function that shows options to user
function openNavigationWithOptions(event) {
    event.preventDefault();
    
    const latitude = 32.0853;
    const longitude = 34.7818;
    const address = "123 Main Street";
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Create a simple selection modal (you can style this better)
        const choice = confirm("Open in Waze? (Cancel for Google Maps)");
        
        if (choice) {
            // Open Waze
            window.location.href = `waze://?ll=${latitude},${longitude}&navigate=yes`;
            // Fallback
            setTimeout(() => {
                window.open(`https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes`, '_blank');
            }, 1000);
        } else {
            // Open Google Maps
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`, '_blank');
        }
    } else {
        // Desktop - just open Waze web
        window.open(`https://www.waze.com/ul?ll=${latitude}%2C${longitude}&navigate=yes&zoom=17`, '_blank');
    }
}
