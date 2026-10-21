# Cinema Seat Manager en TypeScript: guía para aprender

## 1. Qué pide el proyecto (en 3 líneas)

- Un cine tiene una sala de 8 filas y 10 columnas; hay que modelarla como una matriz 2D (0 = libre, 1 = ocupado).
- El programa debe mostrar la sala (X / L con números de fila y columna), reservar asientos con validación, contar ocupados y libres, y encontrar dos asientos libres contiguos en la misma fila.
- Se prueba con 4 escenarios (vacía, parcial, casi llena, llena), con comentarios en cada función y sin usar clases ni objetos.

## 2. El plan

1. Elegir la estructura de datos: un arreglo de arreglos `number[][]`, donde `sala[fila][columna]` vale 0 o 1.
2. Escribir funciones pequeñas, una por tarea: `crearSala`, `mostrarSala`, `reservarAsiento`, `contarAsientos`, `buscarDosContiguos`.
3. Escribir dos utilidades para imprimir resultados claros: `informarContiguos` y `mostrarResumen`.
4. Armar 4 funciones de escenario que usan las anteriores y dejan evidencia en la consola.
5. Verificar: `npm run console` para ver la salida y `npm run typecheck` para que TypeScript no marque errores.

## 3. Paso a paso

Una idea que se repite en todo el código: el personal habla en números desde 1 (fila 1, columna 1), pero los arreglos empiezan en 0. Por eso cada función convierte con `- 1` o `+ 1` en un solo lugar.

### Constantes `FILAS` y `COLUMNAS`

- Qué hace: guarda 8 y 10 una sola vez.
- Por qué así: si mañana la sala cambia de tamaño, se cambia un número y no veinte.
- Concepto: evitar "números mágicos".

```ts
const FILAS = 8;
const COLUMNAS = 10;
```

### `crearSala()`

- Qué hace: construye la matriz de 8 x 10 con todos los asientos en 0 (libres).
- Por qué así: un bucle exterior crea cada fila y un bucle interior la llena de ceros. Así cada fila es un arreglo propio y no comparten memoria.
- Concepto: arreglos 2D y bucles anidados.

```ts
function crearSala(): number[][] {
  const sala: number[][] = [];
  for (let f = 0; f < FILAS; f++) {
    const fila: number[] = [];
    for (let c = 0; c < COLUMNAS; c++) fila.push(0);
    sala.push(fila);
  }
  return sala;
}
```

### `mostrarSala(sala)`

- Qué hace: imprime una línea de encabezado con columnas 1 a 10 y una línea por fila con `X` (ocupado) o `L` (libre).
- Por qué así: recorrer la matriz con dos bucles es la forma natural de "leer" una cuadrícula. Se arma un texto por fila y se imprime una sola vez, para que la fila quede en una línea.
- Concepto: bucles anidados, operador ternario (`condición ? a : b`).

```ts
for (let f = 0; f < FILAS; f++) {
  let linea = "Fila " + (f + 1) + ": ";
  for (let c = 0; c < COLUMNAS; c++) {
    linea += " " + (sala[f][c] === 1 ? "X" : "L") + " ";
  }
  console.log(linea);
}
```

### `reservarAsiento(sala, fila, columna)`

- Qué hace: marca un asiento como ocupado y devuelve un mensaje `[OK]` o `[ERROR]`.
- Por qué así: antes de cambiar nada hace dos validaciones en orden. Primero, que el asiento exista (si no, `sala[f][c]` daría `undefined` o fallaría). Segundo, que esté libre. Solo si pasa ambas, cambia 0 por 1. Con `return` temprano el código queda plano y fácil de leer.
- Concepto: validación con `if`, funciones con parámetros y valor de retorno. Nota: la matriz se modifica "en el lugar", porque los arreglos se pasan por referencia.

```ts
if (fila < 1 || fila > FILAS || columna < 1 || columna > COLUMNAS) {
  return "[ERROR] El asiento no existe.";
}
if (sala[fila - 1][columna - 1] === 1) {
  return "[ERROR] El asiento ya esta ocupado.";
}
sala[fila - 1][columna - 1] = 1;
return "[OK] Reserva confirmada.";
```

### `contarAsientos(sala)`

- Qué hace: devuelve `[ocupados, libres]`.
- Por qué así: dos contadores que arrancan en 0 y un recorrido completo. Se devuelve un arreglo de dos números porque el proyecto prohíbe objetos.
- Concepto: acumuladores, retornar varios valores con un arreglo. Es una función "pura": solo lee la sala y no la modifica.

```ts
let ocupados = 0;
let libres = 0;
for (let f = 0; f < FILAS; f++) {
  for (let c = 0; c < COLUMNAS; c++) {
    if (sala[f][c] === 1) ocupados++; else libres++;
  }
}
return [ocupados, libres];
```

### `buscarDosContiguos(sala)`

