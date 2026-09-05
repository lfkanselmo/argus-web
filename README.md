# argus-web

Dashboard de Argus: listado de productos trackeados, gráfica de histórico de precio e historial
de alertas. Angular standalone + Signals, sin Angular Material — identidad visual propia (ver
[`SAD_Argus_Tracker_Precios.md`](../SAD_Argus_Tracker_Precios.md)) pendiente de definir en
`S-front-0`.

## Desarrollo local

```bash
npm install
npm start
```

Queda sirviendo en `http://localhost:4200`, apuntando por defecto a `argus-api` en
`http://localhost:8080`.

## Tests y build

```bash
npm run lint
npm test
npm run build
```
