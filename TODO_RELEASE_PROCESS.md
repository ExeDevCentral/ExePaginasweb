# Proceso de Releases (para evitar múltiples versiones / deploys confusos)

## Objetivo
Garantizar que **Vercel despliegue siempre la misma versión “oficial”** y evitar que queden versiones viejas, ramas intermedias o deploys no alineados.

---

## Regla de oro
**Nunca deployar manualmente** desde ramas sueltas. Solo debe desplegarse:
- La rama **`main`** (versión oficial)
- o tags **`vX.Y.Z`** (versión oficial y congelada)

---

## Flujo recomendado (cuando hay cambios)

### 1) Crear rama de trabajo
```bash
git checkout -b feature/<descripcion>
```

### 2) Comitear y PR
- Haz commits en esa rama.
- Crea PR hacia `main`.
- Asegúrate de que CI/pipeline pase.

### 3) Merge a `main` (solo una fuente de verdad)
```bash
git checkout main
# asegurar que main está actualizado
# luego merge desde PR
```

### 4) Desplegar en Vercel desde `main`
En Vercel:
- Project Settings → Git
  - **Production Branch = main**
- Asegurar que el deploy automático esté habilitado para `main`.

### 5) Verificar que el deploy corresponde al commit de `main`
- En tu repo local, verifica el commit:
  ```bash
  git rev-parse HEAD
  ```
- En Vercel, revisa el commit asociado al último deployment (Deployments → seleccionar el deploy).

---

## Congelar versión con tags (opcional pero recomendado)
Cuando el release sea importante (por ejemplo, un cambio de IA / pasarela / performance):

1) Actualizar `main` y asegurarte de que `main` está listo.
2) Crear tag:
```bash
git tag -a vX.Y.Z -m "Release vX.Y.Z"
git push origin vX.Y.Z
```

En Vercel puedes configurarlo para desplegar tags (si deseas) o crear un deploy “desde tag”.

---

## Checklist anti-error (antes de decir “ya está en producción”)

- [ ] En Vercel → Project Settings → Git → Production Branch = `main`
- [ ] En Vercel → Deployments → el deploy de producción corresponde al commit esperado
- [ ] No hay redeploys manuales hechos desde otras ramas

---

## Acciones correctivas (si ya se desplegó algo viejo)
1) Confirmar el commit actual de `main`:
   ```bash
   git rev-parse HEAD
   ```
2) En Vercel, hacer **Redeploy/Trigger Deploy** del proyecto apuntando a `main`.
3) Esperar propagación del alias/dominio.

---

## Nota
Si alguna vez cambias la lógica de Vercel (build command, framework, output, etc.), documentar el cambio en este archivo y hacer un tag de release.