- Qué hace: devuelve las posiciones del primer par de asientos libres vecinos en la misma fila, o `[]` si no hay.
- Por qué así: se revisa cada asiento junto con el de su derecha (`c` y `c + 1`). El bucle de columnas llega hasta `COLUMNAS - 1` para no salirse de la fila. En cuanto encuentra un par hace `return`, así se cumple "devuelve el primero". El arreglo vacío significa "no hay", y quien llama lo comprueba con `length === 0`.
- Concepto: recorrer buscando un patrón, salida temprana con `return`, límites de los bucles. También es una función pura.

```ts
for (let f = 0; f < FILAS; f++) {
  for (let c = 0; c < COLUMNAS - 1; c++) {
    if (sala[f][c] === 0 && sala[f][c + 1] === 0) {
      return [[f + 1, c + 1], [f + 1, c + 2]];
    }
  }
}
return [];
```

### `informarContiguos(sala)` y `mostrarResumen(sala)`

- Qué hacen: convierten los resultados de las funciones anteriores en mensajes claros para el personal (`[PAREJA]`, `[SIN PAREJA]`, "Ocupados: 13 | Libres: 67").
- Por qué así: separar "calcular" de "mostrar". Las funciones de cálculo no imprimen nada, así que se pueden reutilizar y probar sin ruido.
- Concepto: separación de responsabilidades.

```ts
const par = buscarDosContiguos(sala);
if (par.length === 0) {
  console.log("[SIN PAREJA] No hay dos asientos libres contiguos.");
} else {
  console.log("[PAREJA] Fila " + par[0][0] + ", columnas " + par[0][1] + " y " + par[1][1]);
}
```

### Los 4 escenarios

- Qué hacen: cada uno arma una sala distinta con las mismas funciones y muestra el resultado.
  1. Vacía: todo libre; la primera pareja es fila 1, columnas 1 y 2.
  2. Parcial: fila 1 llena y tres asientos de la fila 2; la pareja pasa a fila 2, columnas 4 y 5. Después de reservarlas, salta a las columnas 6 y 7.
  3. Casi llena: se llena todo y se liberan 5 asientos que no son vecinos; no hay pareja.
  4. Llena: 80 ocupados, 0 libres, no hay pareja y cualquier reserva da error.
- Por qué así: son los casos límite que ponen a prueba el código (nada ocupado, mezcla, casi nada libre, nada libre).
- Concepto: pruebas con casos límite.

```ts
// Casi llena: llenamos todo y liberamos asientos sueltos
sala[0][0] = 0; // fila 1, columna 1
sala[1][4] = 0; // fila 2, columna 5
sala[3][9] = 0; // fila 4, columna 10
```

## 4. Cómo correrlo

```bash
npm install          # una sola vez, instala las dependencias de la plantilla
npm run console      # ejecuta src/main.ts con tsx y muestra los 4 escenarios
npm run typecheck    # tsc --noEmit: debe terminar sin errores
```

Salida esperada, resumida:

| Escenario | Ocupados / Libres | Pareja contigua |
|---|---|---|
| 1. Vacía | 0 / 80 | fila 1, columnas 1 y 2 |
| 2. Parcial | 13 / 67 | fila 2, columnas 4 y 5 (luego 6 y 7) |
| 3. Casi llena | 75 / 5 | ninguna |
| 4. Llena | 80 / 0 | ninguna |

También se ven mensajes de reserva como `[OK] Reserva confirmada: fila 2, columna 4.` y `[ERROR] El asiento fila 2, columna 2 ya esta ocupado.`

## 5. Tres preguntas que un instructor podría hacer

**1. ¿Por qué `sala[fila - 1][columna - 1]` y no `sala[fila][columna]`?**
Porque el personal cuenta desde 1 y los arreglos desde 0. Si el usuario dice fila 1, es la posición 0. Convertir en la función evita confusiones, y por eso la validación usa `fila < 1 || fila > FILAS`.

**2. ¿Qué pasa si se intenta reservar un asiento que ya está ocupado o que no existe? ¿Por qué se valida antes de cambiar el valor?**
La función devuelve un `[ERROR]` y no toca la matriz. Se valida primero porque, si no, se podría "reservar" dos veces el mismo asiento sin avisar, o acceder a una posición fuera de la sala (`sala[8]` es `undefined` y daría un error al leer `sala[8][0]`).

**3. En `buscarDosContiguos`, ¿por qué el bucle de columnas llega solo hasta `COLUMNAS - 1`? ¿Y cómo sabe que es "el primero"?**
Porque en cada vuelta se mira el asiento `c` y el siguiente `c + 1`; en la última columna no hay "siguiente" y se saldría de la fila. Como se recorre de arriba abajo y de izquierda a derecha, y se hace `return` al primer par libre, ese par es el primero. Si termina sin encontrar nada, devuelve `[]`.
