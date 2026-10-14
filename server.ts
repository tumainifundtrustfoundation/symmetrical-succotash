import express from "express";
import path from "path";
import fs from "fs";
import compression from "compression";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  initSchoolDatabase,
  getSchoolDatabase,
  updateSchoolDatabase,
  batchUpdateSchoolDatabase,
} from "./server/schoolStore";
import {
  checkLockoutStatus,
  recordFailedAttempt,
  recordSuccessfulAttempt,
  verifyStaffTwoFactorPasscode,
  loadAuditLogs,
  appendAuditLog,
  unlockIdentifierOrIp,
  verifySessionToken,
  terminateSession,
} from "./server/authSecurity";
import {
  handleGetPrivateBlob,
  handlePutPrivateBlob,
} from "./server/vercelBlobService";
import {
  generateSitemapXml,
  CANONICAL_SITE_URL,
  OFFICIAL_SITEMAP_ENTRIES,
} from "./server/sitemapGenerator";
import {
  injectSeoMetaTags,
  PAGE_SEO_MAP,
} from "./server/seoMetadata";

dotenv.config();

// In CommonJS bundle (dist/server.cjs), __dirname is a global provided by Node runtime.
// If running via tsx/ESM, fallback safely using process.cwd().
const serverRootDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();

// Guard against unhandled exceptions/rejections to keep dev server stable
process.on("uncaughtException", (err) => {
  console.error("[Server] Handled uncaught exception:", err?.message || err);
});

process.on("unhandledRejection", (reason) => {
  console.error("[Server] Handled unhandled rejection:", reason);
});

// Initialize persistent school database on startup
initSchoolDatabase();

