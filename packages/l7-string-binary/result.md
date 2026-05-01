# Benchmark Results: AVersion vs BVersion

## Условия прогона

- Dataset: `5000` строк
- Runs per case (median): `6`

## Результаты

### `at()`

- `AVersion at()`: `1851.34ms` (avg `74.054ms/op`)
- `BVersion at()`: `5.18ms` (avg `0.207ms/op`)
- Вывод: `BVersion at()` быстрее примерно в `357.51x`

### `forEach()`

- `AVersion forEach()`: `2.61ms`
- `BVersion forEach()`: `3.72ms`
- Вывод: `AVersion forEach()` быстрее примерно в `1.42x`

## Интерпретация

- `BVersion` отлично подходит для частого random access через `at()` (индексный доступ).
- Для линейного обхода `forEach()` текущая реализация `AVersion` пока выигрывает.
- Практический выбор:
  - если нагрузка в основном на `at()` -> предпочтителен `BVersion`;
  - если доминирует последовательный проход через `forEach()` -> `AVersion` быстрее в текущем виде.
