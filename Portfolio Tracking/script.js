let userId = localStorage.getItem('userId') || generateUserId();
let holdings = [];
let messages = [];

// Initialize charts
function initCharts() {
    // Allocation Chart
    const allocationCtx = document.getElementById('allocationChart').getContext('2d');
    new Chart(allocationCtx, {
        type: 'pie',
        data: {
            labels: ['Stocks', 'Crypto', 'Forex', 'Commodities'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#60A5FA', '#34D399', '#F87171', '#FBBF24']
            }]
        }
    });

    // Performance Chart
    const performanceCtx = document.getElementById('performanceChart').getContext('2d');
    new Chart(performanceCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Portfolio Value',
                data: [100000, 105000, 103000, 110000, 115000, 124567.89],
                borderColor: '#60A5FA',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Basic validation
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }

    try {
        // Store user data
        localStorage.setItem('user', JSON.stringify({ email }));
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        
        // Initialize app
        await initializeApp();
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    location.reload();
}

function generateUserId() {
    const userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('userId', userId);
    return userId;
}

async function initializeApp() {
    await loadHoldings();
    initCharts();
    loadNews();
    loadChatMessages();
    setupWebSocket();
}

async function loadHoldings() {
    try {
        const response = await fetch('https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/db', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer zgkJhcaTBrb8QvMLsBMLd8gHZz32',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                appSlug: 'portfolio-tracker',
                action: 'read',
                table: 'holdings'
            })
        });

        const data = await response.json();
        if (!data.error) {
            holdings = data.data || [];
            renderHoldings();
        }
    } catch (error) {
        console.error('Error loading holdings:', error);
    }
}

function renderHoldings() {
    const tbody = document.getElementById('holdings-table');
    tbody.innerHTML = holdings.map(holding => `
        <tr>
            <td class="px-6 py-4">${holding.data.symbol}</td>
            <td class="px-6 py-4">${holding.data.market}</td>
            <td class="px-6 py-4">${holding.data.quantity}</td>
            <td class="px-6 py-4">$${holding.data.avgPrice}</td>
            <td class="px-6 py-4">$${holding.data.currentPrice || holding.data.avgPrice}</td>
            <td class="px-6 py-4 ${(holding.data.currentPrice || holding.data.avgPrice) > holding.data.avgPrice ? 'text-green-500' : 'text-red-500'}">
                ${((holding.data.currentPrice || holding.data.avgPrice) - holding.data.avgPrice).toFixed(2)}%
            </td>
            <td class="px-6 py-4">
                <button onclick="deleteHolding('${holding.id}')" class="text-red-600 hover:text-red-800">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function addHolding() {
    const market = document.getElementById('market-type').value;
    const symbol = document.getElementById('symbol').value.trim();
    const quantity = parseFloat(document.getElementById('quantity').value);
    const price = parseFloat(document.getElementById('price').value);

    // Basic validation
    if (!symbol || isNaN(quantity) || isNaN(price)) {
        alert('Please fill in all fields correctly.');
        return;
    }

    try {
        // API Call
        const response = await fetch('https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/db', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer zgkJhcaTBrb8QvMLsBMLd8gHZz32',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                appSlug: 'portfolio-tracker',
                action: 'create',
                table: 'holdings',
                data: {
                    market,
                    symbol,
                    quantity,
                    avgPrice: price,
                    currentPrice: price // Set same as purchase price initially
                }
            })
        });

        const data = await response.json();

        // Check API Response
        if (data.error) {
            console.error('Add Holding Error:', data.error);
            alert('Failed to add holding. Please try again.');
        } else {
            console.log('Holding added successfully:', data);
            await loadHoldings(); // Refresh the holdings table
            closeAddModal(); // Close modal after adding
        }
    } catch (error) {
        console.error('Network or API Error:', error);
        alert('An error occurred while adding holding. Please check your network and try again.');
    }
}


async function loadNews() {
    const newsFeed = document.getElementById('news-feed');
    newsFeed.innerHTML = `
        <div class="animate-pulse space-y-4">
            <div class="h-4 bg-gray-200 rounded w-3/4"></div>
            <div class="h-4 bg-gray-200 rounded"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
    `;

    try {
        const response = await fetch('https://newsapi.org/v2/top-headlines?category=business&apiKey=YOUR_NEWSAPI_KEY');
        const data = await response.json();

        if (data.status === 'ok' && data.articles.length > 0) {
            newsFeed.innerHTML = data.articles.slice(0, 5).map(article => `
                <div class="border-b pb-4">
                    <h4 class="font-semibold mb-1">${article.title}</h4>
                    <p class="text-sm text-gray-600">${article.description || ''}</p>
                    <a href="${article.url}" target="_blank" class="text-blue-500 text-sm">Read more</a>
                </div>
            `).join('');
        } else {
            newsFeed.innerHTML = '<p class="text-gray-500">No news available at the moment</p>';
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        newsFeed.innerHTML = '<p class="text-red-500">Failed to load news</p>';
    }
}


function loadChatMessages() {
    const mockMessages = [
        { user: 'John', message: 'The forex market is looking bullish today!' },
        { user: 'Sarah', message: 'Anyone watching USD/EUR?' },
        { user: 'Mike', message: 'Technical analysis suggests a breakout' },
        { user: 'Emma', message: 'Keep an eye on the Asian session' },
        { user: 'Alex', message: 'Market volatility is increasing' }
    ];

    const chatContainer = document.getElementById('chat-messages');
    chatContainer.innerHTML = mockMessages.map(msg => `
        <div class="flex space-x-2">
            <div class="font-semibold">${msg.user}:</div>
            <div>${msg.message}</div>
        </div>
    `).join('');
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    
    if (message) {
        const chatContainer = document.getElementById('chat-messages');
        chatContainer.innerHTML += `
            <div class="flex space-x-2">
                <div class="font-semibold">You:</div>
                <div>${message}</div>
            </div>
        `;
        input.value = '';
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

function showAddModal() {
    document.getElementById('add-modal').classList.remove('hidden');
}

function closeAddModal() {
    document.getElementById('add-modal').classList.add('hidden');
}

function toggleProfileMenu() {
    const menu = document.getElementById('profile-menu');
    menu.classList.toggle('hidden');
}

// Initialize on page load
const user = localStorage.getItem('user');
if (user) {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
    initializeApp();
}