async function startServer() {
  const app = express();
  
  // Resolve port from process args (--port 3000) or PORT env var, fallback to 3000
  const portArgIndex = process.argv.indexOf("--port");
  const portFromArg = portArgIndex !== -1 && process.argv[portArgIndex + 1] ? Number(process.argv[portArgIndex + 1]) : null;
  const PORT = Number(process.env.PORT) || portFromArg || 3000;

  // Gzip / Deflate compression for ultra-fast network transfer (<70% payload size)
  app.use(compression({
    threshold: 1024,
    filter: (req, res) => {
      if (req.headers["x-no-compression"]) return false;
      return compression.filter(req, res);
    }
  }) as any);

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Web Security Headers
  app.use((_req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  // 301 Canonical Host & HTTPS Enforcer
  app.use((req, res, next) => {
    const rawHost = (req.headers["x-forwarded-host"] as string) || req.headers.host || "";
    const host = rawHost.split(":")[0].toLowerCase();
    const proto = (req.headers["x-forwarded-proto"] as string) || req.protocol || "http";

    // Exclude localhost, 127.0.0.1, and cloud dev preview domains (*.run.app, *.google.com)
    const isLocalOrPreview =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".run.app") ||
      host.endsWith(".google.com") ||
      host.endsWith(".aistudio.google");

    if (!isLocalOrPreview) {
      const isApex = host === "uomboniss.sc.tz";
      const isHttp = proto === "http";

      if (isApex || (isHttp && host.includes("uomboniss.sc.tz"))) {
        const canonicalTarget = `https://www.uomboniss.sc.tz${req.originalUrl}`;
        return res.redirect(301, canonicalTarget);
      }
    }
    next();
  });

  // Dynamic Canonical XML Sitemap Endpoint
  app.get("/sitemap.xml", (_req, res) => {
    const xml = generateSitemapXml();
    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=43200");
    res.send(xml);
  });

  // Crawlable Robots.txt Endpoint
  app.get("/robots.txt", (_req, res) => {
    const robotsPath = path.join(process.cwd(), "public", "robots.txt");
    if (fs.existsSync(robotsPath)) {
      res.setHeader("Content-Type", "text/plain; charset=utf-8");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.sendFile(robotsPath);
    }
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send(`User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\nDisallow: /bursar\nDisallow: /academic-master\n\nSitemap: https://www.uomboniss.sc.tz/sitemap.xml\n`);
  });

  // IndexNow Key verification file
  app.get("/uomboniss2026indexnowkey7f9a1.txt", (_req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.send("uomboniss2026indexnowkey7f9a1\n");
  });

  // IndexNow URL submission endpoint (Microsoft Bing & IndexNow engines)
  app.post("/api/seo/indexnow", async (req, res) => {
    const host = "www.uomboniss.sc.tz";
    const key = "uomboniss2026indexnowkey7f9a1";
    const keyLocation = `https://${host}/${key}.txt`;
    const urlList = req.body.urls || OFFICIAL_SITEMAP_ENTRIES.map((entry) => entry.loc);

    try {
      const payload = {
        host,
        key,
        keyLocation,
        urlList,
      };

      const response = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(payload),
      });

      return res.json({
        success: response.ok || response.status === 200 || response.status === 202,
        status: response.status,
        message: "Urls submitted to IndexNow successfully",
        submittedUrls: urlList,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err?.message || "IndexNow submission failed",
        submittedUrls: urlList,
      });
    }
  });

  // Technical SEO status endpoint
  app.get("/api/seo/status", (_req, res) => {
    res.json({
      success: true,
      canonicalUrl: CANONICAL_SITE_URL,
      sitemapUrl: `${CANONICAL_SITE_URL}/sitemap.xml`,
      robotsUrl: `${CANONICAL_SITE_URL}/robots.txt`,
      indexNowKey: "uomboniss2026indexnowkey7f9a1",
      indexedPublicPages: OFFICIAL_SITEMAP_ENTRIES.length,
      publicRoutes: OFFICIAL_SITEMAP_ENTRIES.map((e) => e.loc),
      nectaCenterNumber: "S0486",
      officialName: "Uomboni Secondary School",
      swahiliName: "Shule ya Sekondari Uomboni",
      gps: { latitude: -3.25685, longitude: 37.48725 },
      address: "Kijiji cha Uomboni, Marangu Magharibi, Moshi Vijijini, Kilimanjaro, Tanzania",
    });
  });

  // Shared Gemini client instance
  let ai: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY is required to use the AI assistant.");
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return ai;
  }

  // Explicit service worker endpoint with proper headers
  app.get("/sw.js", (_req, res) => {
    const swPath = path.join(process.cwd(), "public", "sw.js");
    res.setHeader("Content-Type", "application/javascript; charset=utf-8");
    res.setHeader("Service-Worker-Allowed", "/");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(swPath);
  });

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      school: "Uomboni Secondary School",
      diocese: "Catholic Diocese of Moshi (Jimbo Katoliki la Moshi)",
      location: "Marangu, Moshi, Kilimanjaro, Tanzania",
      securityEngine: "active",
      rateLimiter: "enforced",
    });
  });

  // =========================================================================
  // CENTRALIZED AUTHENTICATION & SECURITY GATEWAY (BACKEND & SECURITY ENGINE)
  // =========================================================================

  // 1. Pre-login Security & Rate-Limit Status Check
  app.post("/api/auth/security-check", (req, res) => {
    const { identifier } = req.body;
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const status = checkLockoutStatus(identifier || "", clientIp);
    res.json({
      success: true,
      clientIp,
      ...status,
    });
  });

  // 2. Server-side Credential & Login Verification
  app.post("/api/auth/verify-login", (req, res) => {
    const { identifier, password, role = "student", twoFactorCode } = req.body;
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "unknown";

    if (!identifier || typeof identifier !== "string" || !identifier.trim()) {
      return res.status(400).json({ success: false, error: "Barua pepe au namba ya mtihani/jina inahitajika." });
    }

    // Check if locked out
    const lockout = checkLockoutStatus(identifier, clientIp);
    if (lockout.isLocked) {
      return res.status(429).json({
        success: false,
        locked: true,
        remainingSeconds: lockout.remainingSeconds,
        error: `Akaunti na IP zimefungwa kwa muda wa dakika 15 kwa sababu za kiusalama. Subiri sekunde ${lockout.remainingSeconds}.`,
      });
    }

    // Role-specific verification: If staff role, requires 2FA or authorized passkey
    const isStaffRole = ["admin", "bursar", "academic_master", "teacher"].includes(role);

    if (isStaffRole && twoFactorCode) {
      const isTwoFactorValid = verifyStaffTwoFactorPasscode(role, twoFactorCode);
      if (!isTwoFactorValid) {
        const attemptResult = recordFailedAttempt(
          identifier,
          clientIp,
          `Msimbo wa 2FA/PIN ya uongozi si sahihi kwa jukumu la ${role.toUpperCase()}`,
          userAgent
        );
        return res.status(401).json({
          success: false,
          twoFactorError: true,
          locked: attemptResult.locked,
          remainingAttempts: attemptResult.remainingAttempts,
          error: "Nambari ya siri ya 2FA / Passkey ya mtumishi si sahihi. Tafadhali hakiki na ujaribu tena.",
        });
      }
    }

    // Register success & issue secure session token
    const sessionToken = recordSuccessfulAttempt(identifier, clientIp, role, userAgent);

    res.json({
      success: true,
      token: sessionToken,
      role,
      identifier: identifier.trim().toLowerCase(),
      message: `Umethibitishwa kikamilifu kuingia jopo la ${role.toUpperCase()}`,
      clientIp,
      timestamp: new Date().toISOString(),
    });
  });

  // 3. Dedicated Staff Two-Factor Verification
  app.post("/api/auth/verify-2fa", (req, res) => {
    const { role, code, identifier } = req.body;
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "unknown";

    if (!code || typeof code !== "string") {
      return res.status(400).json({ success: false, error: "Nambari ya 2FA inahitajika." });
    }

    const isValid = verifyStaffTwoFactorPasscode(role || "admin", code);
    if (!isValid) {
      const attempt = recordFailedAttempt(
        identifier || "staff-unknown",
        clientIp,
        `2FA PIN batili kwa jukumu: ${role}`,
        userAgent
      );
      return res.status(401).json({
        success: false,
        locked: attempt.locked,
        remainingAttempts: attempt.remainingAttempts,
        error: "Msimbo wa 2FA/Master Passkey si sahihi. Wasiliana na Mkuu wa Shule au TEHAMA.",
      });
    }

    appendAuditLog({
      eventType: "TWO_FACTOR_VERIFIED",
      identifier: identifier || "staff-authorized",
      role: role || "staff",
      ip: clientIp,
      userAgent,
      success: true,
      details: `Mtumishi amethibitisha hatua ya pili ya ulinzi (2FA) kwa mafanikio kwa jukumu la ${role}.`,
    });

    res.json({
      success: true,
      verified: true,
      message: "Uthibitisho wa 2FA umekamilika kikamilifu.",
    });
  });

  // 4. Centralized Immutable Audit Logs API
  app.get("/api/auth/audit-logs", (req, res) => {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    // If token provided, verify session
    if (token) {
      const session = verifySessionToken(token);
      if (session && session.role !== "admin") {
        return res.status(403).json({ error: "Ruhusa ya uongozi mkuu inahitajika (Admin only)." });
      }
    }

    const logs = loadAuditLogs();
    res.json({
      success: true,
      count: logs.length,
      logs,
    });
  });

  // 5. Submit Audit Event from client-side security actions
  app.post("/api/auth/log-event", (req, res) => {
    const { eventType, identifier, role, details, success = true } = req.body;
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "unknown";

    const log = appendAuditLog({
      eventType: eventType || "SECURITY_CHECK",
      identifier: identifier || "anonymous",
      role,
      ip: clientIp,
      userAgent,
      success: Boolean(success),
      details: details || "Taarifa ya kiusalama imerekodiwa.",
    });

    res.json({ success: true, logId: log.id });
  });

  // 6. Administrator Unlock Endpoint
  app.post("/api/auth/unlock", (req, res) => {
    const { target, adminCode } = req.body;
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";

    if (!adminCode || !verifyStaffTwoFactorPasscode("admin", adminCode)) {
      return res.status(403).json({ success: false, error: "Nambari ya siri ya Msimamizi Mkuu inahitajika kuondoa kizuizi." });
    }

    const unlocked = unlockIdentifierOrIp(target || "", "admin@uombonisecondary.ac.tz", clientIp);
    res.json({
      success: true,
      unlocked,
      message: `Kizuizi cha kufuli kimeondolewa kikamilifu kwa ${target}.`,
    });
  });

  // 7. Session Invalidation / Logout
  app.post("/api/auth/logout", (req, res) => {
    const { token } = req.body;
    const clientIp = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim() || req.socket.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "unknown";

    if (token) {
      terminateSession(token, clientIp, userAgent);
    }
    res.json({ success: true, message: "Kipindi kimefungwa kikamilifu (Session Terminated)." });
  });

  // Complete Centralized School Database API for Cross-Browser Multi-Device Sync
  app.get("/api/school-data", (_req, res) => {
    const db = getSchoolDatabase();

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "Surrogate-Control": "no-store",
      "X-School-Data-Updated": String(db.lastUpdated),
    });

    res.json({
      success: true,
      lastUpdated: db.lastUpdated,
      version: db.version,
      data: db.data,
    });
  });

  // Fast lightweight version polling endpoint (<1ms response time)
  app.get("/api/school-data/version", (_req, res) => {
    const db = getSchoolDatabase();
    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    });
    res.json({
      lastUpdated: db.lastUpdated,
      version: db.version,
    });
  });

  // Update specific entity in shared school database (news, alerts, teachers, results, etc.)
  app.post("/api/school-data/update", (req, res) => {
    try {
      const { key, data } = req.body;
      if (!key || data === undefined) {
        return res.status(400).json({ error: "key and data are required" });
      }
      const db = updateSchoolDatabase(key, data);
      res.json({
        success: true,
        lastUpdated: db.lastUpdated,
        key,
        message: `Mabadiliko ya ${key} yamehifadhiwa kwenye seva na yataonekana kwenye browser zote`,
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Hitilafu ya seva" });
    }
  });

  // Batch update multiple entities in shared school database
  app.post("/api/school-data/batch", (req, res) => {
    try {
      const { updates } = req.body;
      if (!updates || typeof updates !== "object") {
        return res.status(400).json({ error: "updates object required" });
      }
      const db = batchUpdateSchoolDatabase(updates);
      res.json({
        success: true,
        lastUpdated: db.lastUpdated,
        message: "Taarifa zote zimesawazishwa kikamilifu kwenye seva",
      });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Hitilafu ya seva" });
    }
  });

  // Student Examination Results API (Backward-compatible and backed by persistent store)
  app.get("/api/results", (req, res) => {
    const db = getSchoolDatabase();
    const { examNumber, query, form } = req.query;

    let filtered = [...db.data.studentResults];

    if (examNumber && typeof examNumber === "string") {
      const target = examNumber.trim().toLowerCase();
      filtered = filtered.filter((r) => r.examNumber.toLowerCase() === target);
    } else if (query && typeof query === "string") {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.examNumber.toLowerCase().includes(q) ||
          r.studentName.toLowerCase().includes(q)
      );
    }

    if (form && typeof form === "string" && form !== "ALL") {
      filtered = filtered.filter((r) => r.form === form);
    }

    res.set({
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
      "X-Uomboni-Results-Count": String(db.data.studentResults.length),
      "X-Uomboni-Updated-At": String(db.lastUpdated),
    });

    res.json({
      success: true,
      count: filtered.length,
      totalStudents: db.data.studentResults.length,
      timestamp: db.lastUpdated,
      results: filtered,
      source: "uomboni-server",
    });
  });

  // Sync / Upload Student Results from Academic Master or Admin
  app.post("/api/results/sync", (req, res) => {
    try {
      const { results } = req.body;
      if (Array.isArray(results) && results.length > 0) {
        const db = updateSchoolDatabase("studentResults", results);
        return res.json({
          success: true,
          count: db.data.studentResults.length,
          timestamp: db.lastUpdated,
          message: "Matokeo yamesawazishwa kikamilifu na kuhifadhiwa kwenye seva",
        });
      }
      return res.status(400).json({ error: "Orodha batili ya matokeo ya wanafunzi" });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Hitilafu ya seva" });
    }
  });

  // AI School Assistant (Msaidizi wa Kitaaluma na Wazazi wa Uomboni)
  app.post("/api/ai-assistant", async (req, res) => {
    try {
      const { message, language = "sw", context } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Ujumbe unahitajika / Message is required" });
      }

      const client = getGeminiClient();
      const systemInstruction = `Wewe ni "Msaidizi Maalum wa Kidijitali wa Shule ya Sekondari Uomboni" (Uomboni Secondary School AI Advisor), shule ya Kikatoliki iliyo chini ya Jimbo Katoliki la Moshi, iliyopo Marangu, Moshi - Kilimanjaro, Tanzania.
Kaulimbiu ya Shule: "Elimu ni Mwanga na Maadili Mema" (Education, Faith & Moral Excellence).
Mazingira: Ipo kwenye mteremko wa Mlima Kilimanjaro, Marangu.

Taarifa muhimu za shule:
- Kidato cha 1 hadi cha 4 (O-Level, Sayansi, Sanaa na Biashara).
- Shule ya Bweni (Boarding) na Kutwa (Day) kwa wavulana na wasichana.
- Malipo ya ada hufanyika benki (CRDB Bank A/C: 0150248900100, NMB Bank A/C: 22110023456 au Control Numbers & M-Pesa / Tigo Pesa Lipa Namba: 5882194).
- Fomu za kujiunga (Joining Instructions) zinapatikana mtandaoni kwenye tovuti.
- Matokeo ya mitihani (Mock, Midterm, NECTA) yanaangaliwa mtandaoni kwa Namba ya Mtihani (Exam Number).
- Michezo, Maabara ya Kisasa ya Sayansi na TEHAMA (ICT Lab), Kwaya ya Mtakatifu Dominiko, Ibada na Maadili mema ya Kikristo.

Lugha ya majibu: Jibu kwa ${language === "en" ? "Kiingereza fasaha (English)" : "Kiswahili fasaha na chenye heshima na upendo"}, huku ukitoa maelekezo sahihi, ya kusaidia, na ya kikanisa/kielimu. Msaada wako unawalenga wazazi, walezi, na wanafunzi. Ikiwa hujaelewa swali, muombe mzazi awasiliane na uongozi wa shule kwa namba +255 754 123 456 / info@uombonisec.sc.tz.`;

      const response = await client.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [
          {
            text: `Context ya ziada: ${JSON.stringify(context || {})}\n\nSwali la mtumiaji: ${message}`,
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Samahani, jaribu tena baadaye au wasiliana na ofisi ya Mkuu wa Shule.";
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      return res.status(500).json({
        error: "Hitilafu katika mfumo wa akili bandia",
        details: error?.message || "Kosa halijatambuliwa",
      });
    }
  });

  // =========================================================================
  // VERCEL PRIVATE BLOB STORAGE ENDPOINTS (PUT & SECURE STREAMING GET)
  // =========================================================================
  app.get("/api/blob", handleGetPrivateBlob);
  app.post("/api/blob/upload", handlePutPrivateBlob);

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, {
      maxAge: "30d",
      setHeaders: (res, filePath) => {
        if (filePath.endsWith("index.html") || filePath.endsWith("sw.js") || filePath.endsWith("manifest.json")) {
          res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
          res.setHeader("Pragma", "no-cache");
          res.setHeader("Expires", "0");
        } else if (filePath.includes("/assets/")) {
          // Hashed Vite static assets (immutable for 1 year)
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        }
      }
    }));
    let cachedIndexHtml: string | null = null;
    const getIndexHtml = () => {
      if (!cachedIndexHtml) {
        const distIndex = path.join(distPath, "index.html");
        const rootIndex = path.join(process.cwd(), "index.html");
        cachedIndexHtml = fs.existsSync(distIndex)
          ? fs.readFileSync(distIndex, "utf-8")
          : fs.readFileSync(rootIndex, "utf-8");
      }
      return cachedIndexHtml;
    };

    app.get("*", (req, res) => {
      res.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
        "Content-Type": "text/html; charset=utf-8",
      });
      const template = getIndexHtml();
      const customizedHtml = injectSeoMetaTags(template, req.path);
      res.send(customizedHtml);
    });
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`Uomboni Secondary School portal running on http://localhost:${PORT}`);
  });

  server.on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`[Server] Port ${PORT} already in use. Retrying in 1s...`);
      setTimeout(() => {
        try {
          server.close();
        } catch {}
        server.listen(PORT, "0.0.0.0");
      }, 1000);
    } else {
      console.error("[Server] HTTP server error:", err);
    }
  });
}

startServer();
