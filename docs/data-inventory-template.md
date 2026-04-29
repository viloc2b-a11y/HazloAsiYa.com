# Plantilla de inventario de datos (TDPSA / GDPR / CCPA)

Rellena una fila por categoría de dato. Cruza con la salida de `npm run audit:data` (`docs/data-inventory-auto.json`).

| tipo de dato | lugar de almacenamiento | propósito | proveedores que lo reciben | plazo de retención | acceso / eliminación | base legal (TDPSA / GDPR) |
| --- | --- | --- | --- | --- | --- | --- |
| _ej. email_ | _Supabase / local_ | _cuenta, respuestas_ | _Cloudflare, …_ | _activa + 2 años_ | _/mis-datos/_ | _contrato / Art. 6.1.b_ |

## Campos detectados automáticamente

Tras `npm run audit:data`, copia aquí los hallazgos nuevos y completa las columnas que el script no puede inferir (KV, logs del Worker, etc.).

## Comentarios en código

Al añadir campos nuevos a formularios, documenta en el mismo archivo:

`// DATA: [tipo] [propósito] [retención] [base legal]`
