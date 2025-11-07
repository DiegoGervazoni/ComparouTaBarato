/* server.js – backend Comparou Tá Barato
   Stack: Node + Express + PostgreSQL
   Executa no Render com PORT e DATABASE_URL
*/

const express = require("express");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

// ===== Config de ambiente
const PORT = Number(process.env.PORT) || 8081;
const HOST = "0.0.0.0";

// Conexão Postgres
// Render fornece DATABASE_URL. Ative SSL sem validar CA.
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL não definida nas variáveis do serviço");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ===== App
const app = express();
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// ===== Config de Login =====
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "1234"; // troque em produção
=======
// ===== Login simples
const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "1234";
>>>>>>> a3fd59c67a935979e15bd458e8093a59f1818b1e
const activeTokens = new Set();

<<<<<<< HEAD
// ===== Conexão MySQL (usa variáveis de ambiente na nuvem) =====
// Em desenvolvimento local, ficam os valores padrão abaixo
const db = mysql.createConnection({
  host:     process.env.DB_HOST || "localhost",
  user:     process.env.DB_USER || "root",
  password: process.env.DB_PASS || "12345",
  database: process.env.DB_NAME || "comparou",
  port:     Number(process.env.DB_PORT || 3306),
});

db.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao MySQL:", err);
    process.exit(1);
  }
  console.log("Conectado ao MySQL!");
});

// ===== Middleware de autenticação (aceita 'Bearer <token>') =====
function auth(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : h;
  if (token && activeTokens.has(token)) return next();
  return res.status(401).json({ error: "Não autorizado" });
}

// ===== Rotas de autenticação =====
app.post("/auth/login", (req, res) => {
  let { username, password } = req.body || {};
  username = (username || "").trim();
  password = (password || "").trim();
  if (username === ADMIN_USER && password === ADMIN_PASS) {
=======
const genToken = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

app.post("/login", (req, res) => {
  const { user, pass } = req.body || {};
  if (String(user) === ADMIN_USER && String(pass) === ADMIN_PASS) {
>>>>>>> a3fd59c67a935979e15bd458e8093a59f1818b1e
    const token = genToken();
    activeTokens.add(token);
    return res.json({ ok: true, token });
  }
  return res.status(401).json({ ok: false, error: "Credenciais inválidas" });
});

function auth(req, res, next) {
  const h = req.headers.authorization || "";
<<<<<<< HEAD
  const token = h.startsWith("Bearer ") ? h.slice(7) : h;
  if (token) activeTokens.delete(token);
  res.json({ ok: true });
});

app.get("/auth/check", (req, res) => {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : h;
  return res.json({ logged: token ? activeTokens.has(token) : false });
});

// ===== Rotas de dados =====
app.get("/promotions", (req, res) => {
  const sql = `
    SELECT id, product, brand, store, price, unit, category, region, updated_at
    FROM promotions
    ORDER BY updated_at DESC, id DESC`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar dados" });
    res.json(results);
  });
});

app.post("/promotions", auth, (req, res) => {
  const { product, brand, store, price, unit, category, region } = req.body || {};
  if (!product || !store || price === undefined || price === null || !unit || !category) {
    return res.status(400).json({ error: "Campos obrigatórios: product, store, price, unit, category" });
  }
  const sql = `
    INSERT INTO promotions (product, brand, store, price, unit, category, region, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`;
  db.query(
    sql,
    [product.trim(), brand || null, store.trim(), Number(price), unit.trim(), category.trim(), region || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao inserir promoção" });
      res.status(201).json({ ok: true, id: result.insertId });
    }
  );
});

app.put("/promotions/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

  const { product, brand, store, price, unit, category, region } = req.body || {};
  if (!product || !store || price === undefined || price === null || !unit || !category) {
    return res.status(400).json({ error: "Campos obrigatórios: product, store, price, unit, category" });
=======
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token || !activeTokens.has(token)) {
    return res.status(401).json({ error: "Não autorizado" });
  }
  next();
}

// ===== Healthcheck para o Render
app.get("/healthz", async (req, res) => {
  try {
    await pool.query("select 1");
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
>>>>>>> a3fd59c67a935979e15bd458e8093a59f1818b1e
  }
});

