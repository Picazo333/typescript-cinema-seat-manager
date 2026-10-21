// ============================================================
// Cinema Seat Manager (consola)
// Sala de 8 filas x 10 columnas representada con una matriz 2D.
//   0 = asiento libre   |   1 = asiento ocupado
// Sin clases ni objetos: solo arreglos, funciones y condicionales.
// ============================================================

// Constantes con el tamaño de la sala (así no repetimos "números mágicos").
const FILAS = 8;
const COLUMNAS = 10;

// ------------------------------------------------------------
// 1) Inicializa una matriz de FILAS x COLUMNAS con todo en 0 (libre).
//    Devuelve un arreglo de arreglos: sala[fila][columna].
// ------------------------------------------------------------
function crearSala(): number[][] {
  const sala: number[][] = [];
  for (let f = 0; f < FILAS; f++) {
    const fila: number[] = [];
    for (let c = 0; c < COLUMNAS; c++) {
      fila.push(0); // cada asiento empieza libre
    }
    sala.push(fila);
  }
  return sala;
}

// ------------------------------------------------------------
// 2) Imprime la sala en consola: X = ocupado, L = libre,
//    con números de columna arriba y número de fila a la izquierda.
// ------------------------------------------------------------
function mostrarSala(sala: number[][]): void {
  // Encabezado con los números de columna (1 a 10).
  let encabezado = "        ";
  for (let c = 1; c <= COLUMNAS; c++) {
    encabezado += String(c).padStart(2, " ") + " ";
  }
  console.log(encabezado);

  // Una línea por fila: "Fila 1:  L  L  X ..."
  for (let f = 0; f < FILAS; f++) {
    let linea = "Fila " + (f + 1) + ": ";
    for (let c = 0; c < COLUMNAS; c++) {
      const simbolo = sala[f][c] === 1 ? "X" : "L";
      linea += " " + simbolo + " ";
    }
    console.log(linea);
  }
}

// ------------------------------------------------------------
// 3) Reserva un asiento. Recibe fila y columna tal como las ve el
//    personal (empiezan en 1). Valida que el asiento exista y que
//    esté libre. Devuelve un mensaje de éxito o de error.
// ------------------------------------------------------------
function reservarAsiento(sala: number[][], fila: number, columna: number): string {
  // Validación 1: la posición debe estar dentro de la sala.
  if (fila < 1 || fila > FILAS || columna < 1 || columna > COLUMNAS) {
    return "[ERROR] El asiento fila " + fila + ", columna " + columna + " no existe (filas 1-" + FILAS + ", columnas 1-" + COLUMNAS + ").";
  }

  // Convertimos a índices del arreglo (empiezan en 0).
  const f = fila - 1;
  const c = columna - 1;

  // Validación 2: el asiento no puede estar ya ocupado.
  if (sala[f][c] === 1) {
    return "[ERROR] El asiento fila " + fila + ", columna " + columna + " ya esta ocupado.";
  }

  // Todo bien: lo marcamos como ocupado (0 -> 1).
  sala[f][c] = 1;
  return "[OK] Reserva confirmada: fila " + fila + ", columna " + columna + ".";
}

// ------------------------------------------------------------
// 4) Cuenta asientos ocupados y libres recorriendo toda la matriz.
//    Devuelve un arreglo de dos números: [ocupados, libres].
// ------------------------------------------------------------
function contarAsientos(sala: number[][]): number[] {
  let ocupados = 0;
  let libres = 0;
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLUMNAS; c++) {
      if (sala[f][c] === 1) {
        ocupados++;
      } else {
        libres++;
      }
    }
  }
  return [ocupados, libres];
}

// ------------------------------------------------------------
// 5) (Avanzado) Busca los primeros dos asientos libres contiguos
//    en la misma fila. Devuelve [[fila, col], [fila, col+1]] con
//    números base 1, o un arreglo vacío [] si no hay ninguno.
// ------------------------------------------------------------
function buscarDosContiguos(sala: number[][]): number[][] {
  for (let f = 0; f < FILAS; f++) {
    // Llegamos hasta COLUMNAS - 1 porque comparamos c con c + 1.
    for (let c = 0; c < COLUMNAS - 1; c++) {
      if (sala[f][c] === 0 && sala[f][c + 1] === 0) {
        return [[f + 1, c + 1], [f + 1, c + 2]]; // el primer par que aparezca
      }
    }
  }
  return []; // no se encontró ningún par
}

