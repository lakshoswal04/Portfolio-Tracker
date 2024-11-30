Portfolio Tracker is a web application designed to help users monitor their investment portfolios across various markets, including stocks, crypto, forex, and commodities. The application allows users to manage their holdings, view performance charts, track market news, and engage in community chats.

This project is built with HTML, CSS (using Tailwind CSS), JavaScript, and the Chart.js library for visualization. It also integrates with APIs for data management and news fetching.

-Features

User Authentication

Simple login functionality with persistent user sessions using localStorage.
Portfolio Management

Add, view, and delete holdings.
Displays total portfolio value, P&L, and other metrics.
Data Visualization

Pie chart for portfolio allocation.
Line chart for performance tracking.
Market News

Fetch and display the latest market-related news.
Community Chat

Basic chat feature for user discussions.
Responsive Design

Mobile-first and optimized for all screen sizes.
Installation
Prerequisites
A modern browser (e.g., Chrome, Firefox)
Basic knowledge of HTML/CSS/JavaScript
A text editor (e.g., VS Code)
Steps to Run Locally
Clone the repository:

bash
Copy code

git clone https://github.com/yourusername/portfolio-tracker.git
cd portfolio-tracker
Open the index.html file in your browser:

Simply double-click the file or use a local server for better performance:
bash
Copy code
npx http-server .
Update API_KEY in script.js for the News API:

Sign up for a News API key and replace the placeholder API_KEY.
Folder Structure
bash
Copy code
portfolio-tracker/
├── index.html         # Main HTML file
├── style.css          # Custom styles
├── script.js          # Core functionality
├── README.md          # Documentation
└── assets/            # Static assets (images, etc.)

API Integration

Database API

Endpoint: https://r0c8kgwocscg8gsokogwwsw4.zetaverse.one/db
Actions: create, read, delete
Headers:
Authorization: Bearer zgkJhcaTBrb8QvMLsBMLd8gHZz32
Content-Type: application/json
Payload example for create:
json
Copy code
{
  "userId": "user_xxx",
  "appSlug": "portfolio-tracker",
  "action": "create",
  "table": "holdings",
  "data": {
    "market": "stocks",
    "symbol": "AAPL",
    "quantity": 10,
    "avgPrice": 150
  }
}
News API

Endpoint: https://newsapi.org/v2/top-headlines
Parameters:
country=us
apiKey=YOUR_API_KEY

- Usage Instructions
  
Login

Enter email and password to access the application.
Portfolio Management

Add holdings via the Add Holdings button.
View and manage your portfolio from the table.
Charts

Observe your portfolio's allocation and performance.
Market News

Stay updated with the latest financial news.
Community Chat

Participate in discussions in the chat section.


