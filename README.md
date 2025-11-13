

# 🤖 mBot2-Projekt

**HTL Saalfelden – Systemplanung & Projektentwicklung 2024/2025**

[![NestJS](https://img.shields.io/badge/Backend-NestJS-red)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)](https://www.mongodb.com/)
[![MicroPython](https://img.shields.io/badge/Robot-MicroPython-blue)](https://micropython.org/)
[![Status](https://img.shields.io/badge/Status-Fertig-success)](#)
[![Version](https://img.shields.io/badge/Version-1.6-blueviolet)](#)

---

## 📘 Projektübersicht

Ziel dieses Projekts war die Entwicklung eines Systems zur **Fernsteuerung des mBot2-Roboters** über ein Web-Interface.
Die Anwendung ermöglicht die Steuerung, Visualisierung und Aufzeichnung von Fahrten über WLAN – kompatibel mit Laptop, Tablet oder Smartphone.

### 🎯 Hauptziele

1. **mBot2 fernsteuern** – über Joystick oder gespeicherte Route.
2. **Sensorwerte anzeigen** – z. B. Abstand, Lichtstärke, Neigung.
3. **Fahrten aufzeichnen & wiederholen** – inklusive Speicherung in MongoDB.
4. **Kartografie** – Umgebung automatisch erkunden und Karte erstellen.
5. **LEDs & Display steuern** – Farben, Texte und Status anzeigen.

---

## 👥 Projektteam

| Rolle         | Name                | Team      |
| ------------- | ------------------- | --------- |
| Projektleiter | Florian Hafner      | Backend 3 |
| Scrum Master  | Philip Ellmauthaler | Backend 3 |
| Entwickler    | Jonas Eder          | Backend 3 |

---

## 🧩 Systemarchitektur

### Komponentenübersicht

* **Frontend:** Web-App zur Steuerung (HTTP-Requests)
* **Backend:** NestJS API (TypeScript)
* **Robot:** mBot2 mit MicroPython
* **Datenbank:** MongoDB (gehostet auf AWS oder lokal)

### Kommunikationsfluss

| Verbindung         | Technologie | Beschreibung                             |
| ------------------ | ----------- | ---------------------------------------- |
| Frontend → Backend | HTTP / REST | API-Aufrufe zur Steuerung & Datenabfrage |
| Backend → mBot2    | UDP         | Bewegungs- & Sensordatenübertragung      |
| Backend → MongoDB  | Mongoose    | Speicherung von Tracks & Sensordaten     |

---

## ⚙️ Installation & Setup

### Voraussetzungen

* mBot2 mit **CyberPi** & WLAN
* Computer mit **Node.js (v18+)**, **npm**, **Python3**
* **MongoDB** lokal oder über **MongoDB Atlas**

---

### 🧱 Backend (NestJS)

```bash
# Repository klonen
git clone <repository-url>
cd mbot2-backend

# Abhängigkeiten installieren
npm install

# Umgebungsvariablen setzen (.env)
MBOT_IP=10.10.1.18
MBOT_PORT=8080
MONGO_URI=mongodb://localhost:27017/mbotdb

# Server starten
npm run start
```

➡ Backend erreichbar unter: **[http://localhost:3000](http://localhost:3000)**

---

### 🤖 mBot2 vorbereiten

1. WLAN konfigurieren:

   ```python
   cyberpi.network.config_sta("SSID", "PASSWORT")
   ```
2. MicroPython-Skript (`mbot2_server.py`) über **mBlock** hochladen
3. Sicherstellen, dass der Server auf **Port 8080** lauscht

---

### 🗄️ MongoDB konfigurieren

1. MongoDB starten oder Atlas-Verbindung einrichten
2. Verbindung in `.env` eintragen
3. Sammlungen werden automatisch beim ersten Start erstellt

---

### 🧪 Testen

| Endpunkt                               | Beschreibung                   |
| -------------------------------------- | ------------------------------ |
| `/status`                              | Verbindung prüfen              |
| `/move`                                | mBot bewegen                   |
| `/start-recording` / `/stop-recording` | Fahrt aufzeichnen              |
| `/replay`                              | gespeicherte Route wiedergeben |
| `/cartography`                         | Umgebungskarte erstellen       |

---

## 🧠 Nichtfunktionale Anforderungen

* **Performance:** Sensordaten-Update mindestens alle 5 Sekunden
* **Zuverlässigkeit:** Automatische Wiederverbindung bei WLAN-Abbruch
* **Portabilität:** Plattformunabhängig (PC, Tablet, Smartphone)
* **Speicherbedarf:**

  * Backend ~128 MB RAM
  * mBot-Code ~5 MB
* **Technologien:** NestJS, MongoDB, MicroPython, UDP



© 2025 Backend 3 – *Hafner, Ellmauthaler, Eder*

---

Möchtest du, dass ich daraus gleich eine fertige **README.md-Datei** (Markdown-Datei) erstelle, die du direkt ins GitHub-Repository legen kannst (inkl. Formatierung und Datei zum Download)?