// ------------------------------------------------------------
// Utilidad: imprime un mensaje claro con el resultado de la búsqueda.
// ------------------------------------------------------------
function informarContiguos(sala: number[][]): void {
  const par = buscarDosContiguos(sala);
  if (par.length === 0) {
    console.log("[SIN PAREJA] No hay dos asientos libres contiguos en ninguna fila.");
  } else {
    console.log(
      "[PAREJA] Asientos contiguos libres: fila " + par[0][0] +
      ", columnas " + par[0][1] + " y " + par[1][1] + "."
    );
  }
}

// ------------------------------------------------------------
// Utilidad: imprime el resumen de ocupados y libres.
// ------------------------------------------------------------
function mostrarResumen(sala: number[][]): void {
  const conteo = contarAsientos(sala);
  console.log("Ocupados: " + conteo[0] + " | Libres: " + conteo[1] + " | Total: " + (conteo[0] + conteo[1]));
}

// ------------------------------------------------------------
// Utilidad: título de cada escenario de prueba.
// ------------------------------------------------------------
function titulo(texto: string): void {
  console.log("");
  console.log("==================================================");
  console.log(texto);
  console.log("==================================================");
}

// ============================================================
// ESCENARIOS DE PRUEBA
// ============================================================

// Escenario 1: sala vacía (todo libre).
function escenarioSalaVacia(): void {
  titulo("ESCENARIO 1: Sala vacia");
  const sala = crearSala();
  mostrarSala(sala);
  mostrarResumen(sala);
  informarContiguos(sala); // debe ser fila 1, columnas 1 y 2
  console.log(reservarAsiento(sala, 1, 1)); // reserva válida
  console.log(reservarAsiento(sala, 9, 3)); // fila inexistente
}

// Escenario 2: sala parcialmente ocupada.
function escenarioParcial(): void {
  titulo("ESCENARIO 2: Sala parcialmente ocupada");
  const sala = crearSala();
  // Ocupamos fila 1 completa y las columnas 1-3 de la fila 2.
  for (let c = 1; c <= COLUMNAS; c++) {
    reservarAsiento(sala, 1, c);
  }
  reservarAsiento(sala, 2, 1);
  reservarAsiento(sala, 2, 2);
  reservarAsiento(sala, 2, 3);
  mostrarSala(sala);
  mostrarResumen(sala);
  informarContiguos(sala); // debe ser fila 2, columnas 4 y 5
  console.log(reservarAsiento(sala, 2, 2)); // ya ocupado
  console.log(reservarAsiento(sala, 2, 4)); // libre: se reserva
  console.log(reservarAsiento(sala, 2, 5)); // libre: se reserva
  informarContiguos(sala); // ahora debe saltar a fila 2, columnas 6 y 7
}

// Escenario 3: sala casi llena, solo quedan asientos sueltos (sin pareja).
function escenarioCasiLlena(): void {
  titulo("ESCENARIO 3: Sala casi llena (solo asientos sueltos)");
  const sala = crearSala();
  // Primero llenamos toda la sala...
  for (let f = 1; f <= FILAS; f++) {
    for (let c = 1; c <= COLUMNAS; c++) {
      reservarAsiento(sala, f, c);
    }
  }
  // ...y luego liberamos 5 asientos que no son vecinos entre sí.
  sala[0][0] = 0; // fila 1, columna 1
  sala[1][4] = 0; // fila 2, columna 5
  sala[3][9] = 0; // fila 4, columna 10
  sala[5][2] = 0; // fila 6, columna 3
  sala[7][6] = 0; // fila 8, columna 7
  mostrarSala(sala);
  mostrarResumen(sala);
  informarContiguos(sala); // no debe haber pareja
  console.log(reservarAsiento(sala, 4, 10)); // reserva un asiento suelto
  console.log(reservarAsiento(sala, 4, 10)); // intento repetido: ya ocupado
}

// Escenario 4: sala completamente llena.
function escenarioLlena(): void {
  titulo("ESCENARIO 4: Sala completamente llena");
  const sala = crearSala();
  for (let f = 1; f <= FILAS; f++) {
    for (let c = 1; c <= COLUMNAS; c++) {
      reservarAsiento(sala, f, c);
    }
  }
  mostrarSala(sala);
  mostrarResumen(sala);
  informarContiguos(sala); // no debe haber pareja
  console.log(reservarAsiento(sala, 5, 5)); // ya ocupado
}

// ------------------------------------------------------------
// Punto de entrada: corre los 4 escenarios en orden.
// ------------------------------------------------------------
escenarioSalaVacia();
escenarioParcial();
escenarioCasiLlena();
escenarioLlena();

export {};
