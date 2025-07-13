// auction-api/index.js
const app = require('./server'); // server.js から Express アプリをインポート
const dotenv = require('dotenv');

dotenv.config(); // ここで .env をロード

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access API at http://localhost:${PORT}/api/auctions`);
  console.log(`Access search API at http://localhost:${PORT}/api/auctions/search?keyword=your_keyword`);
});