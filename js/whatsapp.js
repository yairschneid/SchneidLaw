// Contact functionality
window.openWhatsAppChat = function() {
    const phoneNumber = '1234567890'; // Replace with your actual WhatsApp number
    const message = encodeURIComponent('Hello, I would like to schedule a consultation.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
};

window.openEmailClient = function() {
    const email = 'info@schneidlaw.com'; // Replace with your actual email
    const subject = encodeURIComponent('Consultation Request');
    const body = encodeURIComponent('Hello,\n\nI would like to schedule a consultation.');
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
};