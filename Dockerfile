# 使用官方 Node.js LTS 版本作為基底映像
FROM node:20-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json & package-lock.json
COPY package*.json ./

# 安裝專案相依套件
RUN npm install

# 複製程式碼
COPY . .

# 設定環境變數（使用 dotenv 檔案）
ENV NODE_ENV=production

# 開放 API 埠口（Express 預設 5000）
EXPOSE 5000

# 啟動應用程式
CMD ["node", "server.js"]
