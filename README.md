# 04_JoseCama-TrunkBaseDevelopment

## ¿Qué es Trunk-Based Development?
Trunk-Based Development es una estrategia de desarrollo de software donde todos los desarrolladores integran pequeños cambios frecuentes en una rama principal compartida, denominada `trunk` o `main`. Esta metodología promueve la colaboración continua y la entrega rápida de software.

## Beneficios de Trunk-Based Development
- **Integración Continua (CI):** Fomenta la integración constante de código, reduciendo problemas de fusión de ramas a largo plazo.
- **Despliegue Rápido:** Permite lanzamientos rápidos y frecuentes al mantener el `trunk` siempre en un estado desplegable.
- **Colaboración Eficiente:** Facilita la colaboración entre equipos al minimizar la divergencia del código.
- **Reducción de Riesgos:** Detecta errores y conflictos de manera temprana mediante pruebas automatizadas.

## Implementación de TBD en Microservicios:
### Estructura de Ramas
- **`main` (trunk):** La rama principal y única donde se integran todos los cambios.
- **`feature/{feature-name}`:** Ramas de corta duración para el desarrollo de nuevas características. Se deben fusionar rápidamente con `main`.
- **`hotfix/{hotfix-name}`:** Ramas para corregir errores críticos que requieren atención inmediata.

### Buenas Prácticas
1. **Integración Continua:**
   - Configura pipelines de CI/CD para ejecutar pruebas y verificaciones automáticas en cada commit a `main`.
   - Asegúrate de que el código en `main` siempre esté en un estado desplegable.

2. **Desarrollo de Funcionalidades:**
   - Divide las características grandes en tareas más pequeñas que puedan integrarse frecuentemente.
   - Realiza revisiones de código para garantizar la calidad y consistencia.

3. **Pruebas Automatizadas:**
   - Implementa pruebas unitarias y de integración para cada microservicio.
   - Asegura que todas las pruebas se ejecuten y pasen antes de fusionar cambios a `main`.

4. **Despliegue Continuo:**
   - Automatiza el despliegue de `main` a los entornos de desarrollo, prueba y producción.

### Ejemplo de Flujo de Trabajo:
1. **Crear una Nueva Funcionalidad:**
   - Crea una rama `feature/{feature-name}` desde `main`.
   - Implementa la funcionalidad y realiza commit frecuentemente.
   - Fusiona los cambios con `main` tan pronto como sea posible.

2. **Resolver un Error Crítico:**
   - Crea una rama `hotfix/{hotfix-name}` desde `main`.
   - Soluciona el error, realiza pruebas y fusiona de nuevo en `main`.

3. **Preparar un Lanzamiento:**
   - Los cambios en `main` son automáticamente desplegados en producción cuando cumplen con todos los criterios de calidad.
