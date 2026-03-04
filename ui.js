// ==========================================================================
// KINETIC LUXURY UI MODULE - MAR DEL PLATA
// ==========================================================================

/**
 * 1. Inyección de JSON-LD (Schema.org) para Mar del Plata
 */
function injectLocalBusinessSchema() {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BeautySalon", // O HairSalon, Spa, según corresponda
        "name": "Tu Marca Exclusiva",
        "image": "https://www.tumarca.com.ar/assets/og-image-aspiracional.jpg",
        "url": "https://www.tumarca.com.ar/",
        "telephone": "+54-223-123-4567",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Güemes 1234",
            "addressLocality": "Mar del Plata",
            "addressRegion": "Buenos Aires",
            "postalCode": "B7600",
            "addressCountry": "AR"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": -38.0004,
            "longitude": -57.5562
        },
        "priceRange": "$$$",
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "09:00",
                "closes": "20:00"
            }
        ],
        "sameAs": [
            "https://www.instagram.com/tumarca",
            "https://www.facebook.com/tumarca"
        ]
    });
    document.head.appendChild(script);
    console.log('[SEO] Schema.org LocalBusiness inyectado (Mar del Plata)');
}

/**
 * 2. Router de Vistas Dinámicas (Landing vs App de Turnos)
 */
function initRouter() {
    const appRoot = document.getElementById('app-root');

    // Mapeo simple de rutas a HTML (en un caso real, podrían ser componentes)
    const routes = {
        '#landing': `
            <main class="view-container" style="animation: fadeIn 0.5s ease-in-out;">
                <div class="glass-card" style="text-align: center; max-width: 600px;">
                    <h1 style="color: var(--accent-color); margin-bottom: 1rem;">Descubrí tu Mejor Versión</h1>
                    <p>Accedé a nuestra oferta gancho exclusiva por tiempo limitado en Mar del Plata.</p>
                    <div style="margin: 2rem 0;">
                        <span style="font-size: 1.2rem; color: #aaa; text-decoration: line-through;">Valor real: $<span class="counter" data-target="25000">0</span></span><br>
                        <strong style="font-size: 2rem; color: var(--accent-color);">Hoy: $<span class="counter" data-target="9900">0</span></strong>
                    </div>
                    <a href="#app" class="btn-luxury">Reservar Turno Ahora</a>
                </div>
            </main>
        `,
        '#app': `
            <main class="view-container" style="animation: fadeIn 0.5s ease-in-out;">
                <div class="glass-card" style="text-align: center; max-width: 600px; width: 100%;">
                    <h2 style="color: var(--accent-color); margin-bottom: 1rem;">App de Turnos</h2>
                    <p>Seleccioná tu servicio exclusivo:</p>

                    <div style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1.5rem; text-align: left;">
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                            <span>Corte y Styling Kinetic</span>
                            <button class="btn-luxury service-btn" data-price="15000" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Seleccionar</button>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                            <span>Coloración Luxury</span>
                            <button class="btn-luxury service-btn" data-price="35000" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Seleccionar</button>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px;">
                            <span>Tratamiento Glass Hair</span>
                            <button class="btn-luxury service-btn" data-price="22000" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Seleccionar</button>
                        </div>
                    </div>

                    <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
                        <h3>Total a abonar: $<span id="total-price" class="counter" data-target="0">0</span></h3>
                    </div>

                    <a href="#landing" style="display: inline-block; margin-top: 1rem; color: #aaa; text-decoration: none; font-size: 0.9rem;">← Volver a la oferta</a>
                </div>
            </main>
        `
    };

    function renderView() {
        const hash = window.location.hash || '#landing';
        const content = routes[hash] || routes['#landing'];

        // Transición suave (fade out)
        appRoot.style.opacity = 0;

        setTimeout(() => {
            appRoot.innerHTML = content;
            appRoot.style.opacity = 1;

            // Re-inicializar contadores tras el render
            initCounters();

            // Event listeners específicos para la App
            if (hash === '#app') {
                bindAppEvents();
            }
        }, 300); // 300ms de fade
    }

    // Escuchar cambios de hash para navegar sin recargar
    window.addEventListener('hashchange', renderView);

    // Renderizado inicial
    renderView();
}

/**
 * 3. Animación Counter-up (Hardware-accelerated 60fps)
 */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Divisor para la velocidad (menor es más rápido)

    counters.forEach(counter => {
        // Cancelar animación previa si existe para evitar race conditions
        if (counter.animationId) {
            cancelAnimationFrame(counter.animationId);
        }

        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/\./g, ''); // Remover puntos si los hay

        if (count === target) {
            counter.innerText = target.toLocaleString('es-AR');
            return;
        }

        const updateCount = () => {
            const current = +counter.innerText.replace(/\./g, '');
            // Calcular incremento: basado en la diferencia
            const inc = (target - current) / (speed / 16); // asumiendo ~16ms por frame (60fps)

            if (
                (inc > 0 && current < target) ||
                (inc < 0 && current > target)
            ) {
                // Agregar clase para efecto visual durante el conteo
                counter.style.color = 'var(--accent-color)';
                counter.style.transform = 'scale(1.1)';
                counter.style.display = 'inline-block';
                counter.style.transition = 'transform 0.1s ease';

                // Formatear con separador de miles
                // Si incrementa, usamos ceil, si decrementa usamos floor
                const nextVal = inc > 0 ? Math.ceil(current + inc) : Math.floor(current + inc);

                // Prevenir pasarse del target por redondeos
                counter.innerText = (inc > 0 ? Math.min(nextVal, target) : Math.max(nextVal, target)).toLocaleString('es-AR');
                counter.animationId = requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target.toLocaleString('es-AR');
                // Restaurar estilo normal al terminar
                counter.style.transform = 'scale(1)';
                // Dejar un pequeño brillo final
                setTimeout(() => {
                    if(!counter.closest('strong') && !counter.closest('h3')) {
                        counter.style.color = 'inherit';
                    }
                }, 300);
            }
        };

        counter.animationId = requestAnimationFrame(updateCount);
    });
}

/**
 * Lógica específica para interactuar con la vista de la App
 */
function bindAppEvents() {
    const serviceBtns = document.querySelectorAll('.service-btn');
    const totalPriceEl = document.getElementById('total-price');
    let total = 0;

    serviceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const price = parseInt(this.getAttribute('data-price'));

            // Toggle selection
            if (this.classList.contains('selected')) {
                this.classList.remove('selected');
                this.style.background = 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)';
                this.innerText = 'Seleccionar';
                total -= price;
            } else {
                this.classList.add('selected');
                this.style.background = '#2c3e50'; // Primary color
                this.innerText = 'Seleccionado ✓';
                total += price;
            }

            // Actualizar el data-target del total y relanzar la animación
            totalPriceEl.setAttribute('data-target', total);
            initCounters();
        });
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    injectLocalBusinessSchema();
    initRouter();

    // Inyectar keyframes para fadeIn si no existen
    if (!document.getElementById('kinetic-animations')) {
        const style = document.createElement('style');
        style.id = 'kinetic-animations';
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
});
