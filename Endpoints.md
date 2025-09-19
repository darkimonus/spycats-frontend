# Spy Cats API — Endpoints and Schemas

All endpoints use JSON. Status codes shown per operation. Swagger UI is available at `/docs/`.

## Spy Cats

- GET `/cats/spycats/` — List spy cats
  - 200: `[SpyCat]`

- POST `/cats/spycats/` — Create spy cat
  - Body:
    ```json
    { "name": "string", "experience": 0, "breed": "string", "salary": 0 }
    ```
  - Validations:
    - `experience`: integer 0–15
    - `breed`: validated against TheCatAPI; 400 on invalid/unavailable
  - 201: `SpyCat`
  - 400: field errors

- GET `/cats/spycats/{id}/` — Get spy cat
  - 200: `SpyCat`
  - 404: not found

- PATCH `/cats/spycats/{id}/` — Update salary
  - Body:
    ```json
    { "salary": 0 }
    ```
  - 202: full `SpyCat` object after update
  - 400/404: errors

- DELETE `/cats/spycats/{id}/` — Delete spy cat
  - 204: no content
  - 404: not found

Schema: `SpyCat`
```json
{ "id": 1, "name": "string", "experience": 0, "breed": "string", "salary": 0 }
```

## Missions

- GET `/missions/` — List missions
  - 200: `[Mission]`

- POST `/missions/` — Create mission with targets
  - Body:
    ```json
    {
      "cat": 1,              // optional, null allowed
      "is_complete": false,  // optional
      "targets": [           // required, 1–3 items
        { "name": "string", "country": "string", "notes": "string", "is_complete": false }
      ]
    }
    ```
  - Rules/validations:
    - `targets` array must have 1–3 items
    - If `cat` provided: cat must not have another active mission
    - If `is_complete=true`: all targets must be `is_complete=true`
  - 201: `Mission`
  - 400: field errors

- GET `/missions/{id}/` — Get mission
  - 200: `Mission`
  - 404: not found

- PATCH `/missions/{id}/` — Assign/unassign cat or complete mission
  - Body (any subset):
    ```json
    { "cat": 1, "is_complete": true }
    ```
  - Rules/validations:
    - Setting `cat`: cat must not have another active mission
    - Setting `is_complete=true`: all targets in mission must already be complete
  - 202: returns only updated fields (per request/update)
    ```json
    { "cat": 1, "is_complete": true }
    ```
  - 400/404: errors

- DELETE `/missions/{id}/` — Delete mission
  - Rule: cannot delete if assigned to a cat
  - 204: no content
  - 400: `{ "error": "Mission cannot be deleted as it is assigned to a cat." }`
  - 404: not found

Schema: `Mission`
```json
{
  "id": 1,
  "cat": 1,                // or null
  "is_complete": false,
  "targets": [Target]
}
```

Schema: `Target` (within mission responses)
```json
{ "id": 10, "name": "string", "country": "string", "notes": "string", "is_complete": false }
```

## Targets

Targets are created only inside a mission. Only updates are exposed.

- PATCH `/targets/{id}/` — Update notes and/or completion
  - Body (any subset):
    ```json
    { "notes": "string", "is_complete": true }
    ```
  - Rules:
    - Cannot update if the target is complete
    - Cannot update if the mission is complete
    - When the last target becomes complete, the mission auto-sets `is_complete=true`
  - 202: returns only updated fields (per request)
    ```json
    { "notes": "string", "is_complete": true }
    ```
  - 400/404: errors

## Documentation

- GET `/docs/` — Swagger UI
- GET `/redoc/` — Redoc UI
- GET `/openapi.json` — OpenAPI schema JSON

## Error Format

Validation errors return 400 with field-level messages, for example:
```json
{ "breed": ["Sphynkx is not a valid breed. Please enter a valid breed."] }
```
