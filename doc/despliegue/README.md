# Guía de despliegue por cliente

Esta carpeta contiene **plantillas** para preparar workflows de despliegue por cliente.

> Importante: GitHub Actions **solo ejecuta workflows ubicados en** `.github/workflows/`.
>
> Los ficheros de esta carpeta son documentación y base de copia.

## Estrategia recomendada

- Una rama por cliente: `deploy_<cliente>`.
- Un workflow por cliente en `.github/workflows/`.
- Elegir plantilla según el tipo de despliegue:
  - Docker/Kubernetes
  - SCP/SSH
  - Paquete offline (descargable)

## Flujo por rama

1. Crear/actualizar el workflow del cliente (copiando una plantilla de esta carpeta).
2. Guardarlo en `.github/workflows/<cliente>.yml`.
3. Hacer push a la rama `deploy_<cliente>`.
4. El workflow se dispara con `on.push.branches: [deploy_<cliente>]`.

## Variables de entorno del build

Para cada app, el workflow debe generar `apps/<app>/.env.production` antes del build.

Recomendado para escalar a muchos clientes:

- Definir un **GitHub Environment** por cliente, por ejemplo `cabrera-prod`.
- Guardar ahí los secretos del cliente (`VITE_API_URL`, SSH, etc.).
- En el job del workflow usar `environment: <cliente>-prod`.

Variables mínimas habituales:

- `VITE_API_URL`
- `VITE_LEGACY_API_URL` (solo apps que usen wrapper legacy)

## Plantillas incluidas

- `plantilla_cliente_docker.yml`
- `plantilla_cliente_scp.yml`
- `plantilla_cliente_offline.yml`

## Descarga offline con GitHub CLI

Para clientes sin despliegue por SSH, usar la plantilla offline y descargar el artifact desde GitHub Actions.

1. Listar ejecuciones del workflow:

  ```bash
  gh run list --workflow "Build Cliente (Offline Package)" --branch deploy_<cliente>
  ```

2. Descargar artifact de una ejecución:

  ```bash
  gh run download <run-id> -n <cliente>-<app>-<sha> -D ./descargas
  ```

Notas:

- El nombre del artifact en la plantilla offline es `<cliente>-<app>-${{ github.sha }}`.
- GitHub entrega el artifact comprimido (zip) automáticamente.

## Checklist rápido por cliente

- Rama `deploy_<cliente>` creada
- Secrets definidos en GitHub (SSH, Docker, etc.)
- `VITE_API_URL` configurada para producción
- Nombre de app correcto en `@olula/<app>`
- Ruta de salida correcta: `apps/<app>/dist`
- Estrategia de rollback definida
