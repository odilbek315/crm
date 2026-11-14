# B2B CRM & ERP Platforma - Phase 7 Production & DevOps Yo'riqnomasi

Ushbu qo'llanmada loyihani Docker yordamida ishlab chiqarish (production) rejimida ishga tushirish hamda **Ngrok** yordamida uni butun dunyoga (internetga) xavfsiz HTTPS protokoli orqali taqdim etish bosqichlari tushuntiriladi.

---

## 🐳 1. Docker yordamida loyihani ishga tushirish

Tizim optimallashtirilgan multi-stage `Dockerfile` va ma'lumotlar ombori doimiyligini saqlovchi volume-ga ega `docker-compose.yml` fayllari bilan to'liq jihozlangan.

### Ishga tushirish bosqichlari:

1. **Docker Desktop** dasturi kompyuteringizda yoqilganligiga ishonch hosil qiling.
2. Loyihaning ildiz (root) papkasida terminalni oching va quyidagi buyruqni bering:
   ```bash
   docker-compose up --build -d
   ```
   *Bu buyruq loyihani orqa fonda (-d) konteyner qilib quradi va ishga tushiradi.*

3. Konteyner ishga tushish jarayonini va loglarni kuzatish uchun:
   ```bash
   docker-compose logs -f
   ```

4. Konteynerni to'xtatish va o'chirish uchun:
   ```bash
   docker-compose down
   ```

> [!IMPORTANT]
> **Ma'lumotlar Doimiyligi (Volume Persistence):**
> SQLite ma'lumotlar ombori (`dev.db`) yo'qolib ketmasligi uchun `prisma-db-volume` nomli Docker volume ishlatilgan. Konteyner qayta qurilsa yoki o'chirilsa ham mijozlar, hisob-fakturalar va audit jurnallari saqlanib qoladi.

---

## 🌐 2. Ngrok yordamida tizimni internetga ulash (Online Tunnel)

Ngrok yordamida siz local mashinada (Docker-da) ishlayotgan tizimni dunyo miqyosida ishlaydigan xavfsiz `https://...` havolasiga aylantira olasiz.

### Bosqichma-bosqich sozlash:

1. **Ngrok yuklab olish:**
   - [ngrok.com](https://ngrok.com) saytidan ro'yxatdan o'ting va tizimingizga mos versiyani yuklab oling.

2. **Authtoken ulash:**
   - Saytdan shaxsiy Authtoken-ni nusxalab oling va terminalda quyidagi buyruq orqali uni o'rnating:
     ```bash
     ngrok config add-authtoken <SIZNING_AUTHTOKEN_KALITINGIZ>
     ```

3. **Tunnelni boshlash:**
   - Quyidagi buyruq orqali Docker-ning `3000` portiga yo'naltirilgan xavfsiz HTTPS tunnelini boshlang:
     ```bash
     ngrok http 3000
     ```

4. **Havolani olish:**
   - Terminal oynasida Ngrok sizga taqdim etgan xavfsiz manzilni (masalan, `https://a1b2-34-56-78.ngrok-free.app`) topasiz.
   - Ushbu havolani istalgan brauzer yoki mobil telefondan ochib, tizimdan foydalanishingiz mumkin.

> [!TIP]
> **CORS va URL Sozlamalari Haqida:**
> Loyiha ishlab chiqarish (production) rejimida ishlaganda frontend (Vite) va backend (Express) bir xil `3000` portda birlashgan holda ishlaydi. Shuning uchun Ngrok havolasi orqali kirganingizda hech qanday CORS (Cross-Origin Resource Sharing) xatoliklari yuzaga kelmaydi va barcha API so'rovlar hamda dynamic Gemini AI javoblari bir tekisda ishlaydi.

---

## 🛠️ 3. Foydali Docker buyruqlari

* **Konteyner ichidagi ma'lumotlar omborini ko'rish (SQLite terminal):**
  ```bash
  docker exec -it crm-production-container npx prisma studio
  ```
* **Konteyner holatini tekshirish:**
  ```bash
  docker ps
  ```
* **Konteyner ichida buyruq ishga tushirish (masalan, qayta seed qilish):**
  ```bash
  docker exec -it crm-production-container node prisma/seed.js
  ```
