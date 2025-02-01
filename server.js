require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // 允許解析 JSON

// 測試 API
app.get('/', (req, res) => {
    res.send('PostgreSQL API 正在運行 🚀');
});

// 取得所有用戶（Read）
app.get('/users', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// 新增用戶（Create）
app.post('/users', async (req, res) => {
    try {
        const { name, email } = req.body;
        const result = await pool.query(
            'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
            [name, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// 取得單一用戶（Read by ID）
app.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// 更新用戶（Update）
app.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});

// 刪除用戶（Delete）
app.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: '用戶不存在' });
        }

        res.json({ message: '用戶已刪除' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('伺服器錯誤');
    }
});





// 啟動伺服器
app.listen(PORT, () => {
    console.log(`✅ 伺服器運行於 http://localhost:${PORT}`);
});
