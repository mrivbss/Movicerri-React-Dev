# 🚌 MoviCerri — Smart Transport Dashboard

<div align="center">
  <img src="./favicon.png" alt="MoviCerri Logo" width="120" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(255, 69, 0, 0.3);" />
  <h3>Plataforma Inteligente de Transporte Público para la Comuna de Cerrillos</h3>
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
  [![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion/)
</div>

---

## 🌟 Acerca de MoviCerri

**MoviCerri** es una aplicación web moderna (SPA) diseñada para optimizar y transparentar la experiencia de transporte público en la comuna de Cerrillos. Esta plataforma permite a los ciudadanos monitorear tiempos de espera, registrar reportes de congestión o seguridad vial en tiempo real, simular paraderos inteligentes e interactuar con su tarjeta BIP virtual.

La aplicación cuenta con una **interfaz de usuario premium** con una estética ciberpunk, efecto glassmorphism, animaciones fluidas basadas en físicas e integración directa con base de datos en la nube.

---

## 🚀 Características Principales

*   **🎨 Diseño Visual Futurista (Glassmorphism):** Estructura ciberpunk ultra-moderna con fondos degradados complejos (`mesh gradients`), tarjetas translúcidas con desenfoque de fondo (`backdrop-filter`) y efectos luminosos de neón.
*   **🗺️ Mapa Interactivo en Tiempo Real:** Integración completa de mapas oscuros interactivos mediante **React-Leaflet** con marcadores dinámicos para paraderos críticos (con indicadores de severidad de demanda) y ubicación de buses.
*   **📊 Dashboard de Tiempos de Espera:** Gráficos neón dinámicos utilizando `react-chartjs-2` con datos reactivos para visualizar la congestión del transporte.
*   **🔐 Autenticación Real con Supabase:** Sistema seguro de Registro e Inicio de Sesión conectado en tiempo real a una base de datos PostgreSQL.
*   **🎛️ Panel de Administración Municipal:** Vista exclusiva (`/admin`) para la municipalidad de Cerrillos, donde se consolida el panel de control de alertas y el buzón de reportes de los ciudadanos en vivo.
*   **💳 Tarjeta BIP Virtual Interactiva 3D:** Simulación física tridimensional de la tarjeta BIP en el perfil de usuario. ¡Muévela con el mouse para ver físicas de inclinación en 3D en tiempo real!
*   **🔔 Sistema de Notificaciones Inteligentes (Toasts):** Alertas no intrusivas en pantalla utilizando `sonner` para informar eventos de alta demanda o éxito en los reportes.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend:** React 18, Vite.
*   **Estilos y Animaciones:** Vanilla CSS (Glassmorphic variables), Framer Motion (físicas 3D y transiciones).
*   **Mapas y Datos:** Leaflet (`react-leaflet`), Chart.js (`react-chartjs-2`).
*   **Iconografía:** Lucide Icons.
*   **Backend & DB:** Supabase (PostgreSQL Auth & Database).

---

## 💻 Instalación y Configuración Local

Sigue estos sencillos pasos para levantar el entorno de desarrollo:

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/Movicerri-React-Dev.git
cd Movicerri-React-Dev
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno (`.env`)
Crea un archivo llamado `.env` en la raíz del proyecto (toma como referencia el archivo `.env.example`) y añade tus claves de Supabase:
```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

### 4. Ejecutar el servidor local
```bash
npm run dev
```
La aplicación estará disponible en: [http://localhost:5173](http://localhost:5173)

---

## 🔑 Credenciales de Prueba

Una vez que tengas configurada tu base de datos en Supabase, puedes crear los usuarios que desees desde la pantalla de **Registro**.

Si deseas probar el **Panel de Administración Municipal (`/admin`)**, crea una cuenta con el correo del administrador en tu panel de Supabase:
*   **Correo:** `admin@movicerri.cl`
*   **Contraseña:** *(Cualquier contraseña que elijas en el registro)*

El sistema de autenticación detectará automáticamente este correo electrónico para desbloquear los privilegios de administrador en la interfaz web.

---

<div align="center">
  <p>Diseñado con ❤️ para la comunidad de Cerrillos.</p>
</div>