// ===== Inicialização do banco
async function ensureSchema() {
  const sql = `
<<<<<<< HEAD
    UPDATE promotions
       SET product=?, brand=?, store=?, price=?, unit=?, category=?, region=?, updated_at=NOW()
     WHERE id=?`;
  const params = [product.trim(), brand || null, store.trim(), Number(price), unit.trim(), category.trim(), region || null, id];
=======
    create table if not exists promotions (
      id serial primary key,
      product text not null,
      brand text,
      store text,
      price numeric(12,2) not null,
      unit text,
      category text,
      region text,
      updated_at timestamp not null default now()
    );
    create index if not exists idx_promotions_region on promotions(region);
    create index if not exists idx_promotions_product on promotions(product);
  `;
  await pool.query(sql);
}
>>>>>>> a3fd59c67a935979e15bd458e8093a59f1818b1e

// ===== Utilidades
function sanitizePromotion(p) {
  return {
    product: String(p.product || "").trim(),
    brand: String(p.brand || "").trim(),
    store: String(p.store || "").trim(),
    price: Number(p.price),
    unit: String(p.unit || "").trim(),
    category: String(p.category || "").trim(),
    region: String(p.region || "").trim(),
  };
}

function validPromotion(p) {
  return p.product && Number.isFinite(p.price);
}

// ===== Rotas CRUD
// Listagem com filtros opcionais ?region=...&q=...  q procura em product e brand
app.get("/promotions", async (req, res) => {
  try {
    const { region, q } = req.query;
    const where = [];
    const params = [];
    if (region && region !== "Todas") {
      params.push(String(region).toLowerCase());
      where.push("lower(region) = $" + params.length);
    }
    if (q) {
      params.push("%" + String(q).toLowerCase() + "%");
      where.push("(lower(product) like $" + params.length + " or lower(brand) like $" + params.length + ")");
    }
    const sql =
      "select id, product, brand, store, price::float8 as price, unit, category, region, updated_at from promotions" +
      (where.length ? " where " + where.join(" and ") : "") +
      " order by updated_at desc, id desc limit 500";
    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao listar promoções" });
  }
});

<<<<<<< HEAD
app.delete("/promotions/:id", auth, (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });
  db.query("DELETE FROM promotions WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: "Erro ao excluir promoção" });
    if (result.affectedRows === 0) return res.status(404).json({ error: "Promoção não encontrada" });
    res.json({ ok: true, id });
  });
});

// ===== Servir o front-end estático =====
// coloque seus arquivos do front em backend/public (index.html, app.js, style.css)
app.use(express.static(path.join(__dirname, "public")));

// ===== Start =====
const PORT = Number(process.env.PORT || 8081);
const HOST = "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
  console.log(`Abra no PC:  http://localhost:${PORT}`);
=======
// Criar
app.post("/promotions", auth, async (req, res) => {
  try {
    const p = sanitizePromotion(req.body || {});
    if (!validPromotion(p)) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }
    const sql =
      "insert into promotions (product, brand, store, price, unit, category, region) values ($1,$2,$3,$4,$5,$6,$7) returning id, product, brand, store, price::float8 as price, unit, category, region, updated_at";
    const params = [p.product, p.brand, p.store, p.price, p.unit, p.category, p.region];
    const { rows } = await pool.query(sql, params);
    res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao criar promoção" });
  }
});

// Atualizar
app.put("/promotions/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

    const p = sanitizePromotion(req.body || {});
    if (!validPromotion(p)) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes" });
    }
    const sql =
      "update promotions set product=$1, brand=$2, store=$3, price=$4, unit=$5, category=$6, region=$7, updated_at=now() where id=$8 returning id, product, brand, store, price::float8 as price, unit, category, region, updated_at";
    const params = [p.product, p.brand, p.store, p.price, p.unit, p.category, p.region, id];
    const { rows } = await pool.query(sql, params);
    if (!rows.length) return res.status(404).json({ error: "Registro não encontrado" });
    res.json(rows[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao atualizar promoção" });
  }
>>>>>>> a3fd59c67a935979e15bd458e8093a59f1818b1e
});

// Deletar
app.delete("/promotions/:id", auth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: "ID inválido" });

    const { rowCount } = await pool.query("delete from promotions where id=$1", [id]);
    if (!rowCount) return res.status(404).json({ error: "Registro não encontrado" });
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Erro ao remover promoção" });
  }
});

// ===== Front-end estático
app.use(express.static(path.join(__dirname, "public")));

// Qualquer rota não API devolve index.html
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/promotions") || req.path.startsWith("/login") || req.path.startsWith("/healthz")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== Start
(async () => {
  try {
    await ensureSchema();
    app.listen(PORT, HOST, () => {
      console.log(`Servidor rodando em http://${HOST}:${PORT}`);
      console.log(`Abra no PC:  http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error("Falha ao iniciar:", e);
    process.exit(1);
  }
})();
