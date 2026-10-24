# Design

## Decisions

1. **Shared recycle helper.** Move the generic parts of `argentina-recycle.js` (write item, metadata entry, name collision handling, own-copy detection, removal of the bin copy and the restored copy) to `stations/lib/recycle.js`. Argentina keeps its public behavior; `ct_station_argentina.spec.js` must pass unchanged.
2. **Chile bin items** (item ids `ct-chile-1..4`, original dir `C:\My Documents`):
   - `VACACIONES_1998.BMP`: a tiny valid BMP.
   - `TAREA_FINAL_FINAL.DOC`: a few lines of plain text, decoy.
   - `NO_ABRIR.TXT`: a short decoy, for example `No hay nada aqui. Te lo dije.`
   - `BACKUP_2359.TXT` (the answer):
```
No todas las papeleras guardan archivos.
Mi version fisica recibe aquello que ya no necesitamos.
Busca el lugar donde la oficina descarta o recicla sus residuos.
```
   Decoy texts are mine and can be changed by the user. Deletion times are fixed on 1999-12-31 (23:41, 23:47, 23:52, 23:59) so the last one matches the file name; shown wherever the bin shows the deletion date.
3. **Y2K files (verbatim).** `C:\My Documents\SYSTEM\ERROR.LOG`:
```
Y2K AGE CALCULATION FAILURE

SYSTEM CREATED: 1998
CURRENT SYSTEM YEAR: 2000
REPORTED AGE: 100

ACTION REQUIRED:
CALCULATE THE TRUE SYSTEM AGE.
USE THE RESULT TO RECOVER THE CORRECT MEMORY.
```
`MEMORY.TXT`: `MEMORIA 1` Donde todos pueden cocinar y conversar. / `MEMORIA 2` Cuando el ruido invade el sistema, alguien cierra una puerta y trabaja en un espacio que no comparte con los demas. / `MEMORIA 3` Donde las visitas anuncian su llegada. / `MEMORIA 4` Donde guardamos las cosas que no utilizamos todos los dias. Stored with the accents exactly as in the request, UTF-8, `\n`. The answer (`OFICINA PRIVADA`) is not written anywhere.
4. **Cleanup.** The Y2K station removes `SYSTEM/` and its files; the recycle station removes the four bin items and restored copies owned by it.
5. Both are registered in `registry.js` after the earlier Chile stations; independent of each other.

## Risks

- ZenFS `.metadata.json` truncation seen with back-to-back writes: the shared helper keeps its verify-and-retry, and four items are written sequentially.
- Refactor risk is contained by Argentina's existing spec.
