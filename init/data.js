const galleryImages = [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1505692952047-1a78307da8f2?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1464890100898-a385f744067f?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=60",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=800&q=60"
];

function imageAt(index) {
    return {
        filename: "listingimage",
        url: galleryImages[index % galleryImages.length]
    };
}

const sampleListings = [
    // --- LONDON ---
    {
        title: "The London Ritz",
        description: "शाही ठाठ-बाठ और लंदन की सबसे आलीशान जगह।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=2070",
        },
        price: 25000,
        location: "Piccadilly",
        country: "United Kingdom",
    },
    {
        title: "Thames View Apartment",
        description: "खिड़की खोलता ही थेम्स नदी को नज़ारा।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?q=80&w=2070",
        },
        price: 18000,
        location: "Southbank",
        country: "United Kingdom",
    },

    // --- CANADA ---
    {
        title: "Snowy Peak Lodge",
        description: "कनाडा की ठंडी पहाड़ियां और स्कीइंग को मज़ो।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070",
        },
        price: 9000,
        location: "Whistler",
        country: "Canada",
    },
    {
        title: "Ontario Lake House",
        description: "झील के किनारे शांत शाम और सुंदर सुइट्स।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070",
        },
        price: 7500,
        location: "Ontario",
        country: "Canada",
    },

    // --- CHANDIGARH ---
    {
        title: "The City Beautiful Resort",
        description: "चंडीगढ़ की मॉडर्न सड़कां के बीच एकदम लग्जरी स्टे।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070",
        },
        price: 5500,
        location: "Sector 35",
        country: "India",
    },
    {
        title: "Rose Garden Boutique",
        description: "फूलों की वादियों में बण्यो एक सुंदर होटल।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070",
        },
        price: 4000,
        location: "Sector 16",
        country: "India",
    },

    // --- OTHER TOP LOCATIONS ---
    {
        title: "Paris Eiffel Suites",
        description: "सीधो आइफिल टावर देखण खातिर बेस्ट रूम।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2070",
        },
        price: 22000,
        location: "Paris",
        country: "France",
    },
    {
        title: "Dubai Desert Safari Resort",
        description: "रेगिस्तान के बीचों-बीच लग्जरी टेंट हाउस।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?q=80&w=2070",
        },
        price: 15000,
        location: "Al Sahra",
        country: "UAE",
    },
    {
        title: "Bali Tropical Villa",
        description: "प्रकृति की गोद में और वॉटरफॉल के कनै।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2070",
        },
        price: 8000,
        location: "Ubud",
        country: "Indonesia",
    },
    {
        title: "Mumbai Marine Drive Stay",
        description: "अरब सागर की लहरों को सुकूं।",
        image: {
            filename: "listingimage",
            url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070",
        },
        price: 6500,
        location: "Mumbai",
        country: "India",
    }
];

// --- 200+ डेटा खातिर Trick ---
// जे थानै डेटा और बढ़ाणो है, तो नीचे वाळो लूप काम में ले सको हो:
for (let i = 1; i <= 30; i++) {
    sampleListings.push({
        title: `Luxury Stay No. ${i}`,
        description: "आरामदायक कमरा और बेस्ट सर्विस को मज़ो ल्याओ।",
        image: imageAt(i),
        price: 3000 + (i * 100),
        location: "Various Cities",
        country: "Global",
    });
}

module.exports = { data: sampleListings };
