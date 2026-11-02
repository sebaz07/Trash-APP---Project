# RastreaTuBasura — prototipo académico

Prototipo web local para explorar horarios de demostración, avisos y una ruta simulada. Los datos, sectores, fechas y posiciones son ficticios. No corresponde a un prestador oficial.

## Abrir el prototipo

1. Descomprime `RastreaTuBasura_Prototipo_v01.zip`.
2. Abre la carpeta `prototipo-rastreatubasura`.
3. Abre `index.html` en un navegador moderno. Para servirlo localmente, abre una terminal en esa carpeta y ejecuta `python -m http.server 8000`; luego visita `http://localhost:8000`.
4. Usa la navegación superior para ir a Inicio, Horarios, Avisos o Ruta simulada. Cambia de zona y prueba filtros, detalles, notificaciones locales y el botón de avance de la ruta.

No requiere cuentas, claves, servicios externos ni instalación de dependencias. Los datos de lectura de avisos se guardan solo en el almacenamiento local del navegador. Si el puerto 8000 está ocupado, usa otro puerto y abre la dirección correspondiente.

## Funciones demostrables

- Selección entre tres sectores ficticios y actualización del horario de muestra.
- Consulta de días, franjas horarias y tipos de residuos.
- Filtro de avisos por tipo, apertura de detalle y fecha visible.
- Vista esquemática de una ruta y avance/reinicio de la ubicación simulada.
- Bandeja de notificaciones local con marca de lectura persistente en ese navegador.
- Diseño adaptable a escritorio y móvil.

## Límites

No implementa GPS real, mapas geográficos, rutas operativas, horarios oficiales, cuentas, backend, mensajería, notificaciones push ni publicación de datos del operador. La ubicación es una animación de puntos de ejemplo y se identifica en pantalla como simulada.